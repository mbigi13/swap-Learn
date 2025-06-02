import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Groups } from "@/components/groups"

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Groups />
        </main>
      </div>
    </div>
  )
}
