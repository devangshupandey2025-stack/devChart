# Recruiter Demo Guide: 5-Minute Showcase

This guide walks you through a step-by-step tour of the **DevChart** interface. It is designed to help recruiters, technical reviewers, and developers quickly experience the platform's core capabilities.

* **Total Demo Duration**: ~5 Minutes
* **Prerequisite**: Ensure the local Next.js development server is running and you are navigated to the homepage (`http://localhost:3000`).

---

## Minute-by-Minute Product Tour

### ⏱️ Minute 1: Bootstrapping a Project Blueprint
1. On the homepage, click the **Go to Dashboard** button, then click **View Projects** in the header navigation (or go directly to `http://localhost:3000/projects`).
2. Click the teal **+ New Project** button in the top right.
3. In **Project Nomenclature**, enter the name: `Spring Hackathon 2026`.
4. In **Strategic Objectives**, enter: `End-to-end planning and execution of our annual spring coding event.`
5. Under **Architectural Blueprint**, click on the **Hackathon Blueprint** card. Take note of the blueprint's metadata (suggested duration, tasks lists, and milestone grid) dynamically loading on the right preview.
6. Click **Create Project**. The blueprint engine immediately provisions the tasks and events in MongoDB and redirects you to the project operations board.

---

### ⏱️ Minute 2: Operations Health & Event Readiness
1. On the project detail page, look at the upper-right card. Review these active indicators:
   * **Status**: 🟢 Healthy (re-calculated dynamically using due dates and completions).
   * **Event Readiness**: The progress bar (showing `0% ready` initially) represents the average completion percentage across all tasks.
   * **Next Event**: The calendar scheduler has automatically calculated that the nearest milestone is `Theme Finalized`.
2. This screen represents how project leads monitor operations at a glance.

---

### ⏱️ Minute 3: Task Execution & The Progress Journal
1. Scroll down to the **Kanban Board**.
2. Locate the card `Finalize Theme` in the **To Do** list.
3. Drag the card using your mouse and drop it into the **In Progress** column. Note the smooth transition powered by `@dnd-kit/sortable`.
4. Click on the card edit icon (or click the card title) to slide open the **Task Details Drawer**.
5. Switch to the **Progress Journal** tab in the drawer.
6. Select `Devangshu` from the **New Update** author dropdown.
7. Type a detailed log entry: `Drafted theme ideas and aligned with sponsors.`
8. Move the **Progress Slider** to **50%**, then click **Post**.
9. The timeline update saves instantly, incrementing the task update counter and recording a preview of the comment.

---

### ⏱️ Minute 4: Automated Status & Milestone Triggers
1. Without closing the drawer, move the progress slider to **100%** and write a final log: `Theme finalized and approved by lead.`
2. Click **Post**.
3. Note that the task automatically moves from **In Progress** to **Done** on the Kanban board behind the drawer because progress hit 100%.
4. Close the drawer and look at the **Project Timeline** on the right. Notice that the activity stream has automatically logged:
   * `Devangshu completed task Finalize Theme`
   * `Devangshu reached 100% progress` (triggering an automated milestone event).

---

### ⏱️ Minute 5: Checking Leaderboards & Operational Alerting
1. Click **Calendar** in the navigation bar. Observe how task deadlines and blueprint milestones populate the calendar grid, with overdue tasks marked in **Red**.
2. Click **Dashboard** in the navigation bar:
   * **Gamification Check**: Scroll to the **Top Contributors** leaderboard. Review how the XP engine has awarded points (base points based on task priority, with overdue penalties applied if completed late) and placed the top member in the **Hall of Fame**.
   * **Operational Alerting**: Look at the **Automation Center** block. It lists stale tasks (tasks in `IN_PROGRESS` with no updates for >7 days), near-term deadline risks, and recently completed milestones.

---

## What Makes DevChart Different

Most student project managers stop at simple CRUD operations, resulting in basic task boards. **DevChart** transforms task tracking into a unified **Club Operating System** by integrating planning, execution, and recognition into a single workflow:

```
┌────────────────────────────────────────────────────────┐
│                   Club Operating System                │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  Planning Engine   Execution Engine   Insight Engine
  (FullCalendar &   (Kanban Boards &  (Automation Alerts,
    Blueprints)     Progress Journal)  Health Score & XP)
```

### Key Differences:
* **Task Manager vs. Project Blueprinting**: Instead of creating dozens of tasks manually, leads can bootstrap pre-configured workflows in one click.
* **Kanban Board vs. Progress Journaling**: Instead of moving cards without context, team members maintain a historical audit trail of written progress logs.
* **Task Lists vs. Operational Analytics**: DevChart analyzes dates and logs on-the-fly to output weighted Project Health, Event Readiness, and Contributor XP standings.
* **Manual Inspection vs. Automation Alerting**: The Automation Center highlights process issues (stale work, risk deadlines) automatically, keeping the team proactive.
