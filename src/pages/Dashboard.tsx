import { useState } from 'react';
import { useStore } from '../store';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const projects = useStore((state) => state.projects);
  const addProject = useStore((state) => state.addProject);
  const updateProject = useStore((state) => state.updateProject);
  const deleteProject = useStore((state) => state.deleteProject);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');
  const [editProjectDueDate, setEditProjectDueDate] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState<Project['status']>('Not Started');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Project['status'] | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), newProjectDesc.trim() || undefined, newProjectDueDate || undefined);
      setNewProjectName('');
      setNewProjectDesc('');
      setNewProjectDueDate('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject && editProjectName.trim()) {
      updateProject(editingProject.id, {
        name: editProjectName.trim(),
        description: editProjectDesc.trim() || undefined,
        dueDate: editProjectDueDate || undefined,
        status: editProjectStatus,
      });
      setIsEditModalOpen(false);
      setEditingProject(null);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setEditProjectDesc(project.description || '');
    setEditProjectDueDate(project.dueDate || '');
    setEditProjectStatus(project.status);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project? All tasks will be lost.')) {
      deleteProject(id);
    }
  };

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        const progressA = useStore.getState().getProjectProgress(a.id);
        const progressB = useStore.getState().getProjectProgress(b.id);
        return progressB - progressA;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Projects</h1>
            <p className="text-sm text-gray-600">{projects.length} total projects</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        <StatsOverview />

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Project['status'] | 'All')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
          >
            <option value="All">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'progress')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </div>
      </div>

      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-3 text-lg font-bold text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleAddProject}>
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter project name"
              autoFocus
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="project-desc" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="project-desc"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              placeholder="Project description (optional)"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="project-due" className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              id="project-due"
              type="date"
              value={newProjectDueDate}
              onChange={(e) => setNewProjectDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEditProject}>
          <div className="mb-4">
            <label htmlFor="edit-project-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              id="edit-project-name"
              type="text"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              autoFocus
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-project-desc" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="edit-project-desc"
              value={editProjectDesc}
              onChange={(e) => setEditProjectDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              placeholder="Project description (optional)"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-project-due" className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              id="edit-project-due"
              type="date"
              value={editProjectDueDate}
              onChange={(e) => setEditProjectDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-project-status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="edit-project-status"
              value={editProjectStatus}
              onChange={(e) => setEditProjectStatus(e.target.value as Project['status'])}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
