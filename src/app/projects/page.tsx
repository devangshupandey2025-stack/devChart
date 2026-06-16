import Navbar from "@/components/Navbar";
import { CalendarClock, FolderKanban, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { PROJECT_TEMPLATES } from "@/lib/templates";

export const dynamic = "force-dynamic";

async function getProjects() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/projects`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function ProjectsDashboard() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Club Operations</h1>
            <p className="text-gray-500 mt-2">Track project health, event readiness, and overall progress.</p>
          </div>
          <Link href="/create-project">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              + New Project
            </button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">No active projects</h2>
            <p className="text-gray-500 mt-2">Get started by creating a new club project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => {
              const { stats, templateId } = project;
              const isHealthy = stats.healthScore >= 80;
              const isAtRisk = stats.healthScore >= 50 && stats.healthScore < 80;
              const template = PROJECT_TEMPLATES.find(t => t.id === templateId);

              const categoryColors: Record<string, string> = {
                EVENT: "bg-purple-50 text-purple-700 border-purple-200",
                HR: "bg-emerald-50 text-emerald-700 border-emerald-200",
                PROJECT: "bg-blue-50 text-blue-700 border-blue-200",
                TEAM: "bg-orange-50 text-orange-700 border-orange-200",
              };

              return (
                <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                        {template && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Generated From:</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${categoryColors[template.category] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                              {template.category === "EVENT" ? "🚀 " : template.category === "HR" ? "👥 " : template.category === "PROJECT" ? "💻 " : "🏆 "}
                              {template.name} Blueprint
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap
                        ${isHealthy ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                          isAtRisk ? "bg-yellow-50 text-yellow-700 border-yellow-100" : 
                          "bg-red-50 text-red-700 border-red-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? "bg-emerald-500" : isAtRisk ? "bg-yellow-500" : "bg-red-500"}`}></span>
                        {isHealthy ? "Healthy" : isAtRisk ? "At Risk" : "Delayed"}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                          <Activity className="w-4 h-4" />
                          Health Score
                        </div>
                        <span className="text-lg font-black text-gray-900">{stats.healthScore}%</span>
                      </div>
                    </div>

                    {stats.nextEvent && (
                      <div className="mb-6 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Next Event</p>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{stats.nextEvent.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{stats.nextEvent.date}</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                          <CalendarClock className="w-4 h-4" />
                          Event Readiness
                        </div>
                        <span className="text-sm font-bold text-indigo-600">{stats.completionPercentage}% Ready</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
                        {/* A nice blocky progress bar for Event Readiness to simulate ████████░░ */}
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-500 ease-out" 
                          style={{ width: `${stats.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Total Tasks</p>
                        <p className="text-lg font-bold text-gray-800">{stats.totalTasks}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Completed</p>
                        <p className="text-lg font-bold text-gray-800">{stats.completedTasks}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <Link href={`/projects/${project._id}`} className="block w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                      View Project Operations →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
