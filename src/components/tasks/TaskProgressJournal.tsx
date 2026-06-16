"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { AlertTriangle, Clock, Send } from "lucide-react";
import { TaskType } from "@/types";
import { TEAM_MEMBERS } from "@/lib/constants";

interface TaskUpdateType {
  _id: string;
  author: string;
  updateText: string;
  progress: number;
  createdAt: string;
}

interface TaskProgressJournalProps {
  task: TaskType;
  onUpdateAdded: () => void;
}

export default function TaskProgressJournal({ task, onUpdateAdded }: TaskProgressJournalProps) {
  const [updates, setUpdates] = useState<TaskUpdateType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUpdateText, setNewUpdateText] = useState("");
  const [newProgress, setNewProgress] = useState(task.currentProgress || 0);
  const [author, setAuthor] = useState(task.assignedTo || TEAM_MEMBERS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewProgress(task.currentProgress || 0);
  }, [task.currentProgress]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch(`/api/tasks/${task._id}/updates`);
        if (res.ok) {
          const data = await res.json();
          setUpdates(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpdates();
  }, [task._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author,
          updateText: newUpdateText.trim(),
          progress: newProgress,
        }),
      });

      if (res.ok) {
        const newUpdate = await res.json();
        setUpdates([newUpdate, ...updates]);
        setNewUpdateText("");
        onUpdateAdded();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysSinceLastUpdate = task.updatedAt ? differenceInDays(new Date(), new Date(task.updatedAt)) : 0;
  const isStale = daysSinceLastUpdate > 7 && task.status !== "DONE";

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Current Progress</div>
            <div className="text-xl font-bold text-gray-900">{task.currentProgress || 0}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Updates</div>
            <div className="text-xl font-bold text-gray-900">{task.updateCount || 0}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Last Update</div>
            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              {task.updateCount ? (task.updatedAt ? `${formatDistanceToNow(new Date(task.updatedAt))} ago` : 'Never') : 'Never'}
            </div>
          </div>
        </div>
        
        {isStale && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
            Needs Attention ({daysSinceLastUpdate} days stale)
          </div>
        )}
      </div>

      {/* Add Update Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative">
        <div className="flex items-center justify-between">
           <span className="text-xs font-bold text-gray-500">NEW UPDATE</span>
           <select 
             value={author}
             onChange={(e) => setAuthor(e.target.value)}
             className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded border border-teal-100 focus:outline-none"
           >
              {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
           </select>
        </div>
        <textarea
          placeholder="What's the latest progress? (Required)"
          value={newUpdateText}
          onChange={(e) => setNewUpdateText(e.target.value)}
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-gray-800 placeholder-gray-400 transition-all"
        />
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 pt-3 border-t border-gray-50">
          <div className="flex-1 flex items-center gap-3 min-w-[200px]">
            <span className="text-xs font-semibold text-gray-500 w-16">Progress</span>
            <input
              type="range"
              min="0"
              max="100"
              value={newProgress}
              onChange={(e) => setNewProgress(Number(e.target.value))}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <span className="text-xs font-bold text-gray-700 w-8">{newProgress}%</span>
          </div>
          
          <button
            type="submit"
            disabled={!newUpdateText.trim() || isSubmitting}
            className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Post
          </button>
        </div>
      </form>

      {/* Timeline */}
      <div className="flex flex-col gap-4 mt-2">
        <h4 className="text-sm font-bold text-gray-900">Timeline</h4>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading updates...</div>
        ) : updates.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
            No updates yet. Be the first to post progress!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {updates.map((update) => (
              <div key={update._id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  {update.author.charAt(0)}
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-gray-900">{update.author}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(update.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{update.updateText}</p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 w-fit px-2 py-0.5 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    Progress: {update.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
