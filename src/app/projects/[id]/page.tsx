import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Project from "@/models/Project";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { TaskType } from "@/types";

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
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col h-screen bg-gray-50/30 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {project.name}
        </h1>
        {project.description && (
          <p className="text-gray-500 mt-2">{project.description}</p>
        )}
      </div>

      {/* The Kanban Board Client Component */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialTasks={tasks} projectId={projectId} />
      </div>
    </div>
  );
}
