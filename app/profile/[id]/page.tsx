import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <UserProfile userId={params.id} />
        </main>
      </div>
    </div>
  )
}
