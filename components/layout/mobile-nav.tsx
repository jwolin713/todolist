"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CheckCircle2,
  Inbox,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"

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
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800">
      <nav className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive
                  ? "text-indigo-500"
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
