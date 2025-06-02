import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Web Development Workshop",
    description: "Learn React basics in exchange for design feedback",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "Downtown Library",
    attendees: 12,
    maxAttendees: 20,
    organizer: "Sarah Chen",
    category: "Technology",
    isRSVPed: true,
  },
  {
    id: 2,
    title: "Cooking & Language Exchange",
    description: "Cook Italian dishes while practicing Italian conversation",
    date: "2024-01-18",
    time: "6:00 PM",
    location: "Community Kitchen",
    attendees: 8,
    maxAttendees: 15,
    organizer: "Marco Rossi",
    category: "Lifestyle",
    isRSVPed: false,
  },
  {
    id: 3,
    title: "Photography Walk & Editing Tips",
    description: "Street photography session followed by Lightroom tutorial",
    date: "2024-01-20",
    time: "10:00 AM",
    location: "Central Park",
    attendees: 15,
    maxAttendees: 25,
    organizer: "Emma Thompson",
    category: "Arts",
    isRSVPed: true,
  },
]

export function Events() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant={event.isRSVPed ? "outline" : "default"} size="sm">
                    {event.isRSVPed ? "RSVP'd" : "RSVP"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Organized by <span className="font-medium">{event.organizer}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
