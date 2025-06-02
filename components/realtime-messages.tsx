"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Send, Phone, Video } from "lucide-react"
import { useRealtime } from "@/components/realtime-provider"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  avatar: string
  online: boolean
  isGroup?: boolean
  typing?: boolean
}

interface ChatMessage {
  id: string
  sender: string
  content: string
  time: string
  isOwn: boolean
}

export function RealtimeMessages() {
  const { onlineUsers, messages, addMessage } = useRealtime()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Mike Rodriguez",
      lastMessage: "Thanks for the cooking lesson! The tacos were amazing 🌮",
      time: "2 min ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: "2",
      name: "Tech Skills Group",
      lastMessage: "Sarah: Who's available for the React workshop tomorrow?",
      time: "15 min ago",
      unread: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      isGroup: true,
    },
  ])

  const [currentChat, setCurrentChat] = useState("1")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Mike Rodriguez",
      content: "Hey! Are you still available for that web design help?",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "I'm free this afternoon. What kind of project are you working on?",
      time: "10:32 AM",
      isOwn: true,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Update online status for conversations
  useEffect(() => {
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        online: onlineUsers.includes(conv.name),
      })),
    )
  }, [onlineUsers])

  // Simulate real-time messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: "Mike Rodriguez",
          content: getRandomMessage(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: false,
        }
        setChatMessages((prev) => [...prev, newMsg])

        // Update conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentChat
              ? { ...conv, lastMessage: newMsg.content, time: "just now", unread: conv.unread + 1 }
              : conv,
          ),
        )
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [currentChat])

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      }
      setChatMessages((prev) => [...prev, msg])
      setNewMessage("")

      // Update conversation
      setConversations((prev) =>
        prev.map((conv) => (conv.id === currentChat ? { ...conv, lastMessage: newMessage, time: "just now" } : conv)),
      )
    }
  }

  const currentConversation = conversations.find((c) => c.id === currentChat)

  return (
    <div className="flex h-[calc(100vh-200px)] space-x-4">
      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Messages
            <Badge className="animate-pulse">Live</Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                  currentChat === conversation.id ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => setCurrentChat(conversation.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.name}</p>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  {conversation.typing && <p className="text-xs text-blue-500 animate-pulse">typing...</p>}
                </div>
                {conversation.unread > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={currentConversation?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{currentConversation?.name[0]}</AvatarFallback>
                </Avatar>
                {currentConversation?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{currentConversation?.name}</CardTitle>
                <p className={`text-sm ${currentConversation?.online ? "text-green-600" : "text-gray-500"}`}>
                  {currentConversation?.online ? "Online now" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 ${
                    message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getRandomMessage(): string {
  const messages = [
    "That sounds great! When can we start?",
    "I'm really excited about this skill swap!",
    "Your expertise would be so helpful for my project",
    "Let me know what works best for your schedule",
    "Thanks for being so responsive!",
    "I have some ideas we could explore together",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}
