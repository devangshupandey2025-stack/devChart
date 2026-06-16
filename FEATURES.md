# Capabilities & Feature Inventory

This document reviews the operational capabilities of **DevChart**, explaining the technical details and recruiter demonstration value of each module.

---

## Recruiter Demonstration Value Matrix

This quick-reference matrix explains how each feature demonstrates core engineering competencies, software design patterns, and product thinking.

| Feature Area | Recruiter Demonstration Value | Key Technical Competencies Shown |
| :--- | :--- | :--- |
| **Kanban Board** | **State Management & UX Fluidity** | Context boundary division, optimistic UI updates, drag-and-drop integration (`dnd-kit`), component hierarchy separation. |
| **FullCalendar Planning** | **Temporal Coordination** | Merging heterogeneous data streams (Task Deadlines & Milestone Events) into a unified timeline; dynamic dates. |
| **Project Blueprints** | **Product & Lifecycle Design** | Relational data bootstrapping, template instantiation logic (generating dynamic dates via relative offsets). |
| **Automation Center** | **Operational Intelligence & Alerting** | Real-time threshold scanning (stale task logs, near-term risk models, and completions check). |
| **Progress Journal** | **Collaboration & Auditing** | Dynamic status updates, audit history logs (Activity Feed generation), and progress inputs mapping. |
| **Leaderboard / Fame** | **Dynamic Aggregations & UX** | Mongoose pipeline calculations, XP point scoring, and state-driven ranking views. |

---

## Capabilities Breakdown

### 1. Project Blueprints (Templates System)
Bootstraps projects with pre-configured task sets and milestone frameworks based on standard student club activities.

* **Purpose**: Speeds up setup, reduces administrative overhead, and establishes a standardized workflow.
* **Business / Operational Value**: Eliminates the manual work of creating repetitive tasks for standard project formats (e.g. hackathons). It provides a structured workflow, helping teams align on best practices from day one.
* **Technical Implementation**:
  * Configured as a structured library of template objects in [templates.ts](src/lib/templates.ts).
  * Upon project creation via `POST /api/projects`, the backend reads the selected template's task and milestone profiles.
  * For each task and milestone template, due dates are computed dynamically by applying a relative `dayOffset` to the project's creation date.
  * Mongoose bulk writes (`Task.create` and `Event.create` via `Promise.all`) are executed to insert the tasks and milestones in the database.
* **Blueprints Catalog**:
  1. **Hackathon Blueprint**: Standard 60-day planning cycle featuring 8 core tasks (e.g. venue booking, sponsors outreach) and 4 major milestones (e.g. registration opens, hackathon day).
  2. **Tech Fest Blueprint**: Comprehensive 90-day cycle for large-scale operations with 7 tasks and 5 milestone check-ins (e.g. speaker lists finalized, promotions live).
  3. **Recruitment Blueprint**: Standard 30-day onboarding cycle containing announcements, applications closing, interviews, and final selection.
  4. **Workshop Blueprint**: High-velocity 21-day timeline targeting speaker confirmations, content preparation, and logistics.
  5. **Open Source Sprint Blueprint**: 45-day collaborative sprint tracking project selection, mentor allocation, and final developer showcase.
  6. **Competition Team Blueprint**: 60-day practice cycle managing mock contests and practice schedules.
* **Files Involved**:
  * [templates.ts](src/lib/templates.ts)
  * [TemplateSelector.tsx](src/components/projects/TemplateSelector.tsx)
  * [TemplatePreview.tsx](src/components/projects/TemplatePreview.tsx)
  * [route.ts (api/projects)](src/app/api/projects/route.ts)
* **Future Extensions**:
  * A template creator screen to let club leads save their own custom blueprints.
  * Blueprint exporting/importing as JSON files.

---

### 2. Project Execution
Ensures tasks are moved fluidly from concept to completion with proper scoping, prioritization, and assignment.

* **Purpose**: Provides a dynamic, visual workspace to view, assign, and track the progress of active operations.
* **Business Value**: Centralizes task tracking, reduces task switching, and makes bottleneck columns immediately visible to project leads.
* **Technical Implementation**:
  * Powered by `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` to enable drag-and-drop state updates.
  * Dynamically patches task statuses via `PATCH /api/tasks/[id]` when cards are moved across lists (Optimistic UI state is used to ensure high performance).
  * High, Medium, and Low priorities are colored differently to indicate urgency.
* **Files Involved**:
  * [KanbanBoard.tsx](src/components/kanban/KanbanBoard.tsx)
  * [TaskCard.tsx](src/components/kanban/TaskCard.tsx)
  * [Tasks.ts (Model)](src/models/Tasks.ts)
  * [route.ts (api/tasks/[id])](src/app/api/tasks/[id]/route.ts)
* **Future Extensions**:
  * Sub-task lists (checklists) within individual Kanban cards.
  * Task card tags/labels (e.g., "Frontend", "Logistics", "Sponsorships").

---

### 3. Temporal Planning
Synchronizes planning timelines, project events, and milestone deadlines on a unified interface.

