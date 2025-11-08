import { Member } from '../types';
import { useStore } from '../store';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export default function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  const taskCount = useStore((state) => state.getMemberTaskCount(member.id));
  const capacity = useStore((state) => state.getMemberCapacity(member.id));

  const getCapacityColor = () => {
    if (capacity <= 40) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (capacity <= 80) return 'bg-gradient-to-r from-orange-500 to-amber-500';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  const getCapacityLabel = () => {
    if (capacity <= 40) return 'Low';
    if (capacity <= 80) return 'Medium';
    return 'High';
  };

  const getCapacityTextColor = () => {
    if (capacity <= 40) return 'text-emerald-700';
    if (capacity <= 80) return 'text-orange-700';
    return 'text-red-700';
  };

  const getCapacityBgColor = () => {
    if (capacity <= 40) return 'bg-emerald-50 border-emerald-200';
    if (capacity <= 80) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 p-8 animate-fade-in hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-lg text-gray-500 mt-1 font-medium">{taskCount} active {taskCount === 1 ? 'task' : 'tasks'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(member)}
            className="p-3 hover:bg-indigo-50 rounded-xl transition-all"
            title="Edit member"
          >
            <svg className="w-7 h-7 text-gray-600 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-3 hover:bg-red-50 rounded-xl transition-all"
            title="Delete member"
          >
            <svg className="w-7 h-7 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-base">
          <span className="text-gray-600 font-medium">Work Capacity</span>
          <span className={`font-bold text-2xl ${getCapacityTextColor()}`}>
            {getCapacityLabel()} ({Math.round(capacity)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`${getCapacityColor()} h-4 rounded-full transition-all duration-500 shadow-lg`}
            style={{ width: `${Math.min(capacity, 100)}%` }}
          />
        </div>
        <div className={`mt-3 px-4 py-3 rounded-xl border-2 text-center ${getCapacityBgColor()}`}>
          <span className={`font-semibold text-base ${getCapacityTextColor()}`}>
            {capacity <= 40 ? '✅ Available' : capacity <= 80 ? '⚠️ Moderate Load' : '🔴 At Capacity'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium">Max 5 tasks = 100%</p>
      </div>
    </div>
  );
}
