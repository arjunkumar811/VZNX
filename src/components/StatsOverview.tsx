import { useStore } from '../store';

export default function StatsOverview() {
  const stats = useStore(state => state.getProjectStats());
  const overdueTasks = useStore(state => state.getOverdueTasks());
  const upcomingTasks = useStore(state => state.getUpcomingTasks(7));

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: '⚡',
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Completed',
      value: stats.completedProjects,
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Avg Progress',
      value: `${stats.avgProgress}%`,
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50'
    },
  ];

  const taskStats = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: '📝',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: '✓',
      color: 'text-emerald-600'
    },
    {
      label: 'Overdue',
      value: overdueTasks.length,
      icon: '⚠️',
      color: overdueTasks.length > 0 ? 'text-red-600' : 'text-gray-400'
    },
    {
      label: 'Due This Week',
      value: upcomingTasks.length,
      icon: '📅',
      color: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-lg p-3 border border-gray-100 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {taskStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-2 border border-gray-100">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-sm">{stat.icon}</span>
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </div>
            <p className={`text-lg font-bold ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <h4 className="font-semibold text-sm text-red-900">Overdue Tasks Alert</h4>
              <p className="text-xs text-red-700 mt-0.5">
                You have {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'} that need attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
