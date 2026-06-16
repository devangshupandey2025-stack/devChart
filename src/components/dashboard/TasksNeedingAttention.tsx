import { AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskItem {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

export default function TasksNeedingAttention({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" /> Needs Attention
      </h3>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">All tasks are up to date!</p>
        ) : (
          tasks.map((task) => {
             const dateToUse = task.updatedAt || task.createdAt;
             return (
              <div key={task._id} className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">{task.title}</span>
                  <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Stale for {dateToUse ? formatDistanceToNow(new Date(dateToUse)) : "a while"}
                  </span>
                </div>
                <div className="text-xs font-bold text-red-600">
                  Needs Update
                </div>
              </div>
             );
          })
        )}
      </div>
    </div>
  );
}
