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
    name: "Done",
    href: "/completed",
    icon: CheckCircle2,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-pb">
      <nav className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95"
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-primary" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 mb-1 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={cn(
                "text-[10px] font-medium tracking-wide",
                isActive && "font-semibold"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
