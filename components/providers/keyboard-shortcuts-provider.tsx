"use client"

import { useRouter, usePathname } from "next/navigation"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ShortcutsHelp, useShortcutsHelp } from "@/components/ui/shortcuts-help"
import { useState } from "react"

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { open, setOpen } = useShortcutsHelp()
  const [isGPressed, setIsGPressed] = useState(false)

  // Define navigation shortcuts with "g" key prefix
  useKeyboardShortcuts([
    {
      key: "g",
      description: "Go mode (press g then another key)",
      action: () => {
        setIsGPressed(true)
        setTimeout(() => setIsGPressed(false), 1000) // Reset after 1 second
      },
    },
    {
      key: "t",
      description: "Go to Today",
      action: () => {
        if (isGPressed && pathname !== "/") {
          router.push("/")
        }
      },
    },
    {
      key: "i",
      description: "Go to Inbox",
      action: () => {
        if (isGPressed && pathname !== "/inbox") {
          router.push("/inbox")
        }
      },
    },
    {
      key: "p",
      description: "Go to Plan",
      action: () => {
        if (isGPressed && pathname !== "/plan") {
          router.push("/plan")
        }
      },
    },
    {
      key: "h",
      description: "Go to History",
      action: () => {
        if (isGPressed && pathname !== "/history") {
          router.push("/history")
        }
      },
    },
  ])

  return (
    <>
      {children}
      <ShortcutsHelp open={open} onOpenChange={setOpen} />

      {/* Go mode indicator */}
      {isGPressed && (
        <div className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          Go mode active...
        </div>
      )}
    </>
  )
}
