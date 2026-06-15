import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center h-auto font-bold bg-black text-teal-200 p-4 shadow-md">
      <Link href="/">
        <h1 className="text-2xl tracking-tight">devChart</h1>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/dashboard">
          <button className="rounded-lg py-2 px-4 bg-transparent border border-teal-200 hover:bg-teal-200/10 transition-colors text-teal-200">
            Analytics
          </button>
        </Link>
        <Link href="/projects">
          <button className="rounded-lg py-2 px-4 bg-transparent border border-teal-200 hover:bg-teal-200/10 transition-colors text-teal-200">
            Operations
          </button>
        </Link>
        <Link href="/calendar">
          <button className="rounded-lg py-2 px-4 bg-transparent border border-teal-200 hover:bg-teal-200/10 transition-colors text-teal-200">
            Planning
          </button>
        </Link>
        <Link href="/create-project">
          <button className="rounded-lg py-2 px-4 bg-teal-200/20 text-teal-100 hover:bg-teal-200/30 transition-colors">
            New Project
          </button>
        </Link>
        <Link href="/create-task">
          <button className="rounded-lg py-2 px-4 bg-teal-400 text-black hover:bg-teal-300 transition-colors shadow-sm">
            + Create Task
          </button>
        </Link>
      </div>
    </div>
  );
}