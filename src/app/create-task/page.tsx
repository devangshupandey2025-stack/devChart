"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectType } from "@/types";
import { TEAM_MEMBERS } from "@/lib/constants";

function CreateTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams ? searchParams.get("projectId") : null;

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        const projectsArray = Array.isArray(data) ? data : [];
        setProjects(projectsArray);
        
        if (preselectedProjectId && projectsArray.some(p => p._id === preselectedProjectId)) {
          setProjectId(preselectedProjectId);
        } else if (projectsArray.length > 0) {
          setProjectId(projectsArray[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [preselectedProjectId]);

  const todayStr = new Date().toISOString().split("T")[0];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!projectId) {
      alert("Please select a project or create one first!");
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title,
          description,
          priority,
          assignedTo: assignedTo || undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to create");

      alert("Task created successfully!");
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  }

  return (
    <div className="min-h-screen bg-orange-100/50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8 text-teal-600">
          Create a New Task
        </h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h2>
            <p className="text-gray-500 mb-4">You need to create a project before adding tasks.</p>
            <button 
              onClick={() => router.push("/create-project")}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Create Project
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                placeholder="e.g. Design Homepage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Task details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Unassigned</option>
                  {TEAM_MEMBERS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-4 mt-2 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors"
            >
              Create Task
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CreateTask() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-orange-100/50">
        <p className="text-gray-500 font-semibold">Loading form...</p>
      </div>
    }>
      <CreateTaskForm />
    </Suspense>
  );
}