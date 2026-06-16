import Navbar from "@/components/Navbar";
import connectDB from "@/lib/mongodb";
import StatCard from "@/components/dashboard/StatCard";
import StatusChart from "@/components/dashboard/StatusChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import UpcomingTimeline from "@/components/dashboard/UpcomingTimeline";
import HallOfFame from "@/components/dashboard/HallOfFame";
import Leaderboard from "@/components/dashboard/Leaderboard";
import MostActiveTasks from "@/components/dashboard/MostActiveTasks";
import TasksNeedingAttention from "@/components/dashboard/TasksNeedingAttention";
import AutomationCenter from "@/components/dashboard/AutomationCenter";
import { CheckCircle2, ListTodo, Target, Activity, Flag, Sparkles, TrendingUp } from "lucide-react";

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
          <p className="text-gray-500 mt-2">Get a high-level overview of your team's progress and contributions.</p>
        </div>

        {!data ? (
          <div className="text-center py-20">
            <h2 className="text-xl text-gray-500">Failed to load dashboard data.</h2>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Row: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
              <StatCard 
                title="Velocity" 
                value={data.executionVelocity?.updatesToday || 0} 
                icon={<TrendingUp className="w-5 h-5" />} 
                trend={`${data.executionVelocity?.percentChange > 0 ? '+' : ''}${data.executionVelocity?.percentChange || 0}%`}
              />
            </div>

            {/* Second Row: Hall of Fame & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <HallOfFame contributor={data.hallOfFame} />
              </div>
              <div className="lg:col-span-2">
                <Leaderboard leaderboard={data.leaderboard} />
              </div>
            </div>

            {/* Third Row: Chart & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Task Distribution</h3>
                <div className="flex-1 min-h-[300px]">
                  <StatusChart data={data.chartData} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <UpcomingTimeline items={data.upcomingTimeline} />
              </div>
            </div>

            {/* Fourth Row: Automation Center */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <AutomationCenter 
                  staleTasks={data.automation?.staleTasks || []}
                  riskTasks={data.automation?.riskTasks || []}
                  achievedMilestones={data.automation?.achievedMilestones || []}
                />
              </div>
            </div>

            {/* Fifth Row: Active & Stale Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MostActiveTasks tasks={data.mostActiveTasks || []} />
              <TasksNeedingAttention tasks={data.tasksNeedingAttention || []} />
            </div>

            {/* Bottom Row: Activity Feed & Today's Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed activities={data.activities} />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[500px]">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Today's Activity</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-black text-teal-500 mb-2">{data.todayStats?.total || 0} <span className="text-lg text-gray-500 font-medium">Activities</span></div>
                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Tasks Completed</span>
                        <span className="font-semibold text-gray-900">{data.todayStats?.tasksCompleted || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
                        <span className="text-gray-500 flex items-center gap-2"><Flag className="w-5 h-5 text-red-500" /> Milestones Created</span>
                        <span className="font-semibold text-gray-900">{data.todayStats?.milestonesCreated || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
                        <span className="text-gray-500 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /> Projects Created</span>
                        <span className="font-semibold text-gray-900">{data.todayStats?.projectsCreated || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}