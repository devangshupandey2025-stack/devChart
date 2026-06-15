"use client";

import React from "react";
import { Clock, Target, Calendar, AlertCircle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: "MEETING" | "EVENT" | "MILESTONE" | "DEADLINE";
  isTask: boolean;
}

export default function UpcomingTimeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Timeline</h3>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No upcoming events or deadlines
        </div>
      </div>
    );
  }

  // Group items by date string (Today, Tomorrow, or specific date)
  const grouped: Record<string, TimelineItem[]> = {};
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  items.forEach(item => {
    const d = new Date(item.date);
    d.setHours(0, 0, 0, 0);

    let groupKey = "";
    if (d.getTime() === today.getTime()) {
      groupKey = "Today";
    } else if (d.getTime() === tomorrow.getTime()) {
      groupKey = "Tomorrow";
    } else {
      groupKey = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(item);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "MEETING": return <Clock className="w-4 h-4 text-green-500" />;
      case "MILESTONE": return <Target className="w-4 h-4 text-orange-500" />;
      case "DEADLINE": return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Calendar className="w-4 h-4 text-purple-500" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "MEETING": return "border-green-100 bg-green-50/50";
      case "MILESTONE": return "border-orange-100 bg-orange-50/50";
      case "DEADLINE": return "border-blue-100 bg-blue-50/50";
      default: return "border-purple-100 bg-purple-50/50";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Timeline</h3>
      
      <div className="flex-1 overflow-y-auto space-y-6">
        {Object.entries(grouped).map(([dateLabel, groupItems]) => (
          <div key={dateLabel}>
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">
              {dateLabel}
            </h4>
            <div className="space-y-3">
              {groupItems.map(item => (
                <div key={item.id} className={`p-3 rounded-xl border ${getColorClass(item.type)} flex items-start gap-3`}>
                  <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs font-medium text-gray-500 capitalize">{item.type.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
