import { useState } from "react";
import { TaskType, TaskPriority } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Calendar, User, Clock, AlertCircle } from "lucide-react";
import { format, isPast, isToday, isTomorrow, addDays } from "date-fns";
import { TEAM_MEMBERS } from "@/lib/constants";

interface TaskCardProps {
  task: TaskType;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  Low: "bg-blue-100 text-blue-700 border-blue-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

export default function TaskCard({ task }: TaskCardProps) {
  const [assignee, setAssignee] = useState(task.assignedTo || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "Task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAssigneeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssignee = e.target.value;
    setAssignee(newAssignee);
    setIsUpdating(true);
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: newAssignee }),
      });
    } catch (error) {
      console.error("Failed to assign task");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    const overdue = isPast(date) && !isToday(date);
    const dueSoon = isToday(date) || isTomorrow(date) || date <= addDays(new Date(), 2);

    return (
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border",
          overdue
            ? "bg-red-50 text-red-600 border-red-100"
            : dueSoon
            ? "bg-orange-50 text-orange-600 border-orange-100"
            : "bg-gray-50 text-gray-500 border-gray-100"
        )}
      >
        {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {overdue ? "Overdue" : dueSoon ? "Due Soon" : format(date, "MMM d")}
      </div>
    );
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-gray-100 border-2 border-dashed border-gray-400 p-4 rounded-xl min-h-[120px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab hover:shadow-md hover:border-gray-300 transition-all group relative",
        isUpdating && "opacity-70"
      )}
    >
      <div className="flex justify-between items-start mb-2" {...attributes} {...listeners}>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
            PRIORITY_COLORS[task.priority]
          )}
        >
          {task.priority}
        </span>
      </div>

      <div {...attributes} {...listeners} className="mb-3">
        <h3 className="font-semibold text-gray-900 leading-tight mb-1">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-2">
          {renderDueDate()}
        </div>

        {/* Prevent drag when interacting with select */}
        <div
          className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 cursor-default"
          onPointerDown={(e) => e.stopPropagation()} 
        >
          <User className="w-3 h-3 text-gray-400" />
          <select
            value={assignee}
            onChange={handleAssigneeChange}
            className="bg-transparent text-xs text-gray-600 font-medium focus:outline-none cursor-pointer"
          >
            <option value="">Unassigned</option>
            {TEAM_MEMBERS.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
