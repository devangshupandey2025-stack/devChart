import { formatDistanceToNow } from "date-fns";
import { Plus, CheckCircle2, User, Rocket, Calendar, Flag, Sparkles, Activity as ActivityIcon, Edit3 } from "lucide-react";

export interface Activity {
  _id: string;
  type?: string;
  taskTitle?: string;
  eventTitle?: string;
  projectName?: string;
  previousStatus?: string;
  newStatus?: string;
  assignedTo?: string;
  xpAwarded?: number;
  action?: string;
  updatePreview?: string;
  createdAt: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

function getActivityContent(activity: Activity) {
  if (activity.type === "TASK_CREATED") {
    return { icon: <Plus className="w-3.5 h-3.5 text-gray-500" />, text: <span>Created task <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span></span> };
  }
  if (activity.type === "TASK_COMPLETED") {
    return { icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />, text: <span><span className="font-medium text-gray-900">{activity.assignedTo || "Someone"}</span> completed <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span> <span className="text-green-600 font-medium ml-1">(+{activity.xpAwarded || 0} XP)</span></span> };
  }
  if (activity.type === "TASK_ASSIGNED") {
    return { icon: <User className="w-3.5 h-3.5 text-blue-500" />, text: <span><span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span> assigned to {activity.assignedTo}</span> };
  }
  if (activity.type === "STATUS_CHANGED") {
    return { icon: <Rocket className="w-3.5 h-3.5 text-purple-500" />, text: <span><span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span> moved from {activity.previousStatus?.replace('_', ' ')} → {activity.newStatus?.replace('_', ' ')}</span> };
  }
  if (activity.type === "EVENT_CREATED") {
    return { icon: <Calendar className="w-3.5 h-3.5 text-orange-500" />, text: <span>Created event <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">{activity.eventTitle}</span></span> };
  }
  if (activity.type === "MILESTONE_CREATED" || activity.type === "MILESTONE_REACHED") {
    if (activity.taskTitle) {
        return { icon: <Flag className="w-3.5 h-3.5 text-amber-500" />, text: <span>🏁 <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span> {activity.action}</span> };
    }
    return { icon: <Flag className="w-3.5 h-3.5 text-red-500" />, text: <span>{activity.type === "MILESTONE_CREATED" ? "Created milestone" : "Reached milestone"} <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">{activity.eventTitle}</span></span> };
  }
  if (activity.type === "PROJECT_CREATED") {
    return { icon: <Sparkles className="w-3.5 h-3.5 text-yellow-500" />, text: <span>Created project <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">{activity.projectName}</span></span> };
  }
  if (activity.type === "TASK_PROGRESS_UPDATE") {
    return {
      icon: <Edit3 className="w-3.5 h-3.5 text-teal-500" />,
      text: (
        <span className="flex flex-col gap-1.5 mt-0.5">
          <span>📝 <span className="font-medium text-gray-900">{activity.assignedTo || "Someone"}</span> updated <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs inline-block align-bottom">{activity.taskTitle}</span></span>
          {activity.updatePreview && (
            <span className="text-gray-600 italic bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100/80 text-xs shadow-sm max-w-full truncate">"{activity.updatePreview}"</span>
          )}
        </span>
      )
    };
  }
  
  // Fallback
  return { icon: <ActivityIcon className="w-3.5 h-3.5 text-gray-400" />, text: <span>Someone <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs inline-block align-bottom">{activity.action}</span></span> };
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col max-h-[300px] md:max-h-[500px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
      
      <div className="overflow-y-auto flex-1 pr-2 animate-in fade-in duration-200">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No recent activity.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {activities.map((activity) => {
              const content = getActivityContent(activity);
              return (
                <div key={activity._id} className="relative pl-6">
                  {/* Timeline Icon */}
                  <div className="absolute w-6 h-6 bg-white rounded-full -left-[13px] -top-1 ring-4 ring-white flex items-center justify-center text-sm shadow-sm border border-gray-100">
                    {content.icon}
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm text-gray-700 leading-tight">
                      {content.text}
                    </p>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-medium">
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
