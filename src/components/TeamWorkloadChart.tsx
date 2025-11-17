import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

export default function TeamWorkloadChart() {
  const members = useStore((state) => state.members);
  const timeEntries = useStore((state) => state.timeEntries);

  const chartData = useMemo(() => {
    const memberHours = members.map(member => {
      const entries = timeEntries.filter(e => e.memberId === member.id);
      const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
      const nonBillableHours = entries.filter(e => !e.billable).reduce((sum, e) => sum + e.hours, 0);
      const totalHours = billableHours + nonBillableHours;

      return {
        name: member.name.length > 12 ? member.name.substring(0, 12) + '...' : member.name,
        billable: Math.round(billableHours * 10) / 10,
        nonBillable: Math.round(nonBillableHours * 10) / 10,
        total: Math.round(totalHours * 10) / 10,
        utilization: totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0
      };
    }).filter(m => m.total > 0);

    return memberHours.sort((a, b) => b.total - a.total).slice(0, 10);
  }, [members, timeEntries]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Workload</h3>
          <p className="text-sm text-gray-600 mt-1">Hours breakdown by team member</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Billable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Non-Billable</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No workload data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [
                `${value} hours`,
                name === 'billable' ? 'Billable' : 'Non-Billable'
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="billable" stackId="a" fill="#10b981" name="Billable" />
            <Bar dataKey="nonBillable" stackId="a" fill="#f59e0b" name="Non-Billable" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Top Performer</div>
            <div className="text-xl font-bold text-green-900 mt-1">{chartData[0].name}</div>
            <div className="text-sm text-green-700 mt-1">{chartData[0].total} hours • {chartData[0].utilization}% billable</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Team Average</div>
            <div className="text-xl font-bold text-blue-900 mt-1">
              {(chartData.reduce((sum, m) => sum + m.total, 0) / chartData.length).toFixed(1)} hrs
            </div>
            <div className="text-sm text-blue-700 mt-1">
              {Math.round(chartData.reduce((sum, m) => sum + m.utilization, 0) / chartData.length)}% utilization
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
