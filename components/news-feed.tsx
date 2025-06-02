"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Camera, Video, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRealtime } from "@/components/realtime-provider"

interface Post {
  id: number
  user: { name: string; avatar: string; skills: string[] }
  content: string
  image?: string
  likes: number
  comments: number
  timeAgo: string
  isLiked: boolean
}

export function NewsFeed() {
  const { onlineUsers } = useRealtime()
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        skills: ["Web Design", "Photography"],
      },
      content:
        "Just finished helping Mark with his website redesign! Looking for someone who can teach me basic plumbing in exchange. 🔧",
      image: "/placeholder.svg?height=300&width=500",
      likes: 12,
      comments: 3,
      timeAgo: "2 hours ago",
      isLiked: false,
    },
    {
      id: 2,
      user: { name: "Mike Rodriguez", avatar: "/placeholder.svg?height=40&width=40", skills: ["Cooking", "Guitar"] },
      content: "Offering cooking lessons for anyone who can help me set up my home studio! I make amazing tacos 🌮",
      likes: 8,
      comments: 5,
      timeAgo: "4 hours ago",
      isLiked: true,
    },
    {
      id: 3,
      user: { name: "Emma Thompson", avatar: "/placeholder.svg?height=40&width=40", skills: ["Yoga", "Language"] },
      content: "Free yoga session this Saturday at Central Park! Perfect skill swap opportunity. Who's in?",
      likes: 15,
      comments: 7,
      timeAgo: "6 hours ago",
      isLiked: false,
    },
  ])

  const [newPost, setNewPost] = useState("")

  // Simulate real-time post updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPost = posts[Math.floor(Math.random() * posts.length)]
      if (randomPost) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === randomPost.id ? { ...post, likes: post.likes + Math.floor(Math.random() * 3) } : post,
          ),
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [posts])

  // Add new posts from online users
  useEffect(() => {
    const interval = setInterval(() => {
      if (onlineUsers.length > 0) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)]
        const postContents = [
          "Just learned something amazing today! Who wants to trade skills?",
          "Looking for someone to help with my project. Happy to teach in return!",
          "Great skill swap session today. This community is incredible! 🎉",
          "Anyone interested in a group learning session this weekend?",
        ]

        const newPost: Post = {
          id: Date.now(),
          user: {
            name: randomUser,
            avatar: "/placeholder.svg?height=40&width=40",
            skills: ["Live Skill", "Real-time"],
          },
          content: postContents[Math.floor(Math.random() * postContents.length)],
          likes: 0,
          comments: 0,
          timeAgo: "just now",
          isLiked: false,
        }

        setPosts((prev) => [newPost, ...prev.slice(0, 9)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [onlineUsers])

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
  }

  const handlePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          skills: ["Your Skills"],
        },
        content: newPost,
        likes: 0,
        comments: 0,
        timeAgo: "just now",
        isLiked: false,
      }
      setPosts((prev) => [post, ...prev])
      setNewPost("")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Live Activity Indicator */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">{onlineUsers.length} users online now</span>
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((user, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="text-xs">{user[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share a skill, request help, or post an update..."
                className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Camera className="h-4 w-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                </div>
                <Button onClick={handlePost} disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Post Live
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post) => (
        <Card key={post.id} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                {onlineUsers.includes(post.user.name) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{post.user.name}</h3>
                  <span className="text-sm text-gray-500">{post.timeAgo}</span>
                  {post.timeAgo === "just now" && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Live
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-1 mt-1">
                  {post.user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-3">{post.content}</p>
            {post.image && (
              <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full rounded-lg mb-3" />
            )}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 transition-colors ${post.isLiked ? "text-red-500" : ""}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
