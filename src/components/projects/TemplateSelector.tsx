import React from 'react';
import { PROJECT_TEMPLATES } from '@/lib/templates';

interface Props {
  selectedTemplateId: string;
  onSelect: (id: string) => void;
}

const categoryStyles: Record<string, { bg: string, text: string, border: string, icon: string, dot: string }> = {
  EVENT: { bg: 'bg-blueprint-blue/10', text: 'text-blueprint-blue', border: 'border-blueprint-blue/20', icon: 'event', dot: 'bg-blueprint-blue' },
  HR: { bg: 'bg-blueprint-orange/10', text: 'text-blueprint-orange', border: 'border-blueprint-orange/20', icon: 'groups', dot: 'bg-blueprint-orange' },
  PROJECT: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/10', icon: 'developer_mode_tv', dot: 'bg-primary' },
  TEAM: { bg: 'bg-blueprint-indigo/10', text: 'text-blueprint-indigo', border: 'border-blueprint-indigo/20', icon: 'lan', dot: 'bg-blueprint-indigo' },
};

export default function TemplateSelector({ selectedTemplateId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {/* Tile: Blank (Custom) */}
      <div 
        onClick={() => onSelect('custom')}
        className={`blueprint-tile group relative bg-white rounded-3xl overflow-hidden p-lg cursor-pointer ${selectedTemplateId === 'custom' ? 'selected-blueprint' : 'border border-black/[0.05] premium-shadow hover:border-primary/20'}`}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-md">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
            </div>
            <span className="bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">Core</span>
          </div>
          <h3 className="font-bold text-xl mb-2 text-on-surface">Tabula Rasa</h3>
          <p className="text-on-surface-variant text-[13px] mb-md leading-relaxed font-medium">Start with a clean slate for unique workflows that don't fit standard patterns.</p>
          
          <div className="mt-6 pt-5 border-t border-black/[0.04] flex items-center justify-between">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80">Efficiency Rating</span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-black/[0.1]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-black/[0.1]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Templates */}
      {PROJECT_TEMPLATES.map(template => {
        const style = categoryStyles[template.category] || categoryStyles.PROJECT;
        return (
          <div 
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`blueprint-tile group relative bg-white rounded-3xl overflow-hidden p-lg cursor-pointer ${selectedTemplateId === template.id ? 'selected-blueprint' : 'border border-black/[0.05] premium-shadow hover:border-primary/20'}`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-md">
                <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center shadow-inner`}>
                  <span className={`material-symbols-outlined ${style.text} text-3xl`}>{style.icon}</span>
                </div>
                <span className={`${style.bg} ${style.text} border ${style.border} px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest`}>{template.category}</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-on-surface group-hover:text-primary transition-colors">{template.name}</h3>
              <p className="text-on-surface-variant text-[13px] mb-md leading-relaxed font-medium">{template.description}</p>
              
              <div className="mt-6 pt-5 border-t border-black/[0.04] flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80">Specs</span>
                <div className="flex gap-2 text-[11px] font-bold text-on-surface-variant/70">
                   <span>{template.tasks.length} Tasks</span>
                   <span>•</span>
                   <span>{template.milestones.length} Milestones</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
