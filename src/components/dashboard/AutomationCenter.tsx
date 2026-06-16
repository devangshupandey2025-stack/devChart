import React from "react";
import { AlertCircle, Clock, CheckCircle2, Bot, AlertTriangle } from "lucide-react";

interface StaleTask {
  id: string;
  title: string;
  lastUpdateDate: string;
  daysStale: number;
  severity: string;
}

interface RiskTask {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  severity: string;
}

interface AchievedMilestone {
  _id: string;
  taskTitle: string;
  createdAt: string;
}

interface AutomationCenterProps {
  staleTasks: StaleTask[];
  riskTasks: RiskTask[];
  achievedMilestones: AchievedMilestone[];
}

function formatDueDate(dueDateStr: string) {
  const due = new Date(dueDateStr);
  const now = new Date();
  
  // Strip time for accurate day difference
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "Due Tomorrow";
  if (diffDays === -1) return "Due Yesterday";
  if (diffDays > 1) return `Due in ${diffDays} days`;
  return `Overdue by ${Math.abs(diffDays)} days`;
}

export default function AutomationCenter({ 
  staleTasks = [], 
  riskTasks = [], 
  achievedMilestones = [] 
}: AutomationCenterProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <Bot className="w-6 h-6 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Automation Center</h2>
          <p className="text-xs text-gray-500">Intelligent operational insights</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tasks Needing Attention */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            Tasks Needing Attention ({staleTasks.length})
          </h3>
          <div className="space-y-3">
            {staleTasks.length > 0 ? (
              staleTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100 transition-colors hover:bg-gray-100">
                  <span className="font-medium text-gray-800 text-sm">{task.title}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                    Last update {task.daysStale} days ago
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">All active tasks have recent updates</p>
            )}
          </div>
        </div>

        {/* Deadlines At Risk */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Deadlines At Risk ({riskTasks.length})
          </h3>
          <div className="space-y-3">
            {riskTasks.length > 0 ? (
              riskTasks.map((task) => (
                <div key={task.id} className={`p-3 rounded-lg flex justify-between items-center border transition-colors ${task.severity === 'high' ? 'bg-red-50 border-red-100 hover:bg-red-100' : 'bg-orange-50 border-orange-100 hover:bg-orange-100'}`}>
                  <div>
                    <div className={`font-medium text-sm ${task.severity === 'high' ? 'text-red-900' : 'text-orange-900'}`}>{task.title}</div>
                    <div className={`text-xs mt-0.5 ${task.severity === 'high' ? 'text-red-600' : 'text-orange-600'}`}>
                      {task.progress}% Complete
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md border font-medium ${task.severity === 'high' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-orange-100 border-orange-200 text-orange-700'}`}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">No deadlines currently at risk</p>
            )}
          </div>
        </div>

        {/* Recently Achieved */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Recently Achieved ({achievedMilestones.length})
          </h3>
          <div className="space-y-3">
            {achievedMilestones.length > 0 ? (
              achievedMilestones.map((milestone) => (
                <div key={milestone._id} className="p-3 bg-green-50 rounded-lg flex justify-between items-center border border-green-100 transition-colors hover:bg-green-100">
                  <span className="font-medium text-green-900 text-sm">{milestone.taskTitle}</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md border border-green-200 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> 100% Complete
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">No milestones achieved this week yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
