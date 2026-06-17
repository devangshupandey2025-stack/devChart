"use client";

import React, { useState, useMemo } from "react";
import { X, Search, CheckCircle2, ListTodo, Activity, AlertCircle, TrendingUp, ChevronRight, Clock, Target } from "lucide-react";
import Link from "next/link";

export type MetricType = "TOTAL" | "COMPLETED" | "IN_PROGRESS" | "PENDING" | "VELOCITY" | "AT_RISK" | null;

interface DashboardDetails {
  id: string;
  title: string;
  projectName: string;
  projectId: string | null;
  status: string;
  priority: string;
  currentProgress: number;
  assignedTo: string;
  dueDate: string;
  completedAt: string;
  xp: number;
}

interface MetricDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: MetricType;
  dashboardDetails: DashboardDetails[];
  executionVelocity: any;
  riskTasks: any[];
}

export default function MetricDetailsDrawer({
  isOpen,
  onClose,
  metricType,
  dashboardDetails,
  executionVelocity,
  riskTasks
}: MetricDetailsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  const filteredTasks = useMemo(() => {
    let tasks = dashboardDetails;

    if (metricType === "COMPLETED") tasks = tasks.filter(t => t.status === "DONE");
    else if (metricType === "IN_PROGRESS") tasks = tasks.filter(t => t.status === "IN_PROGRESS");
    else if (metricType === "PENDING") tasks = tasks.filter(t => t.status === "TODO");

    if (searchQuery) {
      tasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (priorityFilter !== "All") {
      tasks = tasks.filter(t => t.priority === priorityFilter);
    }

    return tasks;
  }, [dashboardDetails, metricType, searchQuery, priorityFilter]);

  const filteredRiskTasks = useMemo(() => {
    return riskTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [riskTasks, searchQuery]);

  if (!isOpen || !metricType) return null;

  const renderHeader = () => {
    switch (metricType) {
      case "TOTAL": return "Total Tasks";
      case "COMPLETED": return "Completed Tasks";
      case "IN_PROGRESS": return "In Progress Tasks";
      case "PENDING": return "Pending Tasks";
      case "VELOCITY": return "Team Velocity";
      case "AT_RISK": return "At Risk Tasks";
      default: return "";
    }
  };

  const getHeaderIcon = () => {
    switch (metricType) {
      case "TOTAL": return <Target className="w-5 h-5 text-indigo-500" />;
      case "COMPLETED": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "IN_PROGRESS": return <Activity className="w-5 h-5 text-blue-500" />;
      case "PENDING": return <ListTodo className="w-5 h-5 text-amber-500" />;
      case "VELOCITY": return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case "AT_RISK": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getHeaderIcon()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{renderHeader()}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {metricType !== "VELOCITY" && (
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {metricType !== "AT_RISK" && (
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {["All", "High", "Medium", "Low"].map(priority => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                      priorityFilter === priority 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          
          {metricType === "VELOCITY" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-sm font-semibold text-gray-500 mb-1">This Week</div>
                  <div className="text-3xl font-bold text-gray-900">{executionVelocity?.tasksThisWeek || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">tasks completed</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Last Week</div>
                  <div className="text-3xl font-bold text-gray-900">{executionVelocity?.tasksLastWeek || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">tasks completed</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-500">Completion Trend</div>
                  <div className="text-xs text-gray-400 mt-0.5">Vs previous 7 days</div>
                </div>
                <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                  (executionVelocity?.completionTrend || 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {(executionVelocity?.completionTrend || 0) > 0 ? '+' : ''}{executionVelocity?.completionTrend || 0}%
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Recently Completed</h3>
                <div className="space-y-2">
                  {executionVelocity?.recentCompletedTasks?.map((task: any) => (
                    <Link key={task.id} href={`/projects/${task.projectId}`} className="block">
                      <div className="bg-white p-3 rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="pr-4">
                            <div className="text-xs font-semibold text-indigo-500 mb-1">{task.projectName}</div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              {new Date(task.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {(!executionVelocity?.recentCompletedTasks || executionVelocity.recentCompletedTasks.length === 0) && (
                    <div className="text-center py-8 text-sm text-gray-500">No recent tasks completed.</div>
                  )}
                </div>
              </div>
            </div>
          ) : metricType === "AT_RISK" ? (
             <div className="space-y-3">
              {filteredRiskTasks.map((task: any) => (
                <Link key={task.id} href={`/projects`} className="block">
                  <div className="bg-white p-4 rounded-xl border border-red-100 hover:border-red-300 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.severity === 'high' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                    <div className="flex items-start justify-between pl-2">
                      <div className="pr-4">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500 font-medium">Progress: {task.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
              {filteredRiskTasks.length === 0 && (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium text-gray-500">No at-risk tasks found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Link key={task.id} href={task.projectId ? `/projects/${task.projectId}` : '#'} className="block">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className="pr-4 w-full">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-semibold text-indigo-500 truncate max-w-[200px]">{task.projectName}</div>
                          {metricType === "COMPLETED" && (
                            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                              +{task.xp || 0} XP
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 leading-tight">{task.title}</h4>
                        
                        {/* Dynamic Footer based on metricType */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                          {metricType === "TOTAL" && (
                            <>
                              <span className={`px-2 py-0.5 rounded-md font-semibold ${
                                task.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' :
                                task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>{task.status.replace('_', ' ')}</span>
                              {task.priority && <span className="font-medium bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">{task.priority}</span>}
                              {task.assignedTo && <span className="font-medium">@{task.assignedTo}</span>}
                            </>
                          )}
                          
                          {metricType === "COMPLETED" && (
                            <>
                              {task.completedAt && <span className="font-medium text-emerald-600">Done {new Date(task.completedAt).toLocaleDateString()}</span>}
                              {task.assignedTo && <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded">@{task.assignedTo}</span>}
                            </>
                          )}

                          {metricType === "IN_PROGRESS" && (
                            <>
                              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{task.currentProgress}%</span>
                              {task.dueDate && <span className="font-medium">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                              {task.assignedTo && <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded">@{task.assignedTo}</span>}
                            </>
                          )}

                          {metricType === "PENDING" && (
                            <>
                              {task.priority && <span className={`px-2 py-0.5 rounded-md font-semibold ${
                                task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                'bg-gray-50 text-gray-600'
                              }`}>{task.priority} Priority</span>}
                              {task.dueDate && <span className="font-medium">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                              {task.assignedTo && <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded">@{task.assignedTo}</span>}
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors mt-2 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No tasks found.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
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
