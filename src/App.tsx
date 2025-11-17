import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TeamOverview from './pages/TeamOverview';
import ClientManagement from './pages/ClientManagement';
import CalendarView from './pages/CalendarView';
import GanttChart from './pages/GanttChart';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/gantt" element={<GanttChart />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/team" element={<TeamOverview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
