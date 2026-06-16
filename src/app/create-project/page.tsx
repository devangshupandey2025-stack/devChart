"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import TemplateSelector from "@/components/projects/TemplateSelector";
import TemplatePreview from "@/components/projects/TemplatePreview";
import { PROJECT_TEMPLATES } from "@/lib/templates";

const CreateProject = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("custom");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate = PROJECT_TEMPLATES.find(t => t.id === selectedTemplateId) || null;

  async function handleSubmit(event: React.FormEvent | React.MouseEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, templateId: selectedTemplateId }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const project = await response.json();
      router.push(`/projects/${project._id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grain-bg font-body-md text-on-surface min-h-screen flex flex-col selection:bg-primary/20">
      {/* Upgraded Navigation */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-black/[0.04] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin h-20 max-w-max_width mx-auto">
          <div className="flex items-center gap-xl">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-[-8deg]">
                <span className="material-symbols-outlined text-xl">stacked_bar_chart</span>
              </div>
              <span className="serif-heading text-2xl text-on-surface tracking-tight group-hover:text-primary transition-colors">devChart</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="#">Analytics</a>
              <a className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="#">Operations</a>
              <a className="text-on-surface-variant/80 font-label-md hover:text-primary transition-all tracking-wide uppercase relative" href="#">Planning</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <a className="text-primary font-bold font-label-md px-5 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/10 active-nav-pill" href="#">New Project</a>
            <div className="h-6 w-[1px] bg-black/[0.08]"></div>
            <button className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-1 ring-black/5 group-hover:scale-105 transition-transform">
                <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANRG8lkaKGWjep1FLLzFg5nK_aAl6dBM_C9LxK9uXHXTIKIlQ-o9tpKyzf-PYefK-0JqJLPd-hk-6iXpDRFzwo_VLDEt5duKxenVzA-0sqjFbSQP0op6O1210eTQZnV9xGg90VgYg3xoAmEfnYqwGYkmwAMLhAsSOWy559SkeCP01AyABLH0tOuGMBERiA6v10RRQF8_EmE3Aj-3at77jhQMPkiI24ivJgjSW2Mh1o7xYHKJ5DPvKShKnhU5OLkTtly6mUdaBlwg"/>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/60 group-hover:text-on-surface transition-colors">expand_more</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-max_width mx-auto w-full px-margin py-xl">
        <div className="mb-xl max-w-3xl">
          <h1 className="serif-heading text-display-lg text-on-surface mb-md leading-tight">Initiate your next <span className="text-primary italic">milestone.</span></h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-2xl">Translate complex operations into actionable roadmaps. Choose a blueprint tailored for your industry or engineer a custom workspace from the ground up.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-xl">
          {/* Left: Form Controls */}
          <div className="flex-grow lg:max-w-[58%] space-y-xl">
            {/* Step 1: Basics */}
            <section className="relative">
              <div className="absolute -left-12 top-2 hidden xl:flex flex-col items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">01</span>
                <div className="w-[1px] h-24 bg-gradient-to-b from-primary/30 to-transparent"></div>
              </div>
              
              <div className="space-y-lg">
                <div className="border-b border-black/[0.08] pb-4">
                  <h2 className="serif-heading text-2xl text-on-surface">Foundational Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="block font-label-sm text-on-surface-variant uppercase" htmlFor="project-name">Project Nomenclature</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-black/[0.12] py-3 focus:ring-0 focus:border-primary transition-all outline-none text-lg font-bold placeholder:text-on-surface-variant/30 text-on-surface" 
                      id="project-name" 
                      placeholder="e.g. Q4 Infrastructure Audit" 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="block font-label-sm text-on-surface-variant uppercase" htmlFor="priority">Engagement Level</label>
                    <select className="w-full bg-transparent border-0 border-b border-black/[0.12] py-3 focus:ring-0 focus:border-primary transition-all outline-none text-lg font-bold text-on-surface appearance-none cursor-pointer">
                      <option>Internal Initiative</option>
                      <option>Client-Facing Project</option>
                      <option>Critical Infrastructure</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-xs">
                  <label className="block font-label-sm text-on-surface-variant uppercase" htmlFor="description">Strategic Objectives</label>
                  <textarea 
                    className="w-full bg-white/40 p-md rounded-2xl border border-black/[0.08] focus:border-primary focus:ring-1 focus:ring-primary/5 transition-all outline-none text-on-surface font-medium resize-none shadow-sm placeholder:text-on-surface-variant/40" 
                    id="description" 
                    placeholder="Briefly outline the primary goals and expected deliverables..." 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Step 2: Blueprint Tiles */}
            <section className="relative">
              <div className="absolute -left-12 top-2 hidden xl:flex flex-col items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">02</span>
              </div>
              
              <div className="space-y-lg">
                <div className="border-b border-black/[0.08] pb-4 flex justify-between items-end">
                  <h2 className="serif-heading text-2xl text-on-surface">Architectural Blueprint</h2>
                  <button className="text-primary text-[11px] font-bold uppercase tracking-widest hover:opacity-70 flex items-center gap-1 transition-opacity">
                    Browse Library <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>
                
                <TemplateSelector selectedTemplateId={selectedTemplateId} onSelect={setSelectedTemplateId} />
              </div>
            </section>
          </div>

          <TemplatePreview template={selectedTemplate} projectName={name} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>

      {/* Refined Footer */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-black/[0.04] py-8 mt-xl">
        <div className="max-w-max_width mx-auto px-margin flex flex-col md:flex-row justify-between items-center text-[11px] text-on-surface-variant font-black uppercase tracking-widest">
          <div className="flex items-center gap-8 mb-6 md:mb-0">
            <span className="serif-heading text-2xl text-on-surface lowercase tracking-tighter normal-case">devChart</span>
            <div className="h-4 w-[1px] bg-black/[0.1]"></div>
            <span className="opacity-80">© 2024 Systems Inc.</span>
          </div>
          <nav className="flex gap-10">
            <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-8 decoration-primary/30">Ethics</a>
            <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-8 decoration-primary/30">Terms</a>
            <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-8 decoration-primary/30">Studio</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default CreateProject;
