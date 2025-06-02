import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Plus, Users } from "lucide-react"

const polls = [
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
]

const surveys = [
  {
    id: 1,
    title: "Community Feedback Survey",
    description: "Help us improve the SkillSwap experience",
    questions: 8,
    responses: 156,
    timeLeft: "1 week left",
    reward: "Community Badge",
  },
  {
    id: 2,
    title: "Skill Gap Analysis",
    description: "What skills are most needed in our community?",
    questions: 12,
    responses: 89,
    timeLeft: "3 days left",
    reward: "Priority Matching",
  },
]

export function Polls() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Polls & Surveys</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Active Polls */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Active Polls
        </h2>

        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{poll.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>By {poll.creator}</span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {poll.totalVotes} votes
                    </span>
                    <Badge variant="outline">{poll.timeLeft}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poll.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{option.text}</span>
                      <span className="text-sm text-gray-500">
                        {option.votes} votes ({option.percentage}%)
                      </span>
                    </div>
                    <Progress value={option.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              {!poll.hasVoted && (
                <Button className="mt-4" size="sm">
                  Vote Now
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Surveys */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Community Surveys</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle className="text-lg">{survey.title}</CardTitle>
                <p className="text-gray-600">{survey.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{survey.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Responses:</span>
                    <span>{survey.responses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time left:</span>
                    <Badge variant="outline" className="text-xs">
                      {survey.timeLeft}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward:</span>
                    <Badge className="text-xs">{survey.reward}</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Take Survey
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
