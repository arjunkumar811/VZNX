import { useStore } from '../store';

export default function StatsOverview() {
  const stats = useStore(state => state.getProjectStats());
  const projects = useStore(state => state.projects);
  const overdueTasks = useStore(state => state.getOverdueTasks());
  const upcomingTasks = useStore(state => state.getUpcomingTasks(7));
  const getProjectCost = useStore(state => state.getProjectCost);

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalCost = projects.reduce((sum, p) => sum + getProjectCost(p.id), 0);
  const budgetUtilization = totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0;
  const profitMargin = totalBudget > 0 ? ((totalBudget - totalCost) / totalBudget) * 100 : 0;
  const avgHourlyRate = stats.totalHours > 0 ? totalCost / stats.totalHours : 0;

  const projectsOverBudget = projects.filter(p => {
    const cost = getProjectCost(p.id);
    const budget = p.budget || 0;
    return budget > 0 && cost > budget;
  }).length;

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
    {
      label: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
      icon: '💰',
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Total Cost',
      value: `$${(totalCost / 1000).toFixed(1)}k`,
      icon: '💸',
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50'
    },
    {
      label: 'Total Hours',
      value: `${stats.totalHours.toFixed(0)}h`,
      icon: '⏱️',
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Utilization',
      value: `${stats.utilizationRate}%`,
      icon: '📊',
      color: 'from-cyan-500 to-cyan-600',
      bg: 'bg-cyan-50'
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border-2 ${
          budgetUtilization >= 100 ? 'bg-red-50 border-red-300' :
          budgetUtilization >= 80 ? 'bg-amber-50 border-amber-300' :
          'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Budget Utilization</span>
            <span className={`text-xl font-bold ${
              budgetUtilization >= 100 ? 'text-red-600' :
              budgetUtilization >= 80 ? 'text-amber-600' :
              'text-green-600'
            }`}>
              {budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                budgetUtilization >= 100 ? 'bg-red-600' :
                budgetUtilization >= 80 ? 'bg-amber-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          {projectsOverBudget > 0 && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              {projectsOverBudget} {projectsOverBudget === 1 ? 'project is' : 'projects are'} over budget
            </p>
          )}
        </div>

        <div className={`rounded-lg p-4 border-2 ${
          profitMargin >= 30 ? 'bg-green-50 border-green-300' :
          profitMargin >= 15 ? 'bg-blue-50 border-blue-300' :
          profitMargin > 0 ? 'bg-amber-50 border-amber-300' :
          'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Profit Margin</span>
            <span className={`text-xl font-bold ${
              profitMargin >= 30 ? 'text-green-600' :
              profitMargin >= 15 ? 'text-blue-600' :
              profitMargin > 0 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Profit: ${((totalBudget - totalCost) / 1000).toFixed(1)}k
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Avg Hourly Rate</span>
            <span className="text-xl font-bold text-purple-600">
              ${avgHourlyRate.toFixed(0)}/hr
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Across all projects
          </p>
        </div>
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
