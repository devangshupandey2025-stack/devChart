import { Trophy, Star } from "lucide-react";

interface HallOfFameProps {
  contributor: {
    memberName: string;
    totalXP: number;
    completedTasks: number;
    highPriorityCompleted: number;
  } | null;
}

export default function HallOfFame({ contributor }: HallOfFameProps) {
  if (!contributor) {
    return (
      <div className="bg-gradient-to-br from-yellow-100 to-amber-50 p-6 rounded-2xl shadow-sm border border-yellow-200 h-full flex items-center justify-center">
        <p className="text-amber-800/60 font-medium">No contributions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 p-1 rounded-2xl shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl h-full relative z-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold tracking-wider text-xs uppercase">
            <Trophy className="w-4 h-4" />
            <span>Contributor of the Month</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            {contributor.memberName}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
            <div>
              <p className="text-xs text-amber-700/70 font-semibold uppercase tracking-wider mb-1">Total XP</p>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">
                {contributor.totalXP}
              </div>
            </div>
            <Star className="w-8 h-8 text-amber-400 fill-amber-400 opacity-20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Completed Tasks</p>
              <p className="text-xl font-bold text-gray-800">{contributor.completedTasks}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">High Priority</p>
              <p className="text-xl font-bold text-gray-800">{contributor.highPriorityCompleted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
