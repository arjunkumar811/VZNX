import { useStore } from '../store';

export default function ProjectAnalytics() {
  const projects = useStore((state) => state.projects);
  const getProjectCost = useStore((state) => state.getProjectCost);
  const getProjectHours = useStore((state) => state.getProjectHours);
  const clients = useStore((state) => state.clients);

  const projectsWithMetrics = projects.map(project => {
    const cost = getProjectCost(project.id);
    const hours = getProjectHours(project.id);
    const budget = project.budget || 0;
    const budgetUsed = budget > 0 ? (cost / budget) * 100 : 0;
    const remaining = budget - cost;
    const client = project.clientId ? clients.find(c => c.id === project.clientId) : null;

    return {
      ...project,
      cost,
      hours,
      budgetUsed,
      remaining,
      client,
    };
  }).filter(p => p.budget && p.budget > 0);

  const topProjectsByCost = [...projectsWithMetrics]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const projectsAtRisk = projectsWithMetrics.filter(p => p.budgetUsed >= 80);

  const totalAllocated = projectsWithMetrics.reduce((sum, p) => sum + p.budget!, 0);
  const totalSpent = projectsWithMetrics.reduce((sum, p) => sum + p.cost, 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Project Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Allocated</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">${(totalAllocated / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Total Spent</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">${(totalSpent / 1000).toFixed(1)}k</div>
        </div>
        <div className={`bg-gradient-to-br p-4 rounded-lg border ${
          totalRemaining >= 0
            ? 'from-green-50 to-green-100 border-green-200'
            : 'from-red-50 to-red-100 border-red-200'
        }`}>
          <div className={`text-sm font-medium ${
            totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            totalRemaining >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            ${(Math.abs(totalRemaining) / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {projectsAtRisk.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-bold text-amber-900 mb-3">⚠️ Projects at Risk ({projectsAtRisk.length})</h3>
          <div className="space-y-2">
            {projectsAtRisk.slice(0, 3).map(project => (
              <div key={project.id} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900 truncate flex-1">{project.name}</span>
                <span className={`font-bold ml-2 ${
                  project.budgetUsed >= 100 ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {project.budgetUsed.toFixed(0)}% used
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Top Projects by Cost</h3>
        <div className="space-y-3">
          {topProjectsByCost.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{project.name}</div>
                  {project.client && (
                    <div className="text-xs text-gray-500 mt-0.5">{project.client.company}</div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-semibold text-gray-900 ml-1">${(project.budget! / 1000).toFixed(1)}k</span>
                </div>
                <div>
                  <span className="text-gray-500">Cost:</span>
                  <span className="font-semibold text-gray-900 ml-1">${(project.cost / 1000).toFixed(1)}k</span>
                </div>
                <div>
                  <span className="text-gray-500">Hours:</span>
                  <span className="font-semibold text-gray-900 ml-1">{project.hours.toFixed(0)}h</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    project.budgetUsed >= 100 ? 'bg-red-500' :
                    project.budgetUsed >= 80 ? 'bg-amber-500' :
                    project.budgetUsed >= 50 ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(project.budgetUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{project.budgetUsed.toFixed(1)}% of budget</span>
                <span className={`text-xs font-semibold ${
                  project.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {project.remaining >= 0 ? '+' : ''}{(project.remaining / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
