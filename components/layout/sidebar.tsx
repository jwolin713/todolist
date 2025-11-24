"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  CheckCircle2,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Sparkles,
  History
} from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"

const navigation = [
  {
    name: "Today",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: Inbox,
  },
  {
    name: "Plan",
    href: "/plan",
    icon: Sparkles,
  },
  {
    name: "Upcoming",
    href: "/upcoming",
    icon: Calendar,
  },
  {
    name: "Completed",
    href: "/completed",
    icon: CheckCircle2,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 border-r border-slate-800">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-800">
          <MessageSquare className="h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-xl font-bold text-white">TaskFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
          <div className="flex items-center w-full">
            <Avatar>
              <AvatarFallback className="bg-indigo-600 text-white">U</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-slate-400">View profile</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
