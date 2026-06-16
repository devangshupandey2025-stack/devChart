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
    <>
      <header className="bg-white/60 backdrop-blur-xl border-b border-black/[0.04] sticky top-0 z-[100] hidden md:block">
        <div className="flex justify-between items-center w-full px-margin h-20 max-w-max_width mx-auto">
          <div className="flex items-center gap-xl">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-[-8deg]">
                <span className="material-symbols-outlined text-xl">stacked_bar_chart</span>
              </div>
              <span className="serif-heading text-2xl text-on-surface tracking-tight group-hover:text-primary transition-colors">devChart</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link className={`text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative ${pathname === '/dashboard' ? 'text-primary font-bold' : ''}`} href="/dashboard">Analytics</Link>
              <Link className={`text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative ${pathname?.startsWith('/projects') ? 'text-primary font-bold' : ''}`} href="/projects">Operations</Link>
              <Link className={`text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative ${pathname?.startsWith('/calendar') ? 'text-primary font-bold' : ''}`} href="/calendar">Planning</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <Link className="text-primary font-bold font-label-md px-5 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/10 active-nav-pill hidden md:block" href="/create-project">
              New Project
            </Link>
            <Link className="text-white font-bold font-label-md px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-full transition-all shadow-md flex items-center gap-2 hidden md:flex" href="/create-task">
              <span className="material-symbols-outlined text-sm">add</span> Create Task
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Top Header (Just Logo) */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/[0.04] sticky top-0 z-[100] md:hidden h-16 flex items-center px-5 justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-lg">stacked_bar_chart</span>
          </div>
          <span className="serif-heading text-xl text-on-surface tracking-tight font-bold">devChart</span>
        </Link>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-black/[0.04] z-[100] px-4 py-2 flex justify-between items-center pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 w-16 ${pathname === '/dashboard' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <span className="material-symbols-outlined text-2xl mb-0.5">{pathname === '/dashboard' ? 'bar_chart' : 'bar_chart'}</span>
          <span className="text-[10px] font-bold">Analytics</span>
        </Link>
        <Link href="/projects" className={`flex flex-col items-center gap-1 w-16 ${pathname?.startsWith('/projects') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <span className="material-symbols-outlined text-2xl mb-0.5">grid_view</span>
          <span className="text-[10px] font-bold">Operations</span>
        </Link>
        
        {/* Prominent Create Task Button */}
        <div className="relative -top-5 flex justify-center w-16">
          <Link href="/create-task" className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-[0_8px_20px_rgba(0,81,67,0.3)] border-[3px] border-white active:scale-95 transition-all">
            <span className="material-symbols-outlined text-3xl">add</span>
          </Link>
        </div>

        <Link href="/calendar" className={`flex flex-col items-center gap-1 w-16 ${pathname?.startsWith('/calendar') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <span className="material-symbols-outlined text-2xl mb-0.5">calendar_month</span>
          <span className="text-[10px] font-bold">Planning</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className={`flex flex-col items-center gap-1 w-16 ${isOpen ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
          <span className="material-symbols-outlined text-2xl mb-0.5">menu</span>
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </nav>

      {/* Slide-Up Menu for Mobile "More" options */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-[120] rounded-t-3xl p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden animate-slide-up flex flex-col gap-4">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
            
            <div className="flex justify-between items-center mb-2">
              <span className="serif-heading text-xl text-on-surface font-bold">More Options</span>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {currentProjectId && (
              <div className="flex flex-col gap-2 p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50">
                <div className="text-[10px] uppercase font-bold text-teal-700 tracking-wider mb-1">Project Shortcuts</div>
                <Link 
                  onClick={() => setIsOpen(false)}
                  className="text-teal-800 font-bold py-3 px-4 bg-white hover:bg-teal-50 rounded-xl transition-all shadow-sm flex items-center gap-3 text-sm" 
                  href={`/create-task?projectId=${currentProjectId}`}
                >
                  <span className="material-symbols-outlined text-lg text-teal-600">add_task</span> Add Task to Project
                </Link>
                <Link 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 font-bold py-3 px-4 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-sm flex items-center gap-3 text-sm mt-1" 
                  href={`/projects/${currentProjectId}`}
                >
                  <span className="material-symbols-outlined text-lg text-gray-500">grid_view</span> Go to Project Board
                </Link>
              </div>
            )}

            <Link 
              onClick={() => setIsOpen(false)}
              className="text-primary font-bold py-4 px-4 bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all flex items-center gap-4" 
              href="/create-project"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary">folder_open</span>
              </div>
              Create New Project
            </Link>

            <Link 
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-bold py-4 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all flex items-center gap-4 mt-2" 
              href="/"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-gray-600">home</span>
              </div>
              Back to Home
            </Link>
          </div>
        </>
      )}

      {/* Global Style for Mobile Body Padding and Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          body {
            padding-bottom: calc(90px + env(safe-area-inset-bottom));
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </>
  );
}