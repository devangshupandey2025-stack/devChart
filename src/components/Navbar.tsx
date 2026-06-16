import Link from "next/link";

export default function Navbar() {
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
        <div className="flex items-center gap-4 md:gap-6">
          <Link className="text-primary font-bold font-label-md px-5 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/10 active-nav-pill hidden sm:block" href="/create-project">
            New Project
          </Link>
          <Link className="text-white font-bold font-label-md px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-full transition-all shadow-md flex items-center gap-2" href="/create-task">
            <span className="material-symbols-outlined text-sm">add</span> Create Task
          </Link>
        </div>
      </div>
    </header>
  );
}