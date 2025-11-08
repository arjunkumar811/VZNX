# VZNX Project Manager

A modern, clean, and minimal project management application built with React, TypeScript, Vite, Tailwind CSS, and Zustand.

## Features

### Core Features
- **Project Dashboard** - View, create, edit, and delete projects
- **Project Detail View** - Manage tasks within projects
- **Team Overview** - Monitor team member capacity and workload
- **Progress Tracking** - Auto-calculated progress bars based on task completion
- **Task Management** - Create, assign, complete, and delete tasks
- **Status Management** - Track project status (Not Started, In Progress, Completed)

### Bonus Features
- **Search & Filter** - Search projects, filter by status and assignee
- **Sorting** - Sort projects by name or progress, team members by name or capacity
- **Capacity Alerts** - Visual warnings for overloaded team members (>80% capacity)
- **Smart Status Updates** - Auto-update project status based on task completion
- **LocalStorage Persistence** - All data persists across sessions
- **Responsive Design** - Works beautifully on all screen sizes
- **Smooth Animations** - Fade-in and slide-up animations for better UX
- **Delete Confirmations** - Prevent accidental data loss

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management with localStorage persistence
- **React Router** - Client-side routing
- **Nanoid** - ID generation

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.tsx   # Top navigation bar
│   ├── ProjectCard.tsx  # Project display card
│   ├── ProgressBar.tsx  # Progress visualization
│   ├── TaskItem.tsx     # Individual task component
│   ├── MemberCard.tsx   # Team member card
│   └── Modal.tsx        # Reusable modal
├── pages/              # Page components
│   ├── Dashboard.tsx    # Projects list page
│   ├── ProjectDetail.tsx # Project tasks page
│   └── TeamOverview.tsx  # Team capacity page
├── store.ts            # Zustand store with all state logic
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app with routing
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Data Models

```typescript
type Project = {
  id: string;
  name: string;
  status: "Not Started" | "In Progress" | "Completed";
};

type Task = {
  id: string;
  name: string;
  complete: boolean;
  assigneeId?: string;
  projectId: string;
};

type Member = {
  id: string;
  name: string;
};
```

## Key Features Explained

### Progress Calculation
Progress is automatically calculated as: `(completedTasks / totalTasks) * 100`

### Team Capacity
- Each team member can handle up to 5 tasks (100% capacity)
- Green: ≤40% capacity
- Orange: 41-80% capacity  
- Red: >80% capacity

### Status Auto-Update
- Project starts as "Not Started"
- Changes to "In Progress" when first task is added
- Updates to "Completed" when all tasks are complete
- Reverts to "In Progress" if a completed task is unchecked

## Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Vercel will auto-detect Vite and deploy

No environment variables needed!

## License

MIT

---

Built for the VZNX Developer Technical Challenge
