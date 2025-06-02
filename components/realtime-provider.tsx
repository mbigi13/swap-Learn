"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface RealtimeContextType {
  onlineUsers: string[]
  notifications: Notification[]
  messages: Message[]
  addMessage: (message: Message) => void
  markAsRead: (messageId: string) => void
  isConnected: boolean
}

interface Notification {
  id: string
  type: "message" | "event" | "achievement" | "poll"
  title: string
  content: string
  timestamp: Date
  read: boolean
  userId?: string
}

interface Message {
  id: string
  conversationId: string
  sender: string
  content: string
  timestamp: Date
  read: boolean
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Simulate initial online users
    setOnlineUsers(["Mike Rodriguez", "Emma Thompson", "Sarah Chen", "Alex Johnson"])

    // Simulate real-time notifications
    const notificationInterval = setInterval(() => {
      const notificationTypes = ["message", "event", "achievement", "poll"] as const
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: randomType,
        title: getNotificationTitle(randomType),
        content: getNotificationContent(randomType),
        timestamp: new Date(),
        read: false,
        userId: onlineUsers[Math.floor(Math.random() * onlineUsers.length)],
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
    }, 8000)

    // Simulate real-time messages
    const messageInterval = setInterval(() => {
      const senders = ["Mike Rodriguez", "Emma Thompson", "Sarah Chen"]
      const messageContents = [
        "Hey! Are you available for a skill swap?",
        "Thanks for the great session yesterday!",
        "I'm organizing a new workshop, interested?",
        "Your photography tips were amazing!",
        "Let's schedule our next exchange soon",
      ]

      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: "1",
        sender: senders[Math.floor(Math.random() * senders.length)],
        content: messageContents[Math.floor(Math.random() * messageContents.length)],
        timestamp: new Date(),
        read: false,
      }

      setMessages((prev) => [newMessage, ...prev.slice(0, 19)])
    }, 12000)

    // Simulate users going online/offline
    const userStatusInterval = setInterval(() => {
      const allUsers = ["Mike Rodriguez", "Emma Thompson", "Sarah Chen", "Alex Johnson", "Lisa Wang", "David Kim"]
      const randomCount = Math.floor(Math.random() * 4) + 2
      const shuffled = allUsers.sort(() => 0.5 - Math.random())
      setOnlineUsers(shuffled.slice(0, randomCount))
    }, 15000)

    return () => {
      clearInterval(notificationInterval)
      clearInterval(messageInterval)
      clearInterval(userStatusInterval)
      setIsConnected(false)
    }
  }, [])

  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev])
  }

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  return (
    <RealtimeContext.Provider
      value={{
        onlineUsers,
        notifications,
        messages,
        addMessage,
        markAsRead,
        isConnected,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case "message":
      return "New Message"
    case "event":
      return "Event Update"
    case "achievement":
      return "Achievement Unlocked!"
    case "poll":
      return "New Poll"
    default:
      return "Notification"
  }
}

function getNotificationContent(type: string): string {
  switch (type) {
    case "message":
      return "You have a new message from a community member"
    case "event":
      return "Someone just joined your upcoming event"
    case "achievement":
      return "You've earned a new badge for helping others"
    case "poll":
      return "A new community poll needs your input"
    default:
      return "You have a new notification"
  }
}
