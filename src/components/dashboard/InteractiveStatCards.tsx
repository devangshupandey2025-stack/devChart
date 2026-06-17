"use client";

import React, { useState } from "react";
import StatCard from "./StatCard";
import MetricDetailsDrawer, { MetricType } from "./MetricDetailsDrawer";
import { CheckCircle2, ListTodo, Target, Activity, TrendingUp, AlertTriangle } from "lucide-react";

interface InteractiveStatCardsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    completionPercentage: number;
  };
  executionVelocity: any;
  dashboardDetails: any[];
  riskTasks: any[];
}

export default function InteractiveStatCards({
  stats,
  executionVelocity,
  dashboardDetails,
  riskTasks
}: InteractiveStatCardsProps) {
  const [activeMetricType, setActiveMetricType] = useState<MetricType>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCardClick = (type: MetricType) => {
    setActiveMetricType(type);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={<Target className="w-5 h-5" />} 
          onClick={() => handleCardClick("TOTAL")}
        />
        <StatCard 
          title="Completed" 
          value={stats.completedTasks} 
          icon={<CheckCircle2 className="w-5 h-5" />} 
          trend={`${stats.completionPercentage}%`}
          onClick={() => handleCardClick("COMPLETED")}
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressTasks} 
          icon={<Activity className="w-5 h-5" />} 
          onClick={() => handleCardClick("IN_PROGRESS")}
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingTasks} 
          icon={<ListTodo className="w-5 h-5" />} 
          onClick={() => handleCardClick("PENDING")}
        />
        <StatCard 
          title="Velocity" 
          value={executionVelocity?.updatesToday || 0} 
          subtitle="Updates today"
          icon={<TrendingUp className="w-5 h-5" />} 
          trend={`${executionVelocity?.completionTrend > 0 ? '+' : ''}${executionVelocity?.completionTrend || 0}%`}
          onClick={() => handleCardClick("VELOCITY")}
        />
        <StatCard 
          title="At Risk" 
          value={riskTasks?.length || 0} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          isWarning={true}
          onClick={() => handleCardClick("AT_RISK")}
        />
      </div>

      <MetricDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metricType={activeMetricType}
        dashboardDetails={dashboardDetails}
        executionVelocity={executionVelocity}
        riskTasks={riskTasks}
      />
    </>
  );
}
