"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RealtimePolls } from "@/components/realtime-polls"
import { RealtimeProvider } from "@/components/realtime-provider"

export default function PollsPage() {
  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <RealtimePolls />
          </main>
        </div>
      </div>
    </RealtimeProvider>
  )
}
