import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: string; // e.g. "+5%"
  onClick?: () => void;
  isWarning?: boolean;
}

export default function StatCard({ title, value, icon, subtitle, trend, onClick, isWarning }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col relative group ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300' : 'transition-shadow'
      } ${isWarning ? 'border-red-200 hover:border-red-300 bg-red-50/30' : 'border-gray-100'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium ${isWarning ? 'text-red-600' : 'text-gray-500'}`}>{title}</h3>
        <div className={`p-2 rounded-lg ${isWarning ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.startsWith('-') ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
      
      {onClick && (
        <div className={`mt-auto pt-3 border-t mt-4 flex items-center justify-between text-xs font-semibold transition-colors ${
          isWarning 
            ? 'border-red-100/70 text-red-600 group-hover:text-red-700' 
            : 'border-gray-100 text-indigo-600 group-hover:text-indigo-700'
        }`}>
          <span>Explore stats</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );
}
