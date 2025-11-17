import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useStore } from '../store';

const COLORS = {
  'Completed': '#10b981',
  'In Progress': '#3b82f6',
  'Not Started': '#9ca3af'
};

export default function ProjectStatusChart() {
  const projects = useStore((state) => state.projects);

  const chartData = useMemo(() => {
    const statusCount = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / projects.length) * 100).toFixed(1)
    }));
  }, [projects]);

  const renderCustomLabel = (entry: any) => {
    return `${entry.value} (${entry.percentage}%)`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Status Distribution</h3>
        <p className="text-sm text-gray-600 mt-1">Breakdown of projects by status</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No projects available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} projects (${props.payload.percentage}%)`,
                name
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold" style={{ color: COLORS[item.name as keyof typeof COLORS] }}>
              {item.value}
            </div>
            <div className="text-xs text-gray-600 mt-1">{item.name}</div>
            <div className="text-xs text-gray-500">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
