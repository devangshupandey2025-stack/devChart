import Navbar from "@/components/Navbar";
import connectDB from "@/lib/mongodb";
import StatCard from "@/components/dashboard/StatCard";
import StatusChart from "@/components/dashboard/StatusChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import RecentDeadlines from "@/components/dashboard/RecentDeadlines";
import { CheckCircle2, ListTodo, Target, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/dashboard`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Get a high-level overview of your team's progress.</p>
        </div>

        {!data ? (
          <div className="text-center py-20">
            <h2 className="text-xl text-gray-500">Failed to load dashboard data.</h2>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Row: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Tasks" 
                value={data.stats.totalTasks} 
                icon={<Target className="w-5 h-5" />} 
              />
              <StatCard 
                title="Completed" 
                value={data.stats.completedTasks} 
                icon={<CheckCircle2 className="w-5 h-5" />} 
                trend={`${data.stats.completionPercentage}%`}
              />
              <StatCard 
                title="In Progress" 
                value={data.stats.inProgressTasks} 
                icon={<Activity className="w-5 h-5" />} 
              />
              <StatCard 
                title="Pending" 
                value={data.stats.pendingTasks} 
                icon={<ListTodo className="w-5 h-5" />} 
              />
            </div>

            {/* Middle Row: Chart & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Task Distribution</h3>
                <div className="flex-1 min-h-[300px]">
                  <StatusChart data={data.chartData} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <RecentDeadlines tasks={data.upcomingTasks} />
              </div>
            </div>

            {/* Bottom Row: Activity Feed */}
            <div className="w-full">
              <ActivityFeed activities={data.activities} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}