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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 p-8 animate-fade-in hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <Link to={`/project/${project.id}`} className="flex-1">
          <h3 className="text-3xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
        </Link>
        <div className="flex gap-3 ml-3">
          <button
            onClick={() => onEdit(project)}
            className="p-3 hover:bg-indigo-50 rounded-xl transition-all"
            title="Edit project"
          >
            <svg className="w-7 h-7 text-gray-600 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-3 hover:bg-red-50 rounded-xl transition-all"
            title="Delete project"
          >
            <svg className="w-7 h-7 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <span className={`inline-block px-5 py-2 rounded-xl text-base font-semibold border-2 ${getStatusColor(project.status)}`}>
          {project.status}
        </span>

        <div>
          <div className="flex justify-between text-base text-gray-600 mb-3">
            <span className="font-medium">Progress</span>
            <span className="text-2xl font-bold text-gray-900">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-500 mt-3 font-medium">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</p>
        </div>
      </div>
    </div>
  );
}
