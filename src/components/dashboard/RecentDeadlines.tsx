import { TaskType } from "@/types";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { AlertCircle, Clock } from "lucide-react";

interface RecentDeadlinesProps {
  tasks: TaskType[];
}

export default function RecentDeadlines({ tasks }: RecentDeadlinesProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
        <p className="text-sm text-gray-400 text-center py-4">No upcoming deadlines 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-orange-400" />
        Upcoming Deadlines
      </h3>
      <div className="space-y-4">
        {tasks.map(task => {
          if (!task.dueDate) return null;
          const date = new Date(task.dueDate);
          const overdue = isPast(date) && !isToday(date);
          const dueSoon = isToday(date) || isTomorrow(date);

          return (
            <div key={task._id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{task.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{task.assignedTo || "Unassigned"}</p>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1
                ${overdue ? "bg-red-50 text-red-600" : dueSoon ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-600"}`}>
                {overdue && <AlertCircle className="w-3 h-3" />}
                {overdue ? "Overdue" : isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "MMM d")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
