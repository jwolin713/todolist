import { Header } from "@/components/layout/header"
import { Calendar } from "lucide-react"

export default function UpcomingPage() {
  return (
    <>
      <Header title="Upcoming" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight mb-2">Upcoming</h2>
            <p className="text-muted-foreground">
              Tasks scheduled for the coming days and weeks
            </p>
          </div>

          {/* Empty state */}
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-chart-3/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-chart-3" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif font-medium text-foreground mb-2">
              No upcoming tasks
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Schedule some tasks for future dates to see them here. Stay ahead of your deadlines.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
