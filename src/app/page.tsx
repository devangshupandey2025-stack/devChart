import Navbar from "@/components/Navbar";
import connectDB from "@/lib/mongodb";
import Link from "next/link";
import { ArrowRight, Bot, Layout, Zap, Users } from "lucide-react";

export default async function Home() {
  await connectDB();

  return (
    <div className="min-h-screen bg-background grain-bg flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9ff2dd] opacity-30 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-[#e2f1eb] opacity-60 blur-[120px] pointer-events-none" />
      
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-4 premium-shadow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            DevChart 2.0 is Live
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight serif-heading">
            Intelligent Operations for <br className="hidden md:block" />
            <span className="text-[#005143] italic">High-Velocity Teams</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-body-lg leading-relaxed">
            An elegant, powerful tool for managing your tasks, automating your workflows, and collaborating with your team in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#005143] text-white font-medium text-lg hover:bg-[#006b5a] transition-all premium-shadow-hover w-full sm:w-auto"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-medium text-lg hover:bg-gray-50 transition-all w-full sm:w-auto premium-shadow"
            >
              <Layout className="w-5 h-5" />
              View Projects
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          
          <div className="glass-panel p-8 rounded-2xl premium-shadow-hover transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 border border-indigo-100">
              <Bot className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 serif-heading">Intelligent Automation</h3>
            <p className="text-gray-600 font-body-md leading-relaxed">
              Let DevChart handle the busywork. Automatically detect stale tasks, flag deadlines at risk, and celebrate milestone achievements without writing a single line of logic.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl premium-shadow-hover transition-all">
            <div className="w-12 h-12 bg-[#eefdf6] rounded-xl flex items-center justify-center mb-6 border border-[#9ff2dd]">
              <Zap className="w-6 h-6 text-[#005143]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 serif-heading">Workflow Management</h3>
            <p className="text-gray-600 font-body-md leading-relaxed">
              Visualize your progress with powerful Kanban boards, calendar views, and detailed task tracking that keeps everyone on the same page.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl premium-shadow-hover transition-all">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 border border-orange-100">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 serif-heading">Team Velocity</h3>
            <p className="text-gray-600 font-body-md leading-relaxed">
              Gamify your workflow. Earn XP for completing critical tasks, climb the leaderboard, and build a culture of high performance and accountability.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-8 relative z-10 bg-white/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="DevChart Logo" className="w-6 h-6" />
            <span className="font-bold text-gray-900">DevChart</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DevChart. Built for high-velocity teams.
          </div>
        </div>
      </footer>
    </div>
  );
}