import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const groups = [
  {
    id: 1,
    name: "Tech Skills Exchange",
    description: "Share programming, design, and tech knowledge",
    members: 234,
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
    isJoined: true,
  },
  {
    id: 2,
    name: "Creative Arts Hub",
    description: "Photography, painting, music, and creative skills",
    members: 156,
    category: "Arts",
    image: "/placeholder.svg?height=200&width=300",
    isJoined: false,
  },
  {
    id: 3,
    name: "Home & Garden Masters",
    description: "DIY, gardening, cooking, and home improvement",
    members: 189,
    category: "Lifestyle",
    image: "/placeholder.svg?height=200&width=300",
    isJoined: true,
  },
  {
    id: 4,
    name: "Language Learning Circle",
    description: "Practice and teach languages with native speakers",
    members: 312,
    category: "Education",
    image: "/placeholder.svg?height=200&width=300",
    isJoined: false,
  },
]

export function Groups() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search groups by name or skill..." className="pl-10" />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img src={group.image || "/placeholder.svg"} alt={group.name} className="w-full h-full object-cover" />
              <Badge className="absolute top-2 right-2">{group.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <p className="text-sm text-gray-600">{group.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members
                </div>
                <Button variant={group.isJoined ? "outline" : "default"} size="sm">
                  {group.isJoined ? "Joined" : "Join Group"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
