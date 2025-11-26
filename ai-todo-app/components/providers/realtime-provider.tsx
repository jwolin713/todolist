"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSupabase } from "./supabase-provider"
import { RealtimeChannel } from "@supabase/supabase-js"

type RealtimeContext = {
  isConnected: boolean
  connectionStatus: string
}

const Context = createContext<RealtimeContext>({
  isConnected: false,
  connectionStatus: "disconnected",
})

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("disconnected")

  useEffect(() => {
    // Monitor connection status
    let statusChannel: RealtimeChannel | null = null

    const setupStatusMonitor = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsConnected(false)
        setConnectionStatus("disconnected")
        return
      }

      // Create a simple channel to monitor connection status
      statusChannel = supabase
        .channel("status")
        .subscribe((status) => {
          console.log("Realtime connection status:", status)
          setConnectionStatus(status)
          setIsConnected(status === "SUBSCRIBED")
        })
    }

    setupStatusMonitor()

    return () => {
      if (statusChannel) {
        supabase.removeChannel(statusChannel)
      }
    }
  }, [supabase])

  return (
    <Context.Provider value={{ isConnected, connectionStatus }}>
      {children}
    </Context.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useRealtime must be used within RealtimeProvider")
  }
  return context
}
