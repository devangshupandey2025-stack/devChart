export interface MilestoneTemplate {
  title: string;
  dayOffset: number;
}

export interface TaskTemplate {
  title: string;
  dayOffset: number;
  priority?: "Low" | "Medium" | "High";
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  expectedOutcome: string;
  category: "EVENT" | "HR" | "PROJECT" | "TEAM";
  suggestedDuration: number; // in days
  tasks: TaskTemplate[];
  milestones: MilestoneTemplate[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "hackathon",
    name: "Hackathon",
    description: "End-to-end hackathon planning workflow",
    expectedOutcome: "A fully planned and execution-ready hackathon.",
    category: "EVENT",
    suggestedDuration: 60,
    tasks: [
      { title: "Finalize Theme", dayOffset: 5, priority: "High" },
      { title: "Sponsor Outreach", dayOffset: 14, priority: "High" },
      { title: "Venue Booking", dayOffset: 20, priority: "High" },
      { title: "Problem Statements", dayOffset: 28, priority: "Medium" },
      { title: "Marketing Campaign", dayOffset: 35, priority: "Medium" },
      { title: "Judge Recruitment", dayOffset: 42, priority: "Medium" },
      { title: "Registration Setup", dayOffset: 49, priority: "High" },
      { title: "Final Execution", dayOffset: 60, priority: "High" }
    ],
    milestones: [
      { title: "Theme Finalized", dayOffset: 7 },
      { title: "Sponsors Confirmed", dayOffset: 21 },
      { title: "Registration Opens", dayOffset: 35 },
      { title: "Hackathon Day", dayOffset: 60 }
    ]
  },
  {
    id: "techfest",
    name: "Tech Fest",
    description: "Large scale event management and execution",
    expectedOutcome: "A successfully managed college tech festival with multiple events and speakers.",
    category: "EVENT",
    suggestedDuration: 90,
    tasks: [
      { title: "Venue Planning", dayOffset: 10, priority: "High" },
      { title: "Sponsor Outreach", dayOffset: 25, priority: "High" },
      { title: "Speaker Coordination", dayOffset: 40, priority: "Medium" },
      { title: "Volunteer Recruitment", dayOffset: 50, priority: "Medium" },
      { title: "Marketing Campaign", dayOffset: 60, priority: "High" },
      { title: "Registration Management", dayOffset: 75, priority: "Medium" },
      { title: "Execution", dayOffset: 90, priority: "High" }
    ],
    milestones: [
      { title: "Venues Booked", dayOffset: 15 },
      { title: "Sponsors Locked", dayOffset: 35 },
      { title: "Speaker List Finalized", dayOffset: 50 },
      { title: "Promotions Live", dayOffset: 65 },
      { title: "Fest Day 1", dayOffset: 90 }
    ]
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "Standard recruitment cycle and onboarding",
    expectedOutcome: "A complete recruitment cycle from applications to onboarding.",
    category: "HR",
    suggestedDuration: 30,
    tasks: [
      { title: "Announcement", dayOffset: 2, priority: "High" },
      { title: "Application Collection", dayOffset: 10, priority: "Medium" },
      { title: "Shortlisting", dayOffset: 15, priority: "High" },
      { title: "Interview Round", dayOffset: 20, priority: "High" },
      { title: "Selection", dayOffset: 25, priority: "High" },
      { title: "Onboarding", dayOffset: 30, priority: "Medium" }
    ],
    milestones: [
      { title: "Applications Open", dayOffset: 0 },
      { title: "Applications Close", dayOffset: 14 },
      { title: "Interviews Complete", dayOffset: 25 },
      { title: "Final Selection", dayOffset: 30 }
    ]
  },
  {
    id: "workshop",
    name: "Workshop",
    description: "Speaker, venue, and content preparation",
    expectedOutcome: "A well-attended workshop with finalized content and logistics.",
    category: "EVENT",
    suggestedDuration: 21,
    tasks: [
      { title: "Speaker Confirmation", dayOffset: 3, priority: "High" },
      { title: "Venue Setup", dayOffset: 7, priority: "Medium" },
      { title: "Promotion", dayOffset: 10, priority: "Medium" },
      { title: "Registration", dayOffset: 14, priority: "Medium" },
      { title: "Content Preparation", dayOffset: 18, priority: "High" },
      { title: "Execution", dayOffset: 21, priority: "High" }
    ],
    milestones: [
      { title: "Speaker Confirmed", dayOffset: 5 },
      { title: "Content Finalized", dayOffset: 15 },
      { title: "Workshop Date", dayOffset: 21 }
    ]
  },
  {
    id: "opensource",
    name: "Open Source Sprint",
    description: "Manage mentor allocation and contributions",
    expectedOutcome: "A collaborative sprint resulting in merged contributions and mentor reviews.",
    category: "PROJECT",
    suggestedDuration: 45,
    tasks: [
      { title: "Project Selection", dayOffset: 3, priority: "High" },
      { title: "Mentor Allocation", dayOffset: 10, priority: "Medium" },
      { title: "Contribution Guidelines", dayOffset: 15, priority: "Medium" },
      { title: "Kickoff Session", dayOffset: 20, priority: "Medium" },
      { title: "Weekly Review", dayOffset: 30, priority: "Medium" },
      { title: "Final Showcase", dayOffset: 45, priority: "High" }
    ],
    milestones: [
      { title: "Kickoff Session", dayOffset: 5 },
      { title: "Mid-point Review", dayOffset: 25 },
      { title: "Final Showcase", dayOffset: 45 }
    ]
  },
  {
    id: "competition",
    name: "Competition Team",
    description: "Mock contests and practice schedules",
    expectedOutcome: "A prepared team ready to participate and excel in the final competition.",
    category: "TEAM",
    suggestedDuration: 60,
    tasks: [
      { title: "Problem Selection", dayOffset: 7, priority: "Medium" },
      { title: "Practice Schedule", dayOffset: 14, priority: "Medium" },
      { title: "Mock Contests", dayOffset: 28, priority: "High" },
      { title: "Review Session", dayOffset: 42, priority: "Medium" },
      { title: "Final Participation", dayOffset: 60, priority: "High" }
    ],
    milestones: [
      { title: "Team Formed", dayOffset: 5 },
      { title: "First Mock Contest", dayOffset: 20 },
      { title: "Final Participation", dayOffset: 60 }
    ]
  }
];
