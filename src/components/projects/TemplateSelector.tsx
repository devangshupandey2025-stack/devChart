import React from 'react';
import { PROJECT_TEMPLATES } from '@/lib/templates';

interface Props {
  selectedTemplateId: string;
  onSelect: (id: string) => void;
}

export default function TemplateSelector({ selectedTemplateId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div 
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplateId === 'custom' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-300'}`}
        onClick={() => onSelect('custom')}
      >
        <h3 className="font-bold text-lg mb-1">Blank Project</h3>
        <p className="text-sm text-gray-500 mb-3">Start from scratch with a custom board</p>
        <div className="flex gap-2 text-xs font-semibold text-gray-400">
          <span>0 Tasks</span>
          <span>•</span>
          <span>0 Milestones</span>
        </div>
      </div>
      
      {PROJECT_TEMPLATES.map(template => (
        <div 
          key={template.id}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplateId === template.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-300'}`}
          onClick={() => onSelect(template.id)}
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-semibold">{template.category}</span>
          </div>
          <p className="text-sm text-gray-500 mb-3">{template.description}</p>
          <div className="flex gap-2 text-xs font-semibold text-teal-600">
            <span>{template.tasks.length} Tasks</span>
            <span>•</span>
            <span>{template.milestones.length} Milestones</span>
          </div>
        </div>
      ))}
    </div>
  );
}
