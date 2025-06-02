import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Star, Users, Calendar, MessageCircle, Trophy } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "First Swap",
    description: "Complete your first skill exchange",
    icon: Star,
    earned: true,
    earnedDate: "2023-12-15",
    rarity: "Common",
  },
  {
    id: 2,
    title: "Community Helper",
    description: "Help 10 community members",
    icon: Users,
    earned: true,
    earnedDate: "2024-01-02",
    rarity: "Uncommon",
    progress: 10,
    maxProgress: 10,
  },
  {
    id: 3,
    title: "Event Organizer",
    description: "Organize 5 successful events",
    icon: Calendar,
    earned: false,
    rarity: "Rare",
    progress: 2,
    maxProgress: 5,
  },
  {
    id: 4,
    title: "Master Communicator",
    description: "Send 100 helpful messages",
    icon: MessageCircle,
    earned: false,
    rarity: "Uncommon",
    progress: 67,
    maxProgress: 100,
  },
  {
    id: 5,
    title: "Skill Master",
    description: "Teach 3 different skills successfully",
    icon: Award,
    earned: true,
    earnedDate: "2024-01-10",
    rarity: "Rare",
  },
  {
    id: 6,
    title: "Community Legend",
    description: "Reach 50 successful skill swaps",
    icon: Trophy,
    earned: false,
    rarity: "Legendary",
    progress: 18,
    maxProgress: 50,
  },
]

const stats = {
  totalAchievements: achievements.filter((a) => a.earned).length,
  totalPossible: achievements.length,
  points: 1250,
  rank: "Gold",
  nextRank: "Platinum",
  pointsToNext: 750,
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return "bg-gray-100 text-gray-800"
    case "Uncommon":
      return "bg-green-100 text-green-800"
    case "Rare":
      return "bg-blue-100 text-blue-800"
    case "Legendary":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function Achievements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Achievements & Badges</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalAchievements}</div>
            <div className="text-sm text-gray-600">Achievements Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.points}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.rank}</div>
            <div className="text-sm text-gray-600">Current Rank</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.pointsToNext}</div>
            <div className="text-sm text-gray-600">Points to {stats.nextRank}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Rank */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to {stats.nextRank} Rank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stats.rank} Rank</span>
              <span>{stats.nextRank} Rank</span>
            </div>
            <Progress value={(stats.points / (stats.points + stats.pointsToNext)) * 100} />
            <p className="text-sm text-gray-600">
              {stats.pointsToNext} more points needed to reach {stats.nextRank} rank
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <Card
              key={achievement.id}
              className={`${achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}>
                      <Icon className={`h-6 w-6 ${achievement.earned ? "text-green-600" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                  </div>
                  {achievement.earned && <Award className="h-5 w-5 text-yellow-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>

                {achievement.earned ? (
                  <div className="text-sm text-green-600 font-medium">
                    Earned on {new Date(achievement.earnedDate!).toLocaleDateString()}
                  </div>
                ) : achievement.progress !== undefined ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress!) * 100} />
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not yet earned</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
