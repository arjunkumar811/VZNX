import { useStore } from '../store';

export default function ClientRevenue() {
  const clients = useStore((state) => state.clients);
  const getProjectCost = useStore((state) => state.getProjectCost);
  const getClientProjects = useStore((state) => state.getClientProjects);

  const clientMetrics = clients.map(client => {
    const clientProjects = getClientProjects(client.id);
    const totalRevenue = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalCost = clientProjects.reduce((sum, p) => sum + getProjectCost(p.id), 0);
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    const activeProjects = clientProjects.filter(p => p.status === 'In Progress').length;
    const completedProjects = clientProjects.filter(p => p.status === 'Completed').length;

    return {
      ...client,
      projectCount: clientProjects.length,
      totalRevenue,
      totalCost,
      profit,
      profitMargin,
      activeProjects,
      completedProjects,
    };
  }).filter(c => c.projectCount > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const totalClientRevenue = clientMetrics.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalClientCost = clientMetrics.reduce((sum, c) => sum + c.totalCost, 0);
  const totalProfit = totalClientRevenue - totalClientCost;
  const avgProfitMargin = totalClientRevenue > 0 ? (totalProfit / totalClientRevenue) * 100 : 0;

  const topClients = clientMetrics.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Client Revenue</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Revenue</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">${(totalClientRevenue / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">${(totalClientCost / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Profit</div>
          <div className="text-2xl font-bold text-green-900 mt-1">${(totalProfit / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="text-sm text-emerald-600 font-medium">Avg Margin</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{avgProfitMargin.toFixed(0)}%</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Top Clients by Revenue</h3>
        <div className="space-y-3">
          {topClients.map((client, index) => (
            <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {index === 0 ? '👑' : index === 1 ? '⭐' : index === 2 ? '✨' : ''}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.company}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">${(client.totalRevenue / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-500">revenue</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">Projects</span>
                  <span className="font-semibold text-gray-900">{client.projectCount}</span>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-gray-500 block">Active</span>
                  <span className="font-semibold text-green-600">{client.activeProjects}</span>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <span className="text-gray-500 block">Completed</span>
                  <span className="font-semibold text-blue-600">{client.completedProjects}</span>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <span className="text-gray-500 block">Cost</span>
                  <span className="font-semibold text-purple-600">${(client.totalCost / 1000).toFixed(1)}k</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500">Profit:</span>
                  <span className={`font-bold ml-1 ${
                    client.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${(client.profit / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Margin:</span>
                  <span className={`font-bold ml-1 ${
                    client.profitMargin >= 30 ? 'text-green-600' :
                    client.profitMargin >= 15 ? 'text-blue-600' :
                    client.profitMargin > 0 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {client.profitMargin.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {clientMetrics.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No client data</h3>
          <p className="mt-1 text-xs text-gray-500">Assign clients to projects to see revenue analytics</p>
        </div>
      )}
    </div>
  );
}
