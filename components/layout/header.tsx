"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Feather, Keyboard } from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile Logo */}
        <div className="flex items-center lg:hidden">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mr-2.5">
            <Feather className="h-[18px] w-[18px] text-primary" />
          </div>
          <span className="text-lg font-serif font-medium text-foreground">TaskFlow</span>
        </div>

        {/* Desktop Title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-serif font-medium text-foreground tracking-tight">
            {title}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts hint - desktop only */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-xs">
            <Keyboard className="h-3.5 w-3.5" />
            <span className="font-medium">⌘K</span>
          </div>

          {/* Mobile User Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Avatar className="h-8 w-8 ring-2 ring-border">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-soft-lg">
                <DropdownMenuLabel className="text-foreground font-serif">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
