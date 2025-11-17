import { useState } from 'react';
import { useStore } from '../store';
import { TimeEntry, ID } from '../types';
import Modal from './Modal';

interface TimeTrackerProps {
  projectId: ID;
}

export default function TimeTracker({ projectId }: TimeTrackerProps) {
  const tasks = useStore((state) => state.getProjectTasks(projectId));
  const members = useStore((state) => state.members);
  const timeEntries = useStore((state) => state.timeEntries);
  const addTimeEntry = useStore((state) => state.addTimeEntry);
  const deleteTimeEntry = useStore((state) => state.deleteTimeEntry);
  const updateTimeEntry = useStore((state) => state.updateTimeEntry);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [billable, setBillable] = useState(true);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const projectTimeEntries = timeEntries.filter(te => 
    tasks.some(task => task.id === te.taskId)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask && selectedMember && hours && parseFloat(hours) > 0) {
      if (editingEntry) {
        updateTimeEntry(editingEntry.id, {
          taskId: selectedTask,
          memberId: selectedMember,
          hours: parseFloat(hours),
          date,
          description: description.trim() || undefined,
          billable,
        });
      } else {
        addTimeEntry(
          selectedTask,
          selectedMember,
          parseFloat(hours),
          date,
          description.trim() || undefined,
          billable
        );
      }
      resetForm();
      setIsModalOpen(false);
    }
  };

  const resetForm = () => {
    setSelectedTask('');
    setSelectedMember('');
    setHours('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setBillable(true);
    setEditingEntry(null);
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setSelectedTask(entry.taskId);
    setSelectedMember(entry.memberId);
    setHours(entry.hours.toString());
    setDate(entry.date);
    setDescription(entry.description || '');
    setBillable(entry.billable);
    setIsModalOpen(true);
  };

  const handleDelete = (id: ID) => {
    if (confirm('Delete this time entry?')) {
      deleteTimeEntry(id);
    }
  };

  const getTaskName = (taskId: ID) => tasks.find(t => t.id === taskId)?.name || 'Unknown Task';
  const getMemberName = (memberId: ID) => members.find(m => m.id === memberId)?.name || 'Unknown';
  const getMemberRate = (memberId: ID) => members.find(m => m.id === memberId)?.hourlyRate || 0;

  const totalHours = projectTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = projectTimeEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
  const totalCost = projectTimeEntries.reduce((sum, entry) => {
    const rate = getMemberRate(entry.memberId);
    return sum + (entry.hours * rate);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Time Tracking</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Hours</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{totalHours.toFixed(1)}h</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Billable Hours</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{billableHours.toFixed(1)}h</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">${totalCost.toLocaleString()}</div>
        </div>
      </div>

      {projectTimeEntries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No time entries</h3>
          <p className="mt-1 text-sm text-gray-500">Start tracking time on this project.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectTimeEntries.map((entry) => {
                const rate = getMemberRate(entry.memberId);
                const cost = entry.hours * rate;
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{getTaskName(entry.taskId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{getMemberName(entry.memberId)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.hours}h</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        entry.billable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.billable ? 'Billable' : 'Non-billable'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">${cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                      {entry.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingEntry ? 'Edit Time Entry' : 'Log Time'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Member</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.hourlyRate ? `($${member.hourlyRate}/hr)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="What did you work on?"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="billable"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="billable" className="ml-2 text-sm text-gray-700">
                Billable time
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingEntry ? 'Update' : 'Log Time'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
