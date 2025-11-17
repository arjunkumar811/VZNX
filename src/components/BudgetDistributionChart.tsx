import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

export default function BudgetDistributionChart() {
  const projects = useStore((state) => state.projects);
  const getProjectCost = useStore((state) => state.getProjectCost);

  const chartData = useMemo(() => {
    return projects
      .filter(p => p.budget && p.budget > 0)
      .slice(0, 10)
      .map(project => {
        const cost = getProjectCost(project.id);
        const budget = project.budget || 0;
        const remaining = Math.max(0, budget - cost);
        const overBudget = Math.max(0, cost - budget);

        return {
          name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
          budget: budget,
          spent: Math.min(cost, budget),
          overBudget: overBudget,
          remaining: remaining
        };
      });
  }, [projects, getProjectCost]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Budget Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Budget vs actual spending by project</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Spent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Over Budget</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No budget data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px'
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Bar dataKey="spent" stackId="a" fill="#3b82f6" name="Spent" />
            <Bar dataKey="remaining" stackId="a" fill="#10b981" name="Remaining" />
            <Bar dataKey="overBudget" fill="#ef4444" name="Over Budget" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
