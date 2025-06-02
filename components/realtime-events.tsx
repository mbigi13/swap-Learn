"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Clock, Bell } from "lucide-react"
import { useRealtime } from "@/components/realtime-provider"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  organizer: string
  category: string
  isRSVPed: boolean
  isLive?: boolean
}

export function RealtimeEvents() {
  const { onlineUsers } = useRealtime()
  const [events, setEvents] = useState<Event[]>([
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
  ])

  // Simulate real-time event updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random RSVP updates
      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          attendees: Math.min(event.attendees + Math.floor(Math.random() * 2), event.maxAttendees),
        })),
      )
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  // Add new live events from online users
  useEffect(() => {
    const interval = setInterval(() => {
      if (onlineUsers.length > 0 && Math.random() > 0.7) {
        const organizer = onlineUsers[Math.floor(Math.random() * onlineUsers.length)]
        const eventTitles = [
          "Impromptu Skill Share Session",
          "Quick Photography Tips Meetup",
          "Last-Minute Coding Help",
          "Spontaneous Language Practice",
        ]

        const newEvent: Event = {
          id: Date.now(),
          title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
          description: "Join us for an impromptu skill sharing session!",
          date: new Date().toISOString().split("T")[0],
          time: "Starting soon",
          location: "Online/Virtual",
          attendees: 1,
          maxAttendees: 10,
          organizer,
          category: "Live",
          isRSVPed: false,
          isLive: true,
        }

        setEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [onlineUsers])

  const handleRSVP = (eventId: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRSVPed: !event.isRSVPed,
              attendees: event.isRSVPed ? event.attendees - 1 : event.attendees + 1,
            }
          : event,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Events</h1>
        <div className="flex items-center space-x-2">
          <Badge className="animate-pulse">
            <Bell className="h-3 w-3 mr-1" />
            Live Updates
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Live Events Section */}
      {events.filter((e) => e.isLive).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Happening Now
          </h2>
          {events
            .filter((e) => e.isLive)
            .map((event) => (
              <Card key={event.id} className="border-red-200 bg-red-50 animate-pulse">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant="destructive" className="animate-bounce">
                          LIVE
                        </Badge>
                        <Badge variant="secondary">{event.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                      <Button
                        variant={event.isRSVPed ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleRSVP(event.id)}
                        className="animate-pulse"
                      >
                        {event.isRSVPed ? "Joined" : "Join Now"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Started by <span className="font-medium">{event.organizer}</span>
                    <span className="ml-2 text-green-600">● Online now</span>
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        {events
          .filter((e) => !e.isLive)
          .map((event) => (
            <Card key={event.id} className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge variant="secondary">{event.category}</Badge>
                      {onlineUsers.includes(event.organizer) && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Organizer Online
                        </Badge>
                      )}
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
                        <span className="transition-all duration-300">
                          {event.attendees}/{event.maxAttendees}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={event.isRSVPed ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleRSVP(event.id)}
                    >
                      {event.isRSVPed ? "RSVP'd" : "RSVP"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Organized by <span className="font-medium">{event.organizer}</span>
                    {onlineUsers.includes(event.organizer) && <span className="ml-2 text-green-600">● Online</span>}
                  </p>
                  {event.attendees === event.maxAttendees && <Badge variant="destructive">Full</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
