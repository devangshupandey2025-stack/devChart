"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateProject = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const project = await response.json();
      router.push(`/projects/${project._id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-100/50">
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8 text-teal-600">
          Create a New Project
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Marketing Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 mt-2 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
