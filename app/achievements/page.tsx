import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Achievements } from "@/components/achievements"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Achievements />
        </main>
      </div>
    </div>
  )
}
