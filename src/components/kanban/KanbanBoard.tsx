"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskType, TaskStatus } from "@/types";
import { Search, Filter, X } from "lucide-react";
import { TEAM_MEMBERS } from "@/lib/constants";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import TaskProgressJournal from "../tasks/TaskProgressJournal";

interface KanbanBoardProps {
  initialTasks: TaskType[];
  projectId: string;
}

const PRIORITY_WEIGHT: Record<string, number> = {
  "Low": 1,
  "Medium": 2,
  "High": 3,
};

function canMoveTask(taskToMove: TaskType, targetStatus: TaskStatus, allTasks: TaskType[]) {
  // Only apply this rule when moving from TODO to IN_PROGRESS
  if (taskToMove.status !== "TODO" || targetStatus !== "IN_PROGRESS") {
    return { allowed: true };
  }

  // If the task has no deadline, we don't restrict it based on deadlines
  if (!taskToMove.dueDate) return { allowed: true };
  
  const moveDate = new Date(taskToMove.dueDate).getTime();
  const movePriority = PRIORITY_WEIGHT[taskToMove.priority] || 1;

  for (const t of allTasks) {
    if (t._id === taskToMove._id) continue;
    // Only check tasks that are still in TODO
    if (t.status !== "TODO") continue; 
    if (!t.dueDate) continue;

    const tDate = new Date(t.dueDate).getTime();
    if (tDate < moveDate) {
      // Task 't' has an earlier deadline and is still in TODO.
      const tPriority = PRIORITY_WEIGHT[t.priority] || 1;
      
      // The move is blocked unless the task being moved has a STRICTLY HIGHER priority
      if (movePriority <= tPriority) {
        return { allowed: false, blockingTask: t };
      }
    }
  }

  return { allowed: true };
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function KanbanBoard({ initialTasks, projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const [tasksSnapshot, setTasksSnapshot] = useState<TaskType[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'journal'>('details');
  const [activeColumnTab, setActiveColumnTab] = useState<TaskStatus>("TODO");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Mobile Swipe Handlers for Kanban Columns
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      if (activeColumnTab === "TODO") setActiveColumnTab("IN_PROGRESS");
      else if (activeColumnTab === "IN_PROGRESS") setActiveColumnTab("DONE");
    } else if (isRightSwipe) {
      if (activeColumnTab === "DONE") setActiveColumnTab("IN_PROGRESS");
      else if (activeColumnTab === "IN_PROGRESS") setActiveColumnTab("TODO");
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTasks(initialTasks);
    setTasksSnapshot(initialTasks);
    
    // Also keep the currently editing task in sync with the server data
    if (editingTask) {
      const updatedEditingTask = initialTasks.find(t => t._id === editingTask._id);
      if (updatedEditingTask) {
        setEditingTask(updatedEditingTask);
      }
    }
  }, [initialTasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      const matchesAssignee = assigneeFilter ? task.assignedTo === assigneeFilter : true;
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag to initiate, allowing clicks to pass through
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "Task") {
      setActiveTask({ ...active.data.current.task }); // Clone to avoid mutation
      setTasksSnapshot(tasks);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Scenario 1: Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          // Task crossed columns during drag
          const updatedTasks = [...tasks];
          updatedTasks[activeIndex] = { 
            ...updatedTasks[activeIndex], 
            status: tasks[overIndex].status 
          };
          return arrayMove(updatedTasks, activeIndex, overIndex);
        }

        // Just reordering within the same column
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Scenario 2: Dropping a Task into an empty Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: overId as TaskStatus
        };
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const originalTask = activeTask;
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    if (!originalTask) return;

    const currentTaskInState = tasks.find((t) => t._id === active.id);
    if (!currentTaskInState) return;

    // Check Business Rules
    if (originalTask.status !== currentTaskInState.status) {
      const validation = canMoveTask(originalTask, currentTaskInState.status, tasksSnapshot);
      if (!validation.allowed && validation.blockingTask) {
        alert(`BLOCKED: You must complete "${validation.blockingTask.title}" (Earlier Deadline) first, unless this task has a higher priority.`);
        setTasks(tasksSnapshot); // Revert the UI drop
        return;
      }
    }

    // Note: We already updated the state in onDragOver for a snappy UI.
    // Now we must persist the exact status to MongoDB.
    try {
      const response = await fetch(`/api/tasks/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentTaskInState.status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      
      // Refresh the page data so the ProjectTimeline and Status Banner update
      router.refresh();
      
    } catch (error) {
      console.error(error);
      // In a real app, we'd revert the state and show a toast here.
    }
  };

  const handleEditTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const dueDate = formData.get("dueDate") as string;

    try {
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          assignedTo: assignedTo || undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      setEditingTask(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update task.");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (!isMounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none outline-none"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none outline-none"
              >
                <option value="">All Assignees</option>
                {TEAM_MEMBERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Tab Selector for Kanban Columns */}
        <div className="flex md:hidden gap-2 p-1.5 bg-gray-100 rounded-xl">
          {COLUMNS.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setActiveColumnTab(col.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
                activeColumnTab === col.id
                  ? "bg-white text-teal-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {col.title} ({filteredTasks.filter((task) => task.status === col.id).length})
            </button>
          ))}
        </div>

        {/* Board Columns */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-6 overflow-x-auto pb-4 items-start w-full flex-1 no-scrollbar"
        >
          {COLUMNS.map((col) => {
            const isHiddenOnMobile = activeColumnTab !== col.id;
            return (
              <div 
                key={col.id} 
                className={`w-full md:w-auto md:flex-1 min-w-[280px] md:min-w-0 ${
                  isHiddenOnMobile ? "hidden md:flex" : "flex"
                }`}
              >
                <KanbanColumn
                  id={col.id}
                  title={col.title}
                  tasks={filteredTasks.filter((task) => task.status === col.id)}
                  onEdit={setEditingTask}
                />
              </div>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] md:max-w-3xl h-[90vh] md:h-auto overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 pb-0">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{editingTask.title}</h2>
                  <button onClick={() => { setEditingTask(null); setActiveTab('details'); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap no-scrollbar">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'details' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Details
                    {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full"></div>}
                  </button>
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'journal' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Progress Journal
                    {activeTab === 'journal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full"></div>}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              {activeTab === 'details' ? (
                <form onSubmit={handleEditTaskSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editingTask.title}
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingTask.description}
                      rows={3}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                      <select
                        name="priority"
                        defaultValue={editingTask.priority}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Assignee</label>
                      <select
                        name="assignedTo"
                        defaultValue={editingTask.assignedTo || ""}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {TEAM_MEMBERS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                    <input
                      name="dueDate"
                      type="date"
                      min={todayStr}
                      defaultValue={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ""}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <TaskProgressJournal task={editingTask} onUpdateAdded={() => { router.refresh(); }} />
              )}
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
