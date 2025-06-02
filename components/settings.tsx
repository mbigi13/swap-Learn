"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, X, Save, Bell, Shield, User, Palette } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

interface Skill {
  id: string
  name: string
  category: string
}

interface UserSkill {
  id: string
  skill_id: string
  proficiency_level: string
  years_experience: number
  skills: Skill
}

interface WantedSkill {
  id: string
  skill_id: string
  priority_level: string
  skills: Skill
}

export function Settings() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Profile settings
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")

  // Skills
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [wantedSkills, setWantedSkills] = useState<WantedSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [eventNotifications, setEventNotifications] = useState(true)

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showEmail, setShowEmail] = useState(false)
  const [showLastSeen, setShowLastSeen] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      // Load skills
      const { data: skillsData } = await supabase.from("skills").select("*").order("name")
      setAvailableSkills(skillsData || [])

      // Load user skills
      const { data: userSkillsData } = await supabase
        .from("user_skills")
        .select(`
          id,
          skill_id,
          proficiency_level,
          years_experience,
          skills (id, name, category)
        `)
        .eq("profile_id", user!.id)
      setUserSkills(userSkillsData || [])

      // Load wanted skills
      const { data: wantedSkillsData } = await supabase
        .from("wanted_skills")
        .select(`
          id,
          skill_id,
          priority_level,
          skills (id, name, category)
        `)
        .eq("profile_id", user!.id)
      setWantedSkills(wantedSkillsData || [])
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage("Profile updated successfully!")
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addUserSkill = async (skillId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("user_skills").insert({
        profile_id: user.id,
        skill_id: skillId,
        proficiency_level: "intermediate",
        years_experience: 1,
      })

      if (error) throw error
      await loadUserData()
    } catch (error) {
      console.error("Error adding skill:", error)
    }
  }

  const removeUserSkill = async (skillId: string) => {
    try {
      const { error } = await supabase.from("user_skills").delete().eq("id", skillId)

      if (error) throw error
      await loadUserData()
    } catch (error) {
      console.error("Error removing skill:", error)
    }
  }

  const addWantedSkill = async (skillId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("wanted_skills").insert({
        profile_id: user.id,
        skill_id: skillId,
        priority_level: "medium",
      })

      if (error) throw error
      await loadUserData()
    } catch (error) {
      console.error("Error adding wanted skill:", error)
    }
  }

  const removeWantedSkill = async (skillId: string) => {
    try {
      const { error } = await supabase.from("wanted_skills").delete().eq("id", skillId)

      if (error) throw error
      await loadUserData()
    } catch (error) {
      console.error("Error removing wanted skill:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your skills..."
                  rows={4}
                />
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>

              {message && (
                <div
                  className={`p-3 rounded text-sm ${
                    message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            {/* Skills I Can Teach */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Skills I Can Teach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((userSkill) => (
                      <Badge
                        key={userSkill.id}
                        className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center space-x-1"
                      >
                        <span>{userSkill.skills.name}</span>
                        <button onClick={() => removeUserSkill(userSkill.id)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={addUserSkill}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add a skill you can teach" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills
                        .filter((skill) => !userSkills.some((us) => us.skill_id === skill.id))
                        .map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name} ({skill.category})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Skills I Want to Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Skills I Want to Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {wantedSkills.map((wantedSkill) => (
                      <Badge
                        key={wantedSkill.id}
                        variant="outline"
                        className="border-blue-200 text-blue-700 flex items-center space-x-1"
                      >
                        <span>{wantedSkill.skills.name}</span>
                        <button onClick={() => removeWantedSkill(wantedSkill.id)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={addWantedSkill}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add a skill you want to learn" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills
                        .filter((skill) => !wantedSkills.some((ws) => ws.skill_id === skill.id))
                        .map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name} ({skill.category})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="message-notifications">Message Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={messageNotifications}
                  onCheckedChange={setMessageNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="event-notifications">Event Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified about upcoming events</p>
                </div>
                <Switch id="event-notifications" checked={eventNotifications} onCheckedChange={setEventNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                    <SelectItem value="members">Members Only - Only community members can see your profile</SelectItem>
                    <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-email">Show Email Address</Label>
                  <p className="text-sm text-gray-500">Allow others to see your email address</p>
                </div>
                <Switch id="show-email" checked={showEmail} onCheckedChange={setShowEmail} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-last-seen">Show Last Seen</Label>
                  <p className="text-sm text-gray-500">Allow others to see when you were last active</p>
                </div>
                <Switch id="show-last-seen" checked={showLastSeen} onCheckedChange={setShowLastSeen} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
