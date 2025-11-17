import { Link } from 'react-router-dom';
import { Project } from '../types';
import { useStore } from '../store';
import ProgressBar from './ProgressBar';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const progress = useStore((state) => state.getProjectProgress(project.id));
  const tasks = useStore((state) => state.getProjectTasks(project.id));

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDaysUntilDue = () => {
    if (!project.dueDate) return null;
    const today = new Date();
    const due = new Date(project.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 p-4 animate-fade-in hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <Link to={`/project/${project.id}`} className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description}</p>
          )}
        </Link>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit project"
          >
            <svg className="w-4 h-4 text-gray-600 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-all"
            title="Delete project"
          >
            <svg className="w-4 h-4 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          {daysUntilDue !== null && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
              daysUntilDue < 0 
                ? 'bg-red-100 text-red-700 border-red-200' 
                : daysUntilDue <= 3 
                ? 'bg-orange-100 text-orange-700 border-orange-200'
                : 'bg-green-100 text-green-700 border-green-200'
            }`}>
              📅 {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
            </span>
          )}
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-lg font-bold text-gray-900">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
          <p className="text-xs text-gray-500 mt-2 font-medium">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</p>
        </div>
      </div>
    </div>
  );
}
