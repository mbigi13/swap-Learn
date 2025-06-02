"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RealtimeEvents } from "@/components/realtime-events"
import { RealtimeProvider } from "@/components/realtime-provider"

export default function EventsPage() {
  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <RealtimeEvents />
          </main>
        </div>
      </div>
    </RealtimeProvider>
  )
}
