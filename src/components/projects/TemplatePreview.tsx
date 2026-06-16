import React from 'react';
import { ProjectTemplate } from '@/lib/templates';

interface Props {
  template: ProjectTemplate | null;
  projectName?: string;
  onSubmit?: (e: React.FormEvent | React.MouseEvent) => void;
  isSubmitting?: boolean;
}

export default function TemplatePreview({ template, projectName, onSubmit, isSubmitting }: Props) {
  return (
    <aside className="lg:w-[42%] w-full">
      <div className="sticky top-28 space-y-md">
        <div className="glass-panel rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/80 flex flex-col min-h-[680px]">
          <div className="p-10 pb-4">
            <div className="flex items-center gap-4 mb-lg">
              <div className="w-14 h-14 bg-on-background text-white rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-1 relative flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">architecture</span>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-fixed rounded-full border-2 border-on-background pulse-dot"></div>
              </div>
              <div>
                <h3 className="serif-heading text-3xl text-on-surface">Project Graph</h3>
                <p className="text-on-surface-variant font-bold text-[12px] tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></span>
                  Live Architectural Mapping
                </p>
              </div>
            </div>

            {/* Content area */}
            {!template ? (
              <div className="py-6 flex flex-col items-center justify-center text-center opacity-80 mt-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">add</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2 text-xl">{projectName || "Custom Project"}</h3>
                <p className="text-sm text-gray-500 max-w-xs font-medium">
                  Start with a blank slate. You can add your own tasks, milestones, and deadlines later.
                </p>
              </div>
            ) : (
              <div className="py-2">
                <div className="mb-6 pb-4 border-b border-black/[0.04]">
                  <h3 className="text-2xl font-black text-on-surface mb-1">{template.name}</h3>
                  <p className="text-[13px] font-medium text-on-surface-variant/80 mb-4">{template.description}</p>
                  
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Expected Outcome</h4>
                    <p className="text-[13px] text-on-surface font-medium leading-relaxed">{template.expectedOutcome}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 opacity-80">Generation Specs</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[12px] font-bold text-on-surface bg-white/60 p-2.5 rounded-lg border border-black/[0.04]">
                        <span className="material-symbols-outlined text-sm text-primary">check_circle</span> {template.tasks.length} Priority-Assigned Tasks
                      </div>
                      <div className="flex items-center gap-3 text-[12px] font-bold text-on-surface bg-white/60 p-2.5 rounded-lg border border-black/[0.04]">
                        <span className="material-symbols-outlined text-sm text-primary">check_circle</span> {template.milestones.length} Calendar Milestones
                      </div>
                      <div className="flex items-center gap-3 text-[12px] font-bold text-on-surface bg-white/60 p-2.5 rounded-lg border border-black/[0.04]">
                        <span className="material-symbols-outlined text-sm text-primary">check_circle</span> {template.suggestedDuration} Day Auto-Scheduled Timeline
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4 opacity-80">Timeline Preview</h4>
                    <div className="relative border-l border-primary/20 ml-3 space-y-4">
                      {template.milestones.map((m, idx) => (
                        <div key={idx} className="relative pl-5 group">
                          <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-1.5 ring-4 ring-white group-hover:scale-125 transition-transform"></div>
                          <div className="text-[10px] font-bold text-primary mb-0.5 tracking-wider uppercase">Day {m.dayOffset}</div>
                          <div className="text-[13px] font-bold text-on-surface">{m.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto p-10 bg-white/60 border-t border-black/[0.03]">
            <button 
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-black text-xl py-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-on-background transition-all group shadow-[0_20px_50px_-12px_rgba(0,81,67,0.4)] relative overflow-hidden active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10">{isSubmitting ? "Initializing..." : "Initialize Project"}</span>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform relative z-10">arrow_forward</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-[1px] flex-grow bg-black/[0.06]"></div>
              <span className="text-[11px] text-on-surface font-black uppercase tracking-[0.3em] opacity-60">Ready for Ops</span>
              <div className="h-[1px] flex-grow bg-black/[0.06]"></div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="px-8 py-7 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4 hidden lg:flex">
          <span className="material-symbols-outlined text-primary/30 text-4xl">format_quote</span>
          <div>
            <p className="italic text-sm text-on-surface-variant font-semibold leading-relaxed">
              "Great things are done by a series of small things brought together."
            </p>
            <span className="block mt-2 not-italic font-black text-[10px] uppercase tracking-widest text-primary">— Vincent van Gogh</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
