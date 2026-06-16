import React from 'react';
import { ProjectTemplate } from '@/lib/templates';

interface Props {
  template: ProjectTemplate | null;
}

export default function TemplatePreview({ template }: Props) {
  if (!template) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <span className="text-2xl text-gray-400">+</span>
        </div>
        <h3 className="font-bold text-gray-700 mb-2">Custom Project</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Start with a blank slate. You can add your own tasks, milestones, and deadlines later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="mb-6 pb-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-2xl font-black text-gray-900 mb-1">{template.name} Blueprint</h3>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
        
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Expected Outcome</h4>
          <p className="text-sm text-indigo-900 font-medium">{template.expectedOutcome}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        
        <div>
          <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Will Generate</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-green-500">✓</span> {template.tasks.length} Priority-Assigned Tasks
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-green-500">✓</span> {template.milestones.length} Calendar Milestones
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-green-500">✓</span> {template.suggestedDuration} Day Auto-Scheduled Timeline
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-green-500">✓</span> Planning Calendar Events
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span className="text-green-500">✓</span> Operations Dashboard Metrics
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Blueprint Timeline Preview</h4>
          <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6">
            {template.milestones.map((m, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7.5px] top-1.5 ring-4 ring-white"></div>
                <div className="text-xs font-bold text-indigo-600 mb-0.5">Day {m.dayOffset}</div>
                <div className="text-sm font-bold text-gray-800">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
