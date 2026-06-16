"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Detect if viewing a specific project, e.g., /projects/64f1e...
  const projectMatch = pathname ? pathname.match(/^\/projects\/([a-f0-9]{24})/) : null;
  const currentProjectId = projectMatch ? projectMatch[1] : null;

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-black/[0.04] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin h-20 max-w-max_width mx-auto">
        <div className="flex items-center gap-xl">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-[-8deg]">
              <span className="material-symbols-outlined text-xl">stacked_bar_chart</span>
            </div>
            <span className="serif-heading text-2xl text-on-surface tracking-tight group-hover:text-primary transition-colors">devChart</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="/dashboard">Analytics</Link>
            <Link className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="/projects">Operations</Link>
            <Link className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="/calendar">Planning</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <Link className="text-primary font-bold font-label-md px-5 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/10 active-nav-pill hidden sm:block" href="/create-project">
            New Project
          </Link>
          <Link className="text-white font-bold font-label-md px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-full transition-all shadow-md flex items-center gap-2 hidden xs:flex" href="/create-task">
            <span className="material-symbols-outlined text-sm">add</span> Create Task
          </Link>
          
          {/* Hamburger Menu Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex md:hidden items-center justify-center p-2 text-gray-500 hover:text-primary rounded-xl border border-black/[0.04] bg-white shadow-sm transition-all focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-xl">{isOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer and Backdrop Overlay */}
      {isOpen && (
        <>
          {/* Full-screen Backdrop with Blur */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Right Sliding Drawer */}
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden animate-slide-in-right">
            <div className="flex flex-col gap-6">
              {/* Header inside drawer */}
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">stacked_bar_chart</span>
                  </div>
                  <span className="serif-heading text-xl text-on-surface font-bold">devChart</span>
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 border border-black/[0.04] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                <Link 
                  onClick={() => setIsOpen(false)}
                  className="text-on-surface-variant/85 font-bold hover:text-primary transition-all tracking-wide uppercase py-3 px-2 rounded-xl hover:bg-primary/5 flex justify-between items-center" 
                  href="/dashboard"
                >
                  <span>Analytics</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                </Link>
                <Link 
                  onClick={() => setIsOpen(false)}
                  className="text-on-surface-variant/85 font-bold hover:text-primary transition-all tracking-wide uppercase py-3 px-2 rounded-xl hover:bg-primary/5 flex justify-between items-center" 
                  href="/projects"
                >
                  <span>Operations</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                </Link>
                <Link 
                  onClick={() => setIsOpen(false)}
                  className="text-on-surface-variant/85 font-bold hover:text-primary transition-all tracking-wide uppercase py-3 px-2 rounded-xl hover:bg-primary/5 flex justify-between items-center" 
                  href="/calendar"
                >
                  <span>Planning</span>
                  <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                </Link>
              </nav>

              {/* Active Project specific shortcuts */}
              {currentProjectId && (
                <div className="flex flex-col gap-2 pt-4 border-t border-black/[0.04]">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 px-2">Project Shortcuts</div>
                  <Link 
                    onClick={() => setIsOpen(false)}
                    className="text-teal-700 font-bold py-2.5 px-3 bg-teal-50 hover:bg-teal-100/70 rounded-xl transition-all border border-teal-100 flex items-center gap-2 text-xs" 
                    href={`/create-task?projectId=${currentProjectId}`}
                  >
                    <span className="material-symbols-outlined text-sm">add_task</span> Add Task to Project
                  </Link>
                  <Link 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 font-bold py-2.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100 flex items-center gap-2 text-xs" 
                    href={`/projects/${currentProjectId}`}
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span> Go to Project Board
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-black/[0.04]">
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-primary font-bold text-center py-3 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all border border-primary/10 flex justify-center items-center gap-1 text-sm" 
                href="/create-project"
              >
                <span className="material-symbols-outlined text-sm">folder_open</span> New Project
              </Link>
              <Link 
                onClick={() => setIsOpen(false)}
                className="text-white font-bold text-center py-3 bg-[#005143] hover:bg-[#005143]/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm" 
                href="/create-task"
              >
                <span className="material-symbols-outlined text-sm">add</span> Create Task
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Slide-in and Fade-in Custom Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </header>
  );
}