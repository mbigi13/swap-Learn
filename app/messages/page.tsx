"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RealtimeMessages } from "@/components/realtime-messages"
import { RealtimeProvider } from "@/components/realtime-provider"

export default function MessagesPage() {
  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <RealtimeMessages />
          </main>
        </div>
      </div>
    </RealtimeProvider>
  )
}
