import { Task } from '../types';
import { useStore } from '../store';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
  const toggleTask = useStore((state) => state.toggleTask);
  const members = useStore((state) => state.members);
  const updateTask = useStore((state) => state.updateTask);

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssigneeId = e.target.value || undefined;
    updateTask(task.id, { assigneeId: newAssigneeId });
  };

  return (
    <div className="group bg-white rounded-xl border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 animate-slide-up">
      <div className="flex items-start gap-5">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.complete
              ? 'bg-emerald-500 border-emerald-500 shadow-lg'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {task.complete && (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-lg font-medium mb-3 ${
              task.complete
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
            } transition-all`}
          >
            {task.name}
          </p>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">👤 Assigned to:</span>
            <select
              value={task.assigneeId || ''}
              onChange={handleAssigneeChange}
              className="text-base border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-3 hover:bg-red-50 rounded-xl transition-all"
          title="Delete task"
        >
          <svg className="w-6 h-6 text-gray-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
