"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Camera, Send, Smile } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface Post {
  id: string
  content: string
  image_url?: string
  created_at: string
  author_id: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
  likes: Array<{
    id: string
    profile_id: string
    profiles: {
      username: string
      full_name: string
    }
  }>
  comments: Array<{
    id: string
    content: string
    created_at: string
    author_id: string
    profiles: {
      username: string
      full_name: string
      avatar_url: string
    }
  }>
  reactions: Array<{
    id: string
    emoji: string
    profile_id: string
    profiles: {
      username: string
    }
  }>
}

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"]

export function SocialFeed() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
  const [showReactions, setShowReactions] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (user) {
      loadPosts()
      setupRealtimeSubscriptions()
    }
  }, [user])

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        created_at,
        author_id,
        profiles:author_id (
          username,
          full_name,
          avatar_url
        ),
        likes (
          id,
          profile_id,
          profiles:profile_id (
            username,
            full_name
          )
        ),
        comments (
          id,
          content,
          created_at,
          author_id,
          profiles:author_id (
            username,
            full_name,
            avatar_url
          )
        ),
        reactions (
          id,
          emoji,
          profile_id,
          profiles:profile_id (
            username
          )
        )
      `)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error loading posts:", error)
      return
    }

    setPosts(data || [])
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new posts
    const postsChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          loadPosts()
        },
      )
      .subscribe()

    // Subscribe to likes
    const likesChannel = supabase
      .channel("likes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
        },
        () => {
          loadPosts()
        },
      )
      .subscribe()

    // Subscribe to comments
    const commentsChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        () => {
          loadPosts()
        },
      )
      .subscribe()

    // Subscribe to reactions
    const reactionsChannel = supabase
      .channel("reactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
        },
        () => {
          loadPosts()
        },
      )
      .subscribe()

    return () => {
      postsChannel.unsubscribe()
      likesChannel.unsubscribe()
      commentsChannel.unsubscribe()
      reactionsChannel.unsubscribe()
    }
  }

  const createPost = async () => {
    if (!newPost.trim() || !user) return

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: newPost.trim(),
    })

    if (error) {
      console.error("Error creating post:", error)
      return
    }

    setNewPost("")
  }

  const toggleLike = async (postId: string) => {
    if (!user) return

    const post = posts.find((p) => p.id === postId)
    const userLike = post?.likes.find((like) => like.profile_id === user.id)

    if (userLike) {
      // Remove like
      const { error } = await supabase.from("likes").delete().eq("id", userLike.id)
      if (error) console.error("Error removing like:", error)
    } else {
      // Add like
      const { error } = await supabase.from("likes").insert({
        post_id: postId,
        profile_id: user.id,
      })
      if (error) console.error("Error adding like:", error)
    }
  }

  const addComment = async (postId: string) => {
    const comment = commentInputs[postId]
    if (!comment?.trim() || !user) return

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      content: comment.trim(),
    })

    if (error) {
      console.error("Error adding comment:", error)
      return
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
  }

  const addReaction = async (postId: string, emoji: string) => {
    if (!user) return

    // Check if user already reacted with this emoji
    const post = posts.find((p) => p.id === postId)
    const existingReaction = post?.reactions.find((r) => r.profile_id === user.id && r.emoji === emoji)

    if (existingReaction) {
      // Remove reaction
      const { error } = await supabase.from("reactions").delete().eq("id", existingReaction.id)
      if (error) console.error("Error removing reaction:", error)
    } else {
      // Add reaction
      const { error } = await supabase.from("reactions").insert({
        post_id: postId,
        profile_id: user.id,
        emoji,
      })
      if (error) console.error("Error adding reaction:", error)
    }

    setShowReactions((prev) => ({ ...prev, [postId]: false }))
  }

  const getReactionCounts = (reactions: Post["reactions"]) => {
    const counts: { [emoji: string]: number } = {}
    reactions.forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1
    })
    return counts
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your skills, ask for help, or post an update..."
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
                </div>
                <Button onClick={createPost} disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post) => {
        const userLiked = post.likes.some((like) => like.profile_id === user?.id)
        const reactionCounts = getReactionCounts(post.reactions)

        return (
          <Card key={post.id} className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{post.profiles.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{post.profiles.full_name}</h3>
                    <span className="text-sm text-gray-500">@{post.profiles.username}</span>
                    <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-3">{post.content}</p>
              {post.image_url && (
                <img src={post.image_url || "/placeholder.svg"} alt="Post content" className="w-full rounded-lg mb-3" />
              )}

              {/* Reactions Display */}
              {Object.keys(reactionCounts).length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {Object.entries(reactionCounts).map(([emoji, count]) => (
                    <Badge key={emoji} variant="secondary" className="text-sm">
                      {emoji} {count}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-colors ${userLiked ? "text-red-500" : "text-gray-600"}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${userLiked ? "fill-current" : ""}`} />
                    {post.likes.length}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments.length}
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600"
                      onClick={() => setShowReactions((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      React
                    </Button>
                    {showReactions[post.id] && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                        {EMOJI_REACTIONS.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="text-lg p-1 h-8 w-8"
                            onClick={() => addReaction(post.id, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="mt-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {comment.profiles.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">{comment.profiles.full_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="mt-3 flex space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addComment(post.id)
                      }
                    }}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={() => addComment(post.id)} disabled={!commentInputs[post.id]?.trim()}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {posts.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  )
}
