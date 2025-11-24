import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { OfflineIndicator } from "@/components/ui/offline-indicator"
import { KeyboardShortcutsProvider } from "@/components/providers/keyboard-shortcuts-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KeyboardShortcutsProvider>
      <div className="min-h-screen bg-slate-950">
        {/* Offline Indicator */}
        <OfflineIndicator />

        {/* Sidebar for desktop */}
        <Sidebar />

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
        </div>

        {/* Bottom navigation for mobile */}
        <MobileNav />
      </div>
    </KeyboardShortcutsProvider>
  )
}