* **Purpose**: Coordinates meeting slots, sprint schedules, and task milestones on a single, easy-to-use calendar grid.
* **Business Value**: Prevents schedule conflicts between separate club events (e.g. hosting a workshop and an internal team review simultaneously) and visualizes the schedule buffer before major project release dates.
* **Technical Implementation**:
  * Employs `@fullcalendar/react`, `@fullcalendar/daygrid`, and `@fullcalendar/interaction` for calendar layouts.
  * Normalizes and merges two backend data models: `Event` documents (MEETING, EVENT, MILESTONE types) and active `Task` due dates (assigned as `DEADLINE` calendar type with overdue color coding if overdue).
  * Features a **Quick Add Event** modal that handles inline scheduling of events or provisioning of tasks directly from the calendar, linking tasks to active MongoDB projects.
* **Files Involved**:
  * [CalendarView.tsx](src/components/calendar/CalendarView.tsx)
  * [route.ts (api/events)](src/app/api/events/route.ts)
  * [Event.ts (Model)](src/models/Event.ts)
* **Future Extensions**:
  * Multi-day calendar schedules with drag-and-drop rescheduling.
  * Direct synchronization with external calendars (Google Calendar / Outlook Calendar).

---

### 4. Club Operations Dashboard
Provides a bird's-eye view of all active club operations, showcasing real-time health scores and upcoming timelines.

* **Purpose**: Aggregates multi-project operational health indicators, readiness levels, and next events on a central management console.
* **Business Value**: Enables club presidents and team leads to instantly spot at-risk initiatives, coordinate resources, and track project execution velocity in real-time.
* **Technical Implementation**:
  * Calculates a weighted **Project Health Score** combining completion rate, task progress, and on-time task percentages.
  * Renders progress indicators depicting project completion and event readiness.
  * Includes a Next Event box, which finds the earliest scheduled milestone or deadline across events and tasks.
* **Files Involved**:
  * [page.tsx (projects)](src/app/projects/page.tsx)
  * [route.ts (api/projects)](src/app/api/projects/route.ts)
  * [Project.ts (Model)](src/models/Project.ts)
* **Future Extensions**:
  * Customizable dashboard charts.
  * Exportable PDF operations reports for monthly club meetings.

---

### 5. Recognition & Gamification
Gamifies club operations by tracking member contributions and ranking them on public leaderboards.

* **Purpose**: Encourages team engagement by awarding experience points (XP) upon completing tasks and highlighting the top developer.
* **Business Value**: Increases project velocity, builds accountability, and rewards top performers within the organization.
* **Technical Implementation**:
  * Calculates developer XP dynamically based on completed tasks: High Priority (20 XP), Medium (10 XP), Low (5 XP), with a -5 XP penalty if the task was completed after its due date.
  * **Hall of Fame**: Identifies the member with the most XP as the Contributor of the Month.
  * **Leaderboard**: Lists all active club members sorted by total XP, showing total tasks completed.
* **Files Involved**:
  * [Leaderboard.tsx](src/components/dashboard/Leaderboard.tsx)
  * [HallOfFame.tsx](src/components/dashboard/HallOfFame.tsx)
  * [route.ts (api/dashboard)](src/app/api/dashboard/route.ts)
* **Future Extensions**:
  * Special developer badges (e.g. "On-Time Champion", "High Priority Solver").
  * XP levels (e.g. Member, Lead, Architect) with dynamic rank up notifications.

---

### 6. Workflow Automation & Journaling
Provides real-time warning indicators, task progress updates, and automatic milestone audit logs.

* **Purpose**: Tracks operational risks (stale tasks, overdue deadlines) and logs progress updates within an audit feed.
* **Business Value**: Prevents tasks from stagnating, identifies resource bottlenecks before they delay projects, and creates a clear audit trail of past work.
* **Technical Implementation**:
  * **Automation Center**: Scans MongoDB collections dynamically to flag:
    * *Stale Tasks*: Unfinished tasks in `IN_PROGRESS` with no updates for >7 days.
    * *Deadlines At Risk*: Unfinished tasks due within 48 hours (progress < 70%).
    * *Achievements*: Milestone events reached within the last 7 days.
  * **Progress Journal**: Allows members to log written updates alongside a progress slider (0% to 100%), dynamically adjusting task states (e.g., hitting 100% moves the task to `DONE`).
  * **Automatic Activity Logs**: Instantly creates `Activity` records on task creation, status changes, assignments, and progress checkpoints (25%, 50%, 75%, 100%).
* **Visual Interface**:
  ![Progress Journal Timeline](public/progress_journal.png)
* **Files Involved**:
  * [AutomationCenter.tsx](src/components/dashboard/AutomationCenter.tsx)
  * [TaskProgressJournal.tsx](src/components/tasks/TaskProgressJournal.tsx)
  * [ActivityFeed.tsx](src/components/dashboard/ActivityFeed.tsx)
  * [route.ts (api/tasks/[id]/updates)](src/app/api/tasks/[id]/updates/route.ts)
  * [Activity.ts (Model)](src/models/Activity.ts)
  * [TaskUpdate.ts (Model)](src/models/TaskUpdate.ts)
* **Future Extensions**:
  * Automatic Slack or Discord notifications when a task is flagged as stale or at-risk.
  * AI-generated summaries of task updates inside the progress journal.
