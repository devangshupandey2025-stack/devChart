# Architectural Decisions Log

This document records the design decisions and technical choices made during the development of **DevChart**. It explains *Why* specific technologies and patterns were selected, and why certain omissions were made, showcasing product judgment and engineering tradeoffs.

---

## Technical Decision Matrix

| Context | Choice | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| **Authentication** | **No Auth (Open Access)** | Maximize user-visible features within 48h limit; simplify evaluator walkthrough. | NextAuth.js, Clerk Auth |
| **Database** | **MongoDB & Mongoose** | Native JSON storage, schema flexibility for project blueprints, and fast aggregations. | PostgreSQL, SQLite |
| **State Calculations** | **Dynamic On-The-Fly Aggregations** | Guaranteed data consistency, zero synchronization overhead, low complexity for small databases. | Pre-calculated `MemberStats` collection |
| **Membership** | **Static Team List** | Keep focus on collaboration logic rather than user CRUD and profile screens. | Dynamic `Members` database table |
| **Planning Engine** | **FullCalendar v6** | Industry standard, robust React wrappers, handles complex events/deadline grids. | Custom CSS Grid calendar |
| **Drag & Drop** | **`@dnd-kit`** | Accessible, custom collision algorithms, robust wrapper for React 19 list sorting. | React-Draggable, HTML5 Drag & Drop |
| **Sync Model** | **Request Polling** | Standard HTTP lifecycle, simple local setup, avoids persistent socket connections. | WebSockets (Socket.io) |

---

## Detailed Rationale

### 1. Why No Authentication?
* **Decision**: We left the application open access with no signup or sign-in walls.
* **Rationale**: For a hiring manager reviewing a coding submission, every additional step (registering a test account, setting up OAuth, verifying emails) introduces friction and increases the chance of configuration issues. Skipping authentication saved roughly 6-8 hours of work, which was instead invested directly into polish (Kanban UI, Calendar planning, and Automation rule sets).
* **Tradeoff Mitigation**: Simulated user identity in form interactions (like the Task Progress Journal dropdown) to demonstrate how collaboration data is stored and logged under individual authors.

---

### 2. Why MongoDB and Mongoose?
* **Decision**: Selected MongoDB as the primary data store, using Mongoose as the object modeling layer.
* **Rationale**:
  * **Nested blueprints**: Project blueprints are rich document structures containing tasks and milestones. Storing these templates and provisioning them is simplified with a document-oriented database.
  * **Dynamic Schemas**: Since student clubs modify task attributes frequently (priorities, logs, dates), a schema-less backend allows rapid feature additions without complex SQL migrations.
  * **Fast local setup**: A simple connection string connects the Next.js API endpoints to a managed cloud database (Atlas) instantly.

---

### 3. Why Dynamic XP & Health Calculations?
* **Decision**: Calculated all leaderboards, contributor XP scores, and project health metrics dynamically on request instead of storing pre-calculated values in the database.
* **Rationale**:
  * In a relational cache model, updating a task requires multiple operations to synchronize cache tables. If any write fails, the leaderboard and project health scores become out-of-sync.
  * Student clubs manage relatively small datasets (hundreds of tasks, not millions). Therefore, database queries are extremely fast, making dynamic calculations more reliable and bugs less likely.
* **Calculation Details**:
  * **XP**: Derived by scanning all `DONE` tasks, applying priority weights, and subtracting penalties for tasks completed past their due date.
  * **Project Health**: Computed via a weighted average of completed task count ($50\%$), task progress ($20\%$), and on-time task rates ($30\%$).

---

### 4. Why Hardcoded Team Members?
* **Decision**: Hardcoded the team list (`Devangshu`, `Alex`, `Taylor`, `Jordan`) rather than building user profiles.
* **Rationale**: Managing invitations, team permissions, active/inactive states, and registration flows would require substantial UI and backend overhead. Hardcoding these profiles allowed us to immediately build rich multi-user dynamics (like the leaderboards and activity feed) while keeping the code clean and focused.

---

### 5. Why FullCalendar?
* **Decision**: Chose the official `FullCalendar` package for the temporal planning view.
* **Rationale**:
  * Implementing a responsive, interactive month-view calendar with clean layouts, multi-day spans, and event rendering from scratch takes days of developer time.
  * `FullCalendar` provides a solid, accessible grid that easily handles our custom normalized events list (mapping both meetings and task deadlines with overdue flags).

---

### 6. Why `@dnd-kit`?
* **Decision**: Chose `@dnd-kit/core` and `@dnd-kit/sortable` for the Kanban columns and cards.
* **Rationale**:
  * Older libraries like `react-beautiful-dnd` are deprecated and have compatibility issues with React 18 and 19.
  * `@dnd-kit` is lightweight, modular, and has native support for sensory input (touch, keyboard, mouse), making it the perfect engine to build a smooth, modern drag-and-drop experience.

---

### 7. Why No WebSockets?
* **Decision**: Chose request polling and page-driven refreshes instead of setting up real-time WebSocket sync.
* **Rationale**:
  * Implementing WebSockets (e.g. Socket.io) requires persistent server infrastructure, which is not supported by serverless hosting providers like Vercel out-of-the-box.
  * Using standard Next.js page refreshes and dynamic routing ensures the application remains fully compatible with serverless deployments, keeping local setup simple and hosting costs at zero.
