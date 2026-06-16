"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "../dashboard/ActivityFeed";
import { Plus, CheckCircle2, User, Rocket, Calendar, Flag, Sparkles, Activity as ActivityIcon, Edit3 } from "lucide-react";

interface ProjectTimelineProps {
  activities: Activity[];
}

function getActivityContent(activity: Activity) {
  if (activity.type === "TASK_CREATED") {
    return { icon: <Plus className="w-3.5 h-3.5 text-gray-500" />, text: <span>Created task <span className="font-medium text-gray-900">{activity.taskTitle}</span></span> };
  }
  if (activity.type === "TASK_COMPLETED") {
    return { icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />, text: <span><span className="font-medium text-gray-900">{activity.assignedTo || "Someone"}</span> completed {activity.taskTitle} <span className="text-green-600 font-medium ml-1">(+{activity.xpAwarded || 0} XP)</span></span> };
  }
  if (activity.type === "TASK_ASSIGNED") {
    return { icon: <User className="w-3.5 h-3.5 text-blue-500" />, text: <span><span className="font-medium text-gray-900">{activity.taskTitle}</span> assigned to {activity.assignedTo}</span> };
  }
  if (activity.type === "STATUS_CHANGED") {
    return { icon: <Rocket className="w-3.5 h-3.5 text-purple-500" />, text: <span><span className="font-medium text-gray-900">{activity.taskTitle}</span> moved from {activity.previousStatus?.replace('_', ' ')} → {activity.newStatus?.replace('_', ' ')}</span> };
  }
  if (activity.type === "EVENT_CREATED") {
    return { icon: <Calendar className="w-3.5 h-3.5 text-orange-500" />, text: <span>Created event <span className="font-medium text-gray-900">{activity.eventTitle}</span></span> };
  }
  if (activity.type === "MILESTONE_CREATED" || activity.type === "MILESTONE_REACHED") {
    if (activity.taskTitle) {
        return { icon: <Flag className="w-3.5 h-3.5 text-amber-500" />, text: <span>🏁 <span className="font-medium text-gray-900">{activity.taskTitle}</span> {activity.action}</span> };
    }
    return { icon: <Flag className="w-3.5 h-3.5 text-red-500" />, text: <span>{activity.type === "MILESTONE_CREATED" ? "Created milestone" : "Reached milestone"} <span className="font-medium text-gray-900">{activity.eventTitle}</span></span> };
  }
  if (activity.type === "PROJECT_CREATED") {
    return { icon: <Sparkles className="w-3.5 h-3.5 text-yellow-500" />, text: <span>Created project <span className="font-medium text-gray-900">{activity.projectName}</span></span> };
  }
  if (activity.type === "TASK_PROGRESS_UPDATE") {
    return {
      icon: <Edit3 className="w-3.5 h-3.5 text-teal-500" />,
      text: (
        <span className="flex flex-col gap-1.5 mt-0.5">
          <span>📝 <span className="font-medium text-gray-900">{activity.assignedTo || "Someone"}</span> updated <span className="font-medium text-gray-900">{activity.taskTitle}</span></span>
          {activity.updatePreview && (
            <span className="text-gray-600 italic bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100/80 text-xs shadow-sm">"{activity.updatePreview}"</span>
          )}
        </span>
      )
    };
  }
  
  // Fallback
  return { icon: <ActivityIcon className="w-3.5 h-3.5 text-gray-400" />, text: <span>Someone <span className="font-medium text-gray-900">{activity.action}</span></span> };
}

export default function ProjectTimeline({ activities }: ProjectTimelineProps) {
  const [filter, setFilter] = useState<"ALL" | "TASKS" | "EVENTS" | "MILESTONES">("ALL");

  const filteredActivities = activities.filter(a => {
    if (filter === "ALL") return true;
    if (filter === "TASKS") return ["TASK_CREATED", "TASK_COMPLETED", "TASK_ASSIGNED", "STATUS_CHANGED", "TASK_PROGRESS_UPDATE"].includes(a.type || "");
    if (filter === "EVENTS") return ["EVENT_CREATED"].includes(a.type || "");
    if (filter === "MILESTONES") return ["MILESTONE_CREATED", "MILESTONE_REACHED"].includes(a.type || "");
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        <div className="flex gap-2">
          {["ALL", "TASKS", "EVENTS", "MILESTONES"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 pr-2">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No activity found.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {filteredActivities.map((activity) => {
              const content = getActivityContent(activity);
              return (
                <div key={activity._id} className="relative pl-6">
                  {/* Timeline Icon */}
                  <div className="absolute w-6 h-6 bg-white rounded-full -left-[13px] -top-1 ring-4 ring-white flex items-center justify-center text-sm shadow-sm border border-gray-100">
                    {content.icon}
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-700 leading-tight">
                      {content.text}
                    </p>
                    <span className="text-xs text-gray-400 mt-1.5 font-medium">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
