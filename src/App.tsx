import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TeamOverview from './pages/TeamOverview';
import ClientManagement from './pages/ClientManagement';
import CalendarView from './pages/CalendarView';
import GanttChart from './pages/GanttChart';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/gantt" element={<GanttChart />} />
          <Route path="/team" element={<TeamOverview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
