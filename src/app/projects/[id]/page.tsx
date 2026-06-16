import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Project from "@/models/Project";
import Event from "@/models/Event";
import Activity from "@/models/Activity";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ProjectAgenda from "@/components/kanban/ProjectAgenda";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import Navbar from "@/components/Navbar";
import { TaskType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  await connectDB();
  
  const project = await Project.findById(projectId);
  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-700">Project not found</h1>
      </div>
    );
  }

  // Fetch initial tasks to populate the Kanban board server-side
  const tasksRaw = await Task.find({ projectId }).sort({ createdAt: -1 });
  const eventsRaw = await Event.find({ projectId }).sort({ startDate: 1 });
  const activitiesRaw = await Activity.find({ projectId }).sort({ createdAt: -1 }).limit(20);
  
  // Serialize Mongoose docs to plain objects to pass to Client Component
  const tasks: TaskType[] = tasksRaw.map((t) => ({
    _id: t._id.toString(),
    projectId: t.projectId.toString(),
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ? t.dueDate.toISOString() : undefined,
    assignedTo: t.assignedTo,
    currentProgress: t.currentProgress || 0,
    updateCount: t.updateCount || 0,
    latestUpdatePreview: t.latestUpdatePreview,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : undefined,
    createdAt: t.createdAt.toISOString(),
  }));

  const events = eventsRaw.map((e) => ({
    _id: e._id.toString(),
    projectId: e.projectId ? e.projectId.toString() : "",
    title: e.title,
    description: e.description,
    type: e.type,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : undefined,
    createdAt: e.createdAt.toISOString(),
  }));

  const activities = activitiesRaw.map(a => ({
    _id: a._id.toString(),
    type: a.type,
    taskTitle: a.taskTitle,
    eventTitle: a.eventTitle,
    projectName: a.projectName,
    previousStatus: a.previousStatus,
    newStatus: a.newStatus,
    assignedTo: a.assignedTo,
    xpAwarded: a.xpAwarded,
    action: a.action,
    createdAt: a.createdAt.toISOString()
  }));

  const totalTasks = tasksRaw.length;
  let totalProgress = 0;
  tasksRaw.forEach(t => {
      if (t.status === "DONE") totalProgress += 100;
      else totalProgress += (t.currentProgress || 0);
  });
  const completionPercentage = totalTasks === 0 ? 0 : Math.round(totalProgress / totalTasks);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const overdueTasks = tasksRaw.filter(t => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < today).length;

  let statusNode = <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Healthy</span>;
  if (completionPercentage < 30 || overdueTasks > 3) {
    statusNode = <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-500" /> Delayed</span>;
  } else if (completionPercentage < 60 || overdueTasks > 1) {
    statusNode = <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-yellow-500" /> At Risk</span>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50/30">
      <Navbar />
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-gray-500 mt-2">{project.description}</p>
            )}
          </div>

          <div className="bg-white px-5 py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Status</span>
              <div className="text-sm font-medium">{statusNode}</div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{completionPercentage}% complete</span>
              <span>{overdueTasks} overdue task{overdueTasks !== 1 && 's'}</span>
            </div>
            {activities.length > 0 && (
              <div className="text-xs text-gray-400 mt-1 pt-2 border-t border-gray-50">
                Last Activity: <span className="font-medium text-gray-500">{formatDistanceToNow(new Date(activities[0].createdAt))} ago</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-6">
          <div className="flex-1 overflow-hidden">
            <KanbanBoard initialTasks={tasks} projectId={projectId} />
          </div>
          <div className="w-full xl:w-[380px] flex-shrink-0 flex flex-col gap-6 overflow-hidden">
            <div className="flex-none max-h-[40%] overflow-hidden flex flex-col">
              <ProjectAgenda tasks={tasks} events={events} />
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <ProjectTimeline activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
