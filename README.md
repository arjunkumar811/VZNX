# VZNX Project Manager

A modern, comprehensive project management application built for architects and engineers, inspired by Monograph.com. Built with React, TypeScript, Vite, Tailwind CSS, Zustand, and Recharts.

## 🚀 Features

### Core Project Management
- **Project Dashboard** - Create, view, edit, and delete projects with advanced filtering and sorting
- **Project Detail View** - Manage tasks, track time, and monitor budgets within projects
- **Task Management** - Create, assign, prioritize, and track tasks with due dates
- **Status Tracking** - Monitor project status (Not Started, In Progress, Completed)
- **Progress Visualization** - Auto-calculated progress bars based on task completion

### Client & Team Management
- **Client Management** - Comprehensive client database with contact info, projects, and revenue tracking
- **Team Overview** - Monitor team member capacity, workload, and performance
- **Time Tracking** - Log billable and non-billable hours with cost calculations
- **Budget Tracking** - Track project budgets, costs, and utilization in real-time

### Advanced Features
- **Calendar View** - Visualize tasks and project timelines by month or week
- **Gantt Chart** - Project timeline visualization with zoom controls (week/month/quarter)
- **Reports & Export** - Generate and export project, time tracking, budget, and client reports to CSV
- **Analytics Dashboard** - Revenue trends, budget distribution, team workload, and client profitability

### Data Visualization
- **Revenue Trends Chart** - 6-month revenue, cost, and profit visualization
- **Budget Distribution Chart** - Budget vs actual spending by project
- **Project Status Chart** - Donut chart showing project status breakdown
- **Team Workload Chart** - Billable vs non-billable hours by team member

### UX & Polish
- **Toast Notifications** - Real-time feedback for all CRUD operations
- **Smooth Animations** - Fade-in, slide-up, and scale animations throughout
- **Error Boundaries** - Graceful error handling with user-friendly messages
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Accessibility** - ARIA labels, keyboard navigation, and semantic HTML
- **LocalStorage Persistence** - All data persists across sessions

## 🛠️ Tech Stack

- **React 18.3.1** - UI library with hooks
- **TypeScript 5.6.2** - Type safety and better DX
- **Vite 5.4.21** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Zustand 5.0.2** - Lightweight state management with localStorage persistence
- **React Router 7.0.2** - Client-side routing
- **Recharts 2.15.0** - Composable charting library
- **React Hot Toast 2.4.1** - Toast notifications
- **Nanoid 5.0.9** - Secure ID generation

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm

### Install Dependencies

```bash
npm install
```

## 🚀 Development

### Start Dev Server

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

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BudgetDistributionChart.tsx
│   ├── BudgetSummary.tsx
│   ├── ClientCard.tsx
│   ├── ClientRevenue.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── Navigation.tsx
│   ├── PriorityBadge.tsx
│   ├── ProgressBar.tsx
│   ├── ProjectAnalytics.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectStatusChart.tsx
│   ├── RevenueChart.tsx
│   ├── StatsOverview.tsx
│   ├── TaskItem.tsx
│   ├── TeamPerformance.tsx
│   ├── TeamWorkloadChart.tsx
│   └── TimeTracker.tsx
├── pages/               # Main application pages
│   ├── CalendarView.tsx
│   ├── ClientManagement.tsx
│   ├── Dashboard.tsx
│   ├── GanttChart.tsx
│   ├── ProjectDetail.tsx
│   ├── Reports.tsx
│   └── TeamOverview.tsx
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
├── store.ts            # Zustand store with all state management
├── types.ts            # TypeScript type definitions
└── index.css           # Global styles and animations
```

## 🎯 Key Features Explained

### Time Tracking
- Log hours per task with billable/non-billable flags
- Automatic cost calculation using member hourly rates
- Budget tracking and utilization alerts

### Budget Management
- Set project budgets and track actual costs
- Real-time budget utilization indicators
- At-risk project alerts (>80% budget used)

### Client Revenue Tracking
- Track revenue per client across all projects
- Calculate profit margins and ROI
- Export client revenue reports to CSV

### Reports & Analytics
- 4 report types: Project Summary, Time Tracking, Budget Analysis, Client Revenue
- Date range filtering (week, month, quarter, year, custom)
- CSV export for all reports
- Print-friendly formatting

### Visualizations
- Interactive charts with hover tooltips
- Responsive design adapting to screen size
- Color-coded data for easy interpretation
- Empty states with helpful messages

## 🔧 Configuration

### Tailwind CSS
Custom animations and utilities are defined in `index.css`:
- `animate-fadeIn` - Fade in animation
- `animate-slideUp` - Slide up animation
- `animate-scaleIn` - Scale in animation

### Zustand Store
State is persisted to localStorage automatically. Clear browser storage to reset all data.

## 📊 Performance

- **Bundle Size**: 678.56 kB (190.67 kB gzipped)
- **CSS Size**: 35.92 kB (6.29 kB gzipped)
- **Build Time**: ~8 seconds
- **First Load**: Optimized with code splitting and lazy loading

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚢 Deployment

### Build Output
Production build creates optimized files in `dist/`:
- `index.html` - Entry HTML file
- `assets/index-[hash].js` - JavaScript bundle
- `assets/index-[hash].css` - CSS bundle

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Deploy to GitHub Pages
```bash
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## 📝 License

MIT

## 👨‍💻 Author

Built as part of the VZNX Technical Challenge - Full MVP Implementation

## 🙏 Acknowledgments

- Inspired by Monograph.com's elegant project management for architects
- Design system influenced by modern SaaS applications
- Chart visualizations powered by Recharts

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
