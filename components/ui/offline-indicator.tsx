"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { WifiOff, Wifi } from "lucide-react"
import { useEffect, useState } from "react"

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [showReconnected, setShowReconnected] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "reconnected" message briefly
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (isOnline && !showReconnected) return null

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-soft-lg transition-all duration-300 animate-fade-in-up ${
        isOnline
          ? "bg-chart-2 text-white"
          : "bg-chart-4 text-foreground"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" strokeWidth={2} />
          <span className="text-sm font-medium">Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" strokeWidth={2} />
          <span className="text-sm font-medium">You're offline</span>
        </>
      )}
    </div>
  )
}
