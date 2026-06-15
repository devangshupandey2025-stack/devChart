import { TaskType, TaskStatus } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: TaskType[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 rounded-2xl p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="bg-white text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-3 min-h-[500px] rounded-xl transition-colors p-1",
          isOver ? "bg-gray-100/80 ring-2 ring-blue-400/20" : ""
        )}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[150px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <span className="text-2xl mb-2">🎯</span>
              <p className="text-sm font-medium text-gray-500">No tasks here</p>
              <p className="text-xs text-gray-400 mt-1 text-center px-4">Drag tasks here to update their status</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
