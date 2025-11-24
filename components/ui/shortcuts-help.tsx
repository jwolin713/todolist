"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

interface Shortcut {
  keys: string
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  {
    category: "Navigation",
    keys: "G then T",
    description: "Go to Today",
  },
  {
    category: "Navigation",
    keys: "G then I",
    description: "Go to Inbox",
  },
  {
    category: "Navigation",
    keys: "G then P",
    description: "Go to Plan",
  },
  {
    category: "Navigation",
    keys: "G then H",
    description: "Go to History",
  },
  {
    category: "Actions",
    keys: "⌘/Ctrl + K",
    description: "Open AI Chat",
  },
  {
    category: "Actions",
    keys: "⌘/Ctrl + N",
    description: "Create New Task",
  },
  {
    category: "Actions",
    keys: "Escape",
    description: "Close dialogs",
  },
  {
    category: "Help",
    keys: "⌘/Ctrl + /",
    description: "Show this help",
  },
]

interface ShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Use these shortcuts to navigate and manage tasks faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/50"
                  >
                    <span className="text-sm text-slate-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 text-xs font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useShortcutsHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { open, setOpen }
}
