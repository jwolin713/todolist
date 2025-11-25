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
  Sparkles,
  History,
  Feather
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
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo/Brand - Editorial style */}
        <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Feather className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-serif font-medium text-foreground tracking-tight">
                TaskFlow
              </span>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">
                AI Powered
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-3 mb-3 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            Navigation
          </p>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-[15px] rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                  strokeWidth={1.75}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile - Refined card style */}
        <div className="flex-shrink-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <Avatar className="h-10 w-10 ring-2 ring-background shadow-soft">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">View profile</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
