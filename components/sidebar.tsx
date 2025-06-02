"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, MessageSquare, BarChart3, Award, Settings, FileText, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Social Feed", href: "/feed", icon: Home },
  { name: "Chat", href: "/", icon: MessageSquare },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Polls & Surveys", href: "/polls", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Guidelines", href: "/guidelines", icon: FileText },
  { name: "Admin Tools", href: "/admin", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
