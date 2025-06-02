"use client"

import { Search, User, MessageCircle, Wifi, WifiOff, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface Notification {
  id: string
  type: "like" | "comment" | "reaction" | "message"
  title: string
  content: string
  timestamp: Date
  read: boolean
  userId?: string
}

export function Header() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    if (user) {
      // Simulate real-time notifications for social interactions
      const interval = setInterval(() => {
        const notificationTypes = ["like", "comment", "reaction"] as const
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomType,
          title: getNotificationTitle(randomType),
          content: getNotificationContent(randomType),
          timestamp: new Date(),
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
      }, 15000)

      return () => clearInterval(interval)
    }
  }, [user])

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-blue-600">Swap & Learn</h1>
            <div className="flex items-center space-x-1">
              {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
              <span className={`text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search posts, people, or skills..." className="pl-10 w-96" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-semibold border-b">Activity</div>
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-gray-500">{notification.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <span className="text-sm text-gray-600">{notification.content}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="relative">
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case "like":
      return "New Like"
    case "comment":
      return "New Comment"
    case "reaction":
      return "New Reaction"
    default:
      return "Notification"
  }
}

function getNotificationContent(type: string): string {
  switch (type) {
    case "like":
      return "Someone liked your post"
    case "comment":
      return "Someone commented on your post"
    case "reaction":
      return "Someone reacted to your post"
    default:
      return "You have a new notification"
  }
}
