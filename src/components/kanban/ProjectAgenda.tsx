"use client";

import React, { useMemo } from "react";
import { TaskType } from "@/types";
import { Calendar as CalendarIcon, Clock, Target, AlertCircle } from "lucide-react";

type CalendarCategory = "MEETING" | "EVENT" | "MILESTONE" | "DEADLINE";

interface NormalizedEvent {
  id: string;
  title: string;
  date: Date;
  category: CalendarCategory;
  isOverdue?: boolean;
}

interface ProjectAgendaProps {
  tasks: TaskType[];
  events: any[]; // Project Events
}

export default function ProjectAgenda({ tasks, events }: ProjectAgendaProps) {
  const eventsData = useMemo(() => {
    const normalized: NormalizedEvent[] = [];
    const now = new Date();

    if (Array.isArray(events)) {
      events.forEach((e: any) => {
        normalized.push({
          id: e._id,
          title: e.title,
          date: new Date(e.startDate),
          category: e.type as CalendarCategory,
        });
      });
    }

    if (Array.isArray(tasks)) {
      tasks.forEach((t: any) => {
        if (t.dueDate && t.status !== "DONE") {
          const dueDate = new Date(t.dueDate);
          const isOverdue = dueDate < now;
          normalized.push({
            id: t._id,
            title: t.title,
            date: dueDate,
            category: "DEADLINE",
            isOverdue,
          });
        }
      });
    }
    return normalized;
  }, [tasks, events]);

  const agenda = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const groups = {
      Today: [] as NormalizedEvent[],
      Tomorrow: [] as NormalizedEvent[],
      "This Week": [] as NormalizedEvent[],
      Upcoming: [] as NormalizedEvent[],
    };

    eventsData.slice().sort((a, b) => a.date.getTime() - b.date.getTime()).forEach((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === today.getTime() || (e.isOverdue && d.getTime() < today.getTime())) {
        groups["Today"].push(e);
      } else if (d.getTime() === tomorrow.getTime()) {
        groups["Tomorrow"].push(e);
      } else if (d.getTime() > tomorrow.getTime() && d.getTime() <= endOfWeek.getTime()) {
        groups["This Week"].push(e);
      } else if (d.getTime() > endOfWeek.getTime()) {
        groups["Upcoming"].push(e);
      }
    });

    return groups;
  }, [eventsData]);

  const getCategoryIcon = (e: NormalizedEvent) => {
    if (e.category === "MEETING") return <Clock className="w-4 h-4 text-green-500" />;
    if (e.category === "MILESTONE") return <Target className="w-4 h-4 text-orange-500" />;
    if (e.category === "DEADLINE") return e.isOverdue ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-blue-500" />;
    return <CalendarIcon className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="w-full h-full bg-white flex flex-col border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-500" />
          Project Timeline
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(agenda).map(([groupName, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={groupName}>
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">
                {groupName} ({items.length})
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getCategoryIcon(item)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${item.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {eventsData.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-500">
            No upcoming events or deadlines.
          </div>
        )}
      </div>
    </div>
  );
}
