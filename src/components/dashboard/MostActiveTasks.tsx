import { Activity, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskItem {
  _id: string;
  title: string;
  updateCount: number;
  updatedAt: string;
}

export default function MostActiveTasks({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" /> Most Active Tasks
      </h3>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No active tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">{task.title}</span>
                <span className="text-xs text-gray-500 mt-0.5">
                  Updated {task.updatedAt ? formatDistanceToNow(new Date(task.updatedAt)) : "recently"} ago
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-bold">
                <Activity className="w-3.5 h-3.5" />
                {task.updateCount} updates
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
