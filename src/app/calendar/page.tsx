import Navbar from "@/components/Navbar";
import CalendarView from "@/components/calendar/CalendarView";

export const metadata = {
  title: "Planning | devChart",
  description: "Unified timeline for task deadlines, meetings, events, and milestones.",
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-[1600px] w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Planning</h1>
          <p className="text-gray-500 mt-2">Unified timeline for tasks, events, and milestones.</p>
        </div>
        
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
