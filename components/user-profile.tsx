import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Calendar, Award } from "lucide-react"

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  // Mock user data
  const user = {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "Passionate web designer and photographer. Love helping others bring their creative visions to life!",
    location: "San Francisco, CA",
    joinDate: "March 2023",
    rating: 4.8,
    reviewCount: 24,
    skillsOffered: ["Web Design", "Photography", "UI/UX Design", "Photoshop"],
    skillsWanted: ["Plumbing", "Gardening", "Cooking", "Spanish"],
    achievements: ["Top Helper", "Community Star", "Skill Master"],
    completedSwaps: 18,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-gray-600 mt-1">{user.location}</p>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                </div>
                <div className="flex space-x-2">
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Swap
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{user.bio}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{user.rating}</span>
                  <span className="text-gray-500 ml-1">({user.reviewCount} reviews)</span>
                </div>
                <div className="text-sm text-gray-600">{user.completedSwaps} successful swaps</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Skills I Can Teach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.map((skill) => (
                <Badge key={skill} className="bg-green-100 text-green-800 hover:bg-green-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Wanted */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Skills I Want to Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map((skill) => (
                <Badge key={skill} variant="outline" className="border-blue-200 text-blue-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Achievements & Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {user.achievements.map((achievement) => (
              <div key={achievement} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-medium">{achievement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
