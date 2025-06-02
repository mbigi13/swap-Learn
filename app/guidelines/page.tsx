import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Guidelines } from "@/components/guidelines"

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Guidelines />
        </main>
      </div>
    </div>
  )
}
