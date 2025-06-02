"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users, LogOut, MessageCircle, Wifi } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

interface OnlineUser {
  profile_id: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
}

export function RealTimeChat() {
  const { user, profile, signOut } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && profile) {
      initializeChat()
      updatePresence()
    }
  }, [user, profile])

  const initializeChat = async () => {
    try {
      // Create or get general chat conversation
      let { data: conversation, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("name", "General Chat")
        .eq("is_group", true)
        .single()

      if (error || !conversation) {
        // Create general chat
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            name: "General Chat",
            is_group: true,
            creator_id: user!.id,
          })
          .select("id")
          .single()

        if (createError) {
          console.error("Error creating conversation:", createError)
          return
        }
        conversation = newConversation
      }

      setConversationId(conversation.id)

      // Join the conversation
      await supabase.from("conversation_participants").upsert({
        conversation_id: conversation.id,
        profile_id: user!.id,
      })

      // Load messages and setup real-time
      await loadMessages(conversation.id)
      await loadOnlineUsers()
      setupRealtimeSubscriptions(conversation.id)
      setIsConnected(true)
    } catch (error) {
      console.error("Error initializing chat:", error)
    }
  }

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        profiles:sender_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error loading messages:", error)
      return
    }

    setMessages(data || [])
  }

  const loadOnlineUsers = async () => {
    const { data, error } = await supabase
      .from("presence")
      .select(`
        profile_id,
        profiles:profile_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("status", "online")

    if (error) {
      console.error("Error loading online users:", error)
      return
    }

    setOnlineUsers(data || [])
  }

  const setupRealtimeSubscriptions = (convId: string) => {
    // Subscribe to new messages
    const messageChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${convId}`,
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data, error } = await supabase
            .from("messages")
            .select(`
              id,
              content,
              created_at,
              sender_id,
              profiles:sender_id (
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single()

          if (!error && data) {
            setMessages((prev) => [...prev, data])
          }
        },
      )
      .subscribe()

    // Subscribe to presence changes
    const presenceChannel = supabase
      .channel("presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "presence",
        },
        () => {
          loadOnlineUsers()
        },
      )
      .subscribe()

    return () => {
      messageChannel.unsubscribe()
      presenceChannel.unsubscribe()
    }
  }

  const updatePresence = async () => {
    if (!user) return

    await supabase.from("presence").upsert({
      profile_id: user.id,
      status: "online",
      last_active: new Date().toISOString(),
    })

    // Update presence every 30 seconds
    const interval = setInterval(async () => {
      await supabase.from("presence").upsert({
        profile_id: user.id,
        status: "online",
        last_active: new Date().toISOString(),
      })
    }, 30000)

    return () => clearInterval(interval)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user) return

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: newMessage.trim(),
    })

    if (error) {
      console.error("Error sending message:", error)
      return
    }

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-blue-600">SkillSwap</h1>
              <div className="flex items-center space-x-1">
                <Wifi className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          {profile && (
            <div className="flex items-center space-x-2 mt-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{profile.full_name}</p>
                <p className="text-xs text-gray-500">@{profile.username}</p>
              </div>
            </div>
          )}
        </div>

        {/* Online Users */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Online Now
            </h2>
            <Badge className="animate-pulse bg-green-100 text-green-800">{onlineUsers.length}</Badge>
          </div>
          <div className="space-y-3">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.profile_id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={onlineUser.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{onlineUser.profiles.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{onlineUser.profiles.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">@{onlineUser.profiles.username}</p>
                </div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No one else is online right now</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="font-semibold text-lg">General Chat</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{onlineUsers.length} online</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
            >
              {message.sender_id !== user?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.profiles.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{message.profiles.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-200 ${
                  message.sender_id === user?.id
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {message.sender_id !== user?.id && (
                  <p className="text-xs font-medium mb-1 opacity-75">{message.profiles.full_name}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender_id === user?.id ? "text-blue-100" : "text-gray-500"}`}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.sender_id === user?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={!isConnected}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim() || !isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
