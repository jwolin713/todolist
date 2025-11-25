import { Header } from "@/components/layout/header"
import { CheckCircle2 } from "lucide-react"

export default function CompletedPage() {
  return (
    <>
      <Header title="Completed" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-medium text-foreground tracking-tight mb-2">Completed</h2>
            <p className="text-muted-foreground">
              View all your completed tasks
            </p>
          </div>

          {/* Empty state */}
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-chart-2" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif font-medium text-foreground mb-2">
              No completed tasks yet
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Complete some tasks to see them here. Your accomplishments will be tracked and celebrated.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
