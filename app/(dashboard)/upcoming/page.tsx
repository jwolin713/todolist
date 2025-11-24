import { Header } from "@/components/layout/header"

export default function UpcomingPage() {
  return (
    <>
      <Header title="Upcoming" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Upcoming</h2>
            <p className="text-slate-400">
              Tasks scheduled for the coming days and weeks
            </p>
          </div>

          {/* Placeholder for task list */}
          <div className="bg-slate-900 rounded-lg p-8 text-center border border-slate-800">
            <p className="text-slate-400">
              No upcoming tasks. Schedule some tasks to see them here.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
