import { Medal, Target } from "lucide-react";

interface LeaderboardProps {
  leaderboard: {
    memberName: string;
    totalXP: number;
    completedTasks: number;
  }[];
}

export default function Leaderboard({ leaderboard }: LeaderboardProps) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center">
        <Target className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm text-gray-400 font-medium">No active contributors yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Medal className="w-5 h-5 text-indigo-500" />
        Top Contributors
      </h3>
      
      <div className="flex-1 space-y-4">
        {leaderboard.map((member, index) => (
          <div 
            key={member.memberName} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${index === 0 ? "bg-amber-100 text-amber-700" : 
                  index === 1 ? "bg-gray-100 text-gray-600" : 
                  index === 2 ? "bg-orange-50 text-orange-700" : "bg-gray-50 text-gray-400"}`}>
                #{index + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{member.memberName}</p>
                <p className="text-xs text-gray-500 font-medium">{member.completedTasks} tasks completed</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                {member.totalXP} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
