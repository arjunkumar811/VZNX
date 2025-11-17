import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function GanttChart() {
  const projects = useStore((state) => state.projects);
  const getProjectTasks = useStore((state) => state.getProjectTasks);
  
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getProjectDateRange = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return null;

    let startDate = new Date(project.createdAt);
    let endDate = project.dueDate ? new Date(project.dueDate) : new Date();

    projectTasks.forEach(task => {
      if (task.dueDate) {
        const taskDue = new Date(task.dueDate);
        if (taskDue > endDate) endDate = taskDue;
      }
    });

    return { startDate, endDate };
  };

  const getTimelineRange = () => {
    const now = new Date(currentDate);
    let start = new Date(now);
    let end = new Date(now);
    
    if (viewMode === 'week') {
      start.setDate(now.getDate() - now.getDay());
      end.setDate(start.getDate() + 13);
    } else if (viewMode === 'month') {
      start.setDate(1);
      end.setMonth(start.getMonth() + 2);
      end.setDate(0);
    } else {
      start.setDate(1);
      start.setMonth(Math.floor(now.getMonth() / 3) * 3);
      end.setMonth(start.getMonth() + 3);
      end.setDate(0);
    }
    
    return { start, end };
  };

  const calculateBarPosition = (startDate: Date, endDate: Date) => {
    const timeline = getTimelineRange();
    const totalDays = Math.ceil((timeline.end.getTime() - timeline.start.getTime()) / (1000 * 60 * 60 * 24));
    
    const startOffset = Math.max(0, Math.ceil((startDate.getTime() - timeline.start.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getTimelineHeaders = () => {
    const timeline = getTimelineRange();
    const headers: Date[] = [];
    const current = new Date(timeline.start);
    
    if (viewMode === 'week') {
      while (current <= timeline.end) {
        headers.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    } else if (viewMode === 'month') {
      while (current <= timeline.end) {
        headers.push(new Date(current));
        current.setDate(current.getDate() + 7);
      }
    } else {
      while (current <= timeline.end) {
        headers.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    return headers;
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 14);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 2);
    } else {
      newDate.setMonth(newDate.getMonth() - 3);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 14);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 2);
    } else {
      newDate.setMonth(newDate.getMonth() + 3);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const headers = getTimelineHeaders();
  const projectsWithDates = projects
    .map(p => ({ ...p, dateRange: getProjectDateRange(p.id) }))
    .filter(p => p.dateRange);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gantt Chart</h1>
            <p className="text-sm text-gray-600 mt-1">Project timeline visualization</p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('quarter')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'quarter'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quarter
              </button>
            </div>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Today
            </button>

            <div className="flex gap-2">
              <button
                onClick={previousPeriod}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextPeriod}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {projectsWithDates.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Create projects with due dates to see the timeline</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[250px_1fr] gap-0 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-r border-gray-200">
                  <div className="h-12 px-4 py-3 border-b border-gray-200 font-semibold text-sm text-gray-700">
                    Projects
                  </div>
                  {projectsWithDates.map(project => (
                    <div
                      key={project.id}
                      className="h-16 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <Link to={`/project/${project.id}`} className="block">
                        <div className="font-medium text-sm text-gray-900 truncate">{project.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getProjectTasks(project.id).length} tasks • {project.progress}%
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="bg-white">
                  <div className="h-12 border-b border-gray-200 flex">
                    {headers.map((date, index) => (
                      <div
                        key={index}
                        className="flex-1 px-2 py-3 border-r border-gray-200 last:border-r-0 text-center"
                      >
                        <div className="text-xs font-semibold text-gray-700">
                          {viewMode === 'week' && date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {viewMode === 'month' && date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {viewMode === 'quarter' && date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {projectsWithDates.map(project => {
                    const position = calculateBarPosition(project.dateRange!.startDate, project.dateRange!.endDate);
                    const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'Completed';
                    
                    return (
                      <div
                        key={project.id}
                        className="h-16 border-b border-gray-200 relative"
                      >
                        <div className="absolute inset-0 flex">
                          {headers.map((_, index) => (
                            <div
                              key={index}
                              className="flex-1 border-r border-gray-100 last:border-r-0"
                            />
                          ))}
                        </div>
                        
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all group"
                          style={{
                            left: position.left,
                            width: position.width,
                            backgroundColor: 
                              project.status === 'Completed' ? '#10b981' :
                              isOverdue ? '#ef4444' :
                              project.status === 'In Progress' ? '#3b82f6' :
                              '#9ca3af',
                          }}
                        >
                          <div className="h-full flex items-center px-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                {project.status === 'Completed' ? '✓ ' : ''}
                                {project.name}
                              </div>
                            </div>
                            <div className="ml-2 text-xs font-bold text-white bg-black bg-opacity-20 px-2 py-0.5 rounded">
                              {project.progress}%
                            </div>
                          </div>
                          
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            {project.dateRange!.startDate.toLocaleDateString()} - {project.dateRange!.endDate.toLocaleDateString()}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>

                        {project.dueDate && (
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                            style={{
                              left: calculateBarPosition(
                                new Date(project.dueDate),
                                new Date(project.dueDate)
                              ).left,
                            }}
                          >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-gray-400 rounded"></div>
            <span className="text-gray-600">Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rotate-45"></div>
            <span className="text-gray-600">Milestone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
