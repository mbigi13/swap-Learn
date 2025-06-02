import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Send } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Mike Rodriguez",
    lastMessage: "Thanks for the cooking lesson! The tacos were amazing 🌮",
    time: "2 min ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: 2,
    name: "Tech Skills Group",
    lastMessage: "Sarah: Who's available for the React workshop tomorrow?",
    time: "15 min ago",
    unread: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    isGroup: true,
  },
  {
    id: 3,
    name: "Emma Thompson",
    lastMessage: "Perfect! Let's meet at Central Park at 10 AM",
    time: "1 hour ago",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
]

const currentMessages = [
  {
    id: 1,
    sender: "Mike Rodriguez",
    content: "Hey! Are you still available for that web design help?",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "I'm free this afternoon. What kind of project are you working on?",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Mike Rodriguez",
    content: "It's a portfolio site for my photography. I can teach you some advanced cooking techniques in return!",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "Perfect! I've been wanting to improve my cooking. Let's schedule a time to meet.",
    time: "10:37 AM",
    isOwn: true,
  },
]

export function Messages() {
  return (
    <div className="flex h-[calc(100vh-200px)] space-x-4">
      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
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
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.name}</p>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
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
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Mike Rodriguez</CardTitle>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
