"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Plus, Users, TrendingUp } from "lucide-react"
import { useRealtime } from "@/components/realtime-provider"

interface PollOption {
  text: string
  votes: number
  percentage: number
}

interface Poll {
  id: number
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  timeLeft: string
  hasVoted: boolean
  creator: string
  isLive?: boolean
}

export function RealtimePolls() {
  const { onlineUsers } = useRealtime()
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      title: "What's the most valuable skill to learn in 2024?",
      description: "Help us understand what skills our community values most",
      options: [
        { text: "AI/Machine Learning", votes: 45, percentage: 35 },
        { text: "Web Development", votes: 38, percentage: 30 },
        { text: "Digital Marketing", votes: 25, percentage: 20 },
        { text: "Data Analysis", votes: 19, percentage: 15 },
      ],
      totalVotes: 127,
      timeLeft: "2 days left",
      hasVoted: true,
      creator: "Community Team",
    },
    {
      id: 2,
      title: "Best time for skill swap meetups?",
      description: "When would you prefer to attend in-person skill exchanges?",
      options: [
        { text: "Weekday Evenings", votes: 32, percentage: 40 },
        { text: "Saturday Mornings", votes: 28, percentage: 35 },
        { text: "Sunday Afternoons", votes: 20, percentage: 25 },
      ],
      totalVotes: 80,
      timeLeft: "5 days left",
      hasVoted: false,
      creator: "Sarah Chen",
    },
  ])

  // Simulate real-time poll updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPolls((prev) =>
        prev.map((poll) => {
          const updatedOptions = poll.options.map((option) => {
            const newVotes = option.votes + Math.floor(Math.random() * 3)
            return { ...option, votes: newVotes }
          })

          const newTotalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0)

          const updatedOptionsWithPercentage = updatedOptions.map((option) => ({
            ...option,
            percentage: Math.round((option.votes / newTotalVotes) * 100),
          }))

          return {
            ...poll,
            options: updatedOptionsWithPercentage,
            totalVotes: newTotalVotes,
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Add live polls from online users
  useEffect(() => {
    const interval = setInterval(() => {
      if (onlineUsers.length > 0 && Math.random() > 0.8) {
        const creator = onlineUsers[Math.floor(Math.random() * onlineUsers.length)]
        const pollTitles = [
          "Quick poll: What should we focus on next?",
          "Live question: Preferred learning format?",
          "Instant poll: Best skill swap location?",
        ]

        const newPoll: Poll = {
          id: Date.now(),
          title: pollTitles[Math.floor(Math.random() * pollTitles.length)],
          description: "Quick community input needed!",
          options: [
            { text: "Option A", votes: 1, percentage: 50 },
            { text: "Option B", votes: 1, percentage: 50 },
          ],
          totalVotes: 2,
          timeLeft: "24 hours left",
          hasVoted: false,
          creator,
          isLive: true,
        }

        setPolls((prev) => [newPoll, ...prev.slice(0, 9)])
      }
    }, 25000)

    return () => clearInterval(interval)
  }, [onlineUsers])

  const handleVote = (pollId: number, optionIndex: number) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId && !poll.hasVoted) {
          const updatedOptions = poll.options.map((option, index) =>
            index === optionIndex ? { ...option, votes: option.votes + 1 } : option,
          )

          const newTotalVotes = poll.totalVotes + 1

          const updatedOptionsWithPercentage = updatedOptions.map((option) => ({
            ...option,
            percentage: Math.round((option.votes / newTotalVotes) * 100),
          }))

          return {
            ...poll,
            options: updatedOptionsWithPercentage,
            totalVotes: newTotalVotes,
            hasVoted: true,
          }
        }
        return poll
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Polls & Surveys</h1>
        <div className="flex items-center space-x-2">
          <Badge className="animate-pulse">
            <TrendingUp className="h-3 w-3 mr-1" />
            Real-time Results
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </div>
      </div>

      {/* Live Polls Section */}
      {polls.filter((p) => p.isLive).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            Live Polls
          </h2>
          {polls
            .filter((p) => p.isLive)
            .map((poll) => (
              <Card key={poll.id} className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{poll.title}</CardTitle>
                        <Badge className="animate-pulse">LIVE</Badge>
                      </div>
                      <p className="text-gray-600 mt-1">{poll.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>By {poll.creator}</span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="transition-all duration-300">{poll.totalVotes} votes</span>
                        </span>
                        <Badge variant="outline">{poll.timeLeft}</Badge>
                        {onlineUsers.includes(poll.creator) && <span className="text-green-600">● Creator online</span>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {poll.options.map((option, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Button
                            variant={poll.hasVoted ? "ghost" : "outline"}
                            size="sm"
                            className="justify-start flex-1 mr-4"
                            onClick={() => handleVote(poll.id, index)}
                            disabled={poll.hasVoted}
                          >
                            {option.text}
                          </Button>
                          <span className="text-sm text-gray-500 min-w-[80px] text-right">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-2 transition-all duration-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Regular Polls */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Active Polls
        </h2>

        {polls
          .filter((p) => !p.isLive)
          .map((poll) => (
            <Card key={poll.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{poll.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{poll.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>By {poll.creator}</span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="transition-all duration-300">{poll.totalVotes} votes</span>
                      </span>
                      <Badge variant="outline">{poll.timeLeft}</Badge>
                      {onlineUsers.includes(poll.creator) && <span className="text-green-600">● Creator online</span>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {poll.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Button
                          variant={poll.hasVoted ? "ghost" : "outline"}
                          size="sm"
                          className="justify-start flex-1 mr-4"
                          onClick={() => handleVote(poll.id, index)}
                          disabled={poll.hasVoted}
                        >
                          {option.text}
                        </Button>
                        <span className="text-sm text-gray-500 min-w-[80px] text-right">
                          {option.votes} votes ({option.percentage}%)
                        </span>
                      </div>
                      <Progress value={option.percentage} className="h-2 transition-all duration-500" />
                    </div>
                  ))}
                </div>
                {!poll.hasVoted && (
                  <p className="text-sm text-blue-600 mt-3">Click an option to vote and see live results!</p>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
