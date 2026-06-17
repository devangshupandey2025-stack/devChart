"use client";

import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, X, Trash2, Calendar as CalendarIcon, Clock, Target, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

type CalendarCategory = "MEETING" | "EVENT" | "MILESTONE" | "DEADLINE";

interface NormalizedEvent {
  id: string;
  title: string;
  projectName?: string;
  date: Date;
  category: CalendarCategory;
  description?: string;
  isOverdue?: boolean;
  rawType: "task" | "event";
}

export default function CalendarView() {
  const [eventsData, setEventsData] = useState<NormalizedEvent[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = React.useRef<FullCalendar>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentView, setCurrentView] = useState("dayGridMonth");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-w: 768px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Quick Add Form
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const [quickAddDate, setQuickAddDate] = useState("");
  const [quickAddType, setQuickAddType] = useState("EVENT");
  const [quickAddProjectId, setQuickAddProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const [eventsRes, tasksRes, projectsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/tasks"),
        fetch("/api/projects"),
      ]);

      const events = await eventsRes.json();
      const tasks = await tasksRes.json();
      const projects = await projectsRes.json();
      
      const projectMap = new Map();
      if (Array.isArray(projects)) {
        setProjectsData(projects);
        projects.forEach(p => projectMap.set(p._id, p.name));
      }

      const normalized: NormalizedEvent[] = [];
      const now = new Date();

      if (Array.isArray(events)) {
        events.forEach((e: any) => {
          normalized.push({
            id: e._id,
            title: e.title,
            projectName: e.projectId ? projectMap.get(e.projectId) : undefined,
            date: new Date(e.startDate),
            category: e.type as CalendarCategory,
            description: e.description,
            rawType: "event",
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
              projectName: t.projectId ? projectMap.get(t.projectId) : undefined,
              date: dueDate,
              category: "DEADLINE",
              description: t.description,
              isOverdue,
              rawType: "task",
            });
          }
        });
      }

      setEventsData(normalized);
    } catch (error) {
      console.error("Failed to fetch calendar data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle || !quickAddDate) return;

    if (quickAddType === "TASK" && !quickAddProjectId) {
      alert("Please select a project to create a task.");
      return;
    }

    try {
      setIsSubmitting(true);

      let res;
      if (quickAddType === "TASK") {
        res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: quickAddTitle,
            dueDate: new Date(quickAddDate).toISOString(),
            projectId: quickAddProjectId,
            priority: "Medium"
          }),
        });
      } else {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: quickAddTitle,
            startDate: new Date(quickAddDate).toISOString(),
            type: quickAddType,
          }),
        });
      }

      if (res.ok) {
        setShowQuickAdd(false);
        setQuickAddTitle("");
        setQuickAddDate("");
        setQuickAddType("EVENT");
        setQuickAddProjectId("");
        fetchCalendarData();
      }
    } catch (error) {
      console.error("Failed to add quick event", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedEvent(null);
        fetchCalendarData();
      } else {
        alert("Cannot delete task deadlines from Calendar. Manage them in Projects.");
      }
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  // Prepare fullcalendar events
  const calendarEvents = eventsData.map((e) => {
    let color = "#a855f7"; // EVENT (purple)
    if (e.category === "MEETING") color = "#22c55e"; // green
    if (e.category === "MILESTONE") color = "#f97316"; // orange
    if (e.category === "DEADLINE") color = e.isOverdue ? "#ef4444" : "#3b82f6"; // red/blue

    return {
      id: e.id,
      title: e.projectName ? `${e.projectName}: ${e.title}` : e.title,
      date: e.date.toISOString().split("T")[0],
      backgroundColor: color,
      borderColor: color,
      extendedProps: { ...e },
    };
  });

  // Agenda groupings
  const agenda = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // get end of week (assuming Sunday start for simplicity, or just +7 days)
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
    <div className="flex flex-col md:flex-row w-full h-full min-h-[600px]">
      
      {/* LEFT: FullCalendar */}
      <div className="flex-1 p-4 md:p-6 border-r border-gray-100 flex flex-col relative h-[80vh] overflow-auto hide-scrollbar">
        
        {/* Top Legend (Scrollable on mobile) */}
        <div className="flex justify-start md:justify-end mb-4 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg whitespace-nowrap">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Deadlines</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Meetings</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5B5FC7]"></span> Events</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Milestones</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Overdue</span>
          </div>
        </div>

        {/* CUSTOM MS TEAMS STYLE CALENDAR HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Mobile specific layout */}
          <div className="flex w-full justify-between items-center md:hidden">
            <div className="flex flex-col gap-2">
              <div className="flex border border-gray-200 rounded-lg overflow-hidden w-fit shadow-sm">
                <button onClick={() => calendarRef.current?.getApi().prev()} className="px-3 py-1.5 bg-white hover:bg-gray-50 border-r border-gray-200 text-gray-700 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => calendarRef.current?.getApi().next()} className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button onClick={() => calendarRef.current?.getApi().today()} className="px-4 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm w-fit transition-colors">
                Today
              </button>
            </div>

            <div className="text-center font-extrabold text-[#111827] flex flex-col items-center justify-center">
              {currentTitle.split(' ').length === 2 ? (
                <>
                  <span className="text-[22px] leading-tight">{currentTitle.split(' ')[0]}</span>
                  <span className="text-[22px] leading-tight">{currentTitle.split(' ')[1]}</span>
                </>
              ) : (
                <span className="text-xl leading-tight max-w-[120px] text-center">{currentTitle}</span>
              )}
            </div>

            <div>
              <button 
                onClick={() => {
                   const api = calendarRef.current?.getApi();
                   const newView = currentView === 'dayGridMonth' ? 'dayGridWeek' : 'dayGridMonth';
                   api?.changeView(newView);
                   setCurrentView(newView);
                }}
                className="px-4 py-2.5 bg-[#E5E7EB] text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors border border-gray-200"
              >
                {currentView === 'dayGridMonth' ? 'Month' : 'Week'}
              </button>
            </div>
          </div>

          {/* Desktop specific layout */}
          <div className="hidden md:flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <button onClick={() => calendarRef.current?.getApi().today()} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                Today
              </button>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button onClick={() => calendarRef.current?.getApi().prev()} className="px-2 py-2 bg-white hover:bg-gray-50 border-r border-gray-200 text-gray-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => calendarRef.current?.getApi().next()} className="px-2 py-2 bg-white hover:bg-gray-50 text-gray-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">{currentTitle}</h2>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <select 
                value={currentView}
                onChange={(e) => {
                  calendarRef.current?.getApi().changeView(e.target.value);
                  setCurrentView(e.target.value);
                }}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#5B5FC7] focus:border-[#5B5FC7] block p-2 shadow-sm font-medium outline-none cursor-pointer"
              >
                <option value="dayGridMonth">Month</option>
                <option value="dayGridWeek">Week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full calendar-container mt-2">
          <FullCalendar
            ref={calendarRef}
            key={isMobile ? 'mobile' : 'desktop'}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={currentView}
            events={calendarEvents}
            eventClick={(info) => {
              setSelectedEvent(info.event.extendedProps as NormalizedEvent);
            }}
            datesSet={(arg) => setCurrentTitle(arg.view.title)}
            height="auto"
            headerToolbar={false}
          />
        </div>

        {/* MS Teams Style Mobile Quick Event Button */}
        {isMobile && !showQuickAdd && (
          <div className="mt-4 pb-4">
            <button 
              onClick={() => {
                setShowQuickAdd(true);
                setTimeout(() => document.getElementById('quick-add-panel')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="w-full py-3.5 bg-[#5B5FC7] text-white rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#5B5FC7]/30 active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" /> Quick Event
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Agenda Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-gray-50/50 flex flex-col border-l border-gray-100 h-[80vh] overflow-hidden" id="quick-add-panel">
        <div className="p-4 bg-white border-b border-gray-100 flex-shrink-0">
          {!showQuickAdd ? (
            <button 
              onClick={() => setShowQuickAdd(true)}
              className={`${isMobile ? 'hidden' : 'flex'} w-full py-2.5 bg-[#5B5FC7] hover:bg-[#4d51a8] text-white rounded-lg font-medium text-sm items-center justify-center gap-2 transition-colors shadow-sm`}
            >
              <Plus className="w-4 h-4" /> New Event
            </button>
          ) : (
            <form onSubmit={handleQuickAdd} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-gray-700">Quick Add Event</h4>
                <button type="button" onClick={() => setShowQuickAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <select
                value={quickAddType}
                onChange={e => setQuickAddType(e.target.value)}
                className="w-full mb-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="EVENT">Event</option>
                <option value="MILESTONE">Milestone</option>
                <option value="MEETING">Meeting</option>
                <option value="TASK">Task Deadline</option>
              </select>
              
              {quickAddType === "TASK" && (
                <select
                  value={quickAddProjectId}
                  onChange={e => setQuickAddProjectId(e.target.value)}
                  className="w-full mb-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select a Project...</option>
                  {projectsData.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              )}

              <input 
                type="text" 
                placeholder={quickAddType === "TASK" ? "Task Title..." : "Event Title..."} 
                value={quickAddTitle}
                onChange={e => setQuickAddTitle(e.target.value)}
                className="w-full mb-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <input 
                type="date" 
                value={quickAddDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setQuickAddDate(e.target.value)}
                className="w-full mb-3 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !quickAddTitle || !quickAddDate}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium text-xs disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Event"}
              </button>
            </form>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading ? (
             <div className="text-center py-10 text-sm text-gray-500">Loading agenda...</div>
          ) : (
            <>
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
                          onClick={() => setSelectedEvent(item)}
                          className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">{getCategoryIcon(item)}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-bold truncate ${item.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {item.projectName && <span className="text-gray-400 font-medium mr-1">[{item.projectName}]</span>}
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
            </>
          )}
        </div>
      </div>

      {/* MODAL / DRAWER FOR EVENT DETAILS */}
      {selectedEvent && (
        <div className="absolute inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="w-full md:w-96 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Details</h2>
              <button onClick={() => setSelectedEvent(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {getCategoryIcon(selectedEvent)}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {selectedEvent.category} {selectedEvent.projectName && `• ${selectedEvent.projectName}`}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedEvent.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Date</p>
                  <p className="text-sm text-gray-900 font-medium">{selectedEvent.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {selectedEvent.description && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              {selectedEvent.rawType === 'event' ? (
                <button 
                  onClick={() => handleDelete(selectedEvent.id)}
                  className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-red-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete Event
                </button>
              ) : (
                <div className="text-center text-xs text-gray-500 p-3 bg-white border border-gray-200 rounded-lg">
                  Task deadlines cannot be deleted from the calendar. Please manage them in the Projects view.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* We need some minor global css for FullCalendar if not already present. */}
      <style dangerouslySetInnerHTML={{__html: `
        .calendar-container .fc {
          --fc-border-color: #f3f4f6;
          --fc-button-bg-color: #f9fafb;
          --fc-button-border-color: #e5e7eb;
          --fc-button-text-color: #374151;
          --fc-button-hover-bg-color: #f3f4f6;
          --fc-button-hover-border-color: #d1d5db;
          --fc-button-active-bg-color: #e5e7eb;
          --fc-button-active-border-color: #d1d5db;
          --fc-today-bg-color: #f0fdf4;
        }
        .calendar-container .fc-theme-standard th {
          padding: 12px 0;
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 900;
          color: #4B5563;
        }
        .calendar-container .fc-daygrid-day-number {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          padding: 8px;
        }
        .calendar-container .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-bottom: 2px;
        }
        .calendar-container .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 800 !important;
          color: #111827;
        }
        @media (max-w: 768px) {
          .calendar-container .fc-toolbar-title {
            font-size: 0.95rem !important;
          }
          .calendar-container .fc-header-toolbar {
            flex-direction: column;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px !important;
          }
          .calendar-container .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          .calendar-container .fc-event {
            font-size: 9px !important;
            padding: 1px !important;
          }
          .calendar-container .fc-daygrid-day-number {
            font-size: 11px !important;
            padding: 4px !important;
          }
          .calendar-container .fc-theme-standard th {
            padding: 10px 0 !important;
            font-size: 12px !important;
            color: #6B7280;
          }
        }
        /* Hide scrollbar utility */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
