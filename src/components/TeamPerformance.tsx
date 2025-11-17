import { useStore } from '../store';

export default function TeamPerformance() {
  const members = useStore((state) => state.members);
  const timeEntries = useStore((state) => state.timeEntries);
  const getMemberTaskCount = useStore((state) => state.getMemberTaskCount);

  const memberMetrics = members.map(member => {
    const memberEntries = timeEntries.filter(te => te.memberId === member.id);
    const totalHours = memberEntries.reduce((sum, te) => sum + te.hours, 0);
    const billableHours = memberEntries.filter(te => te.billable).reduce((sum, te) => sum + te.hours, 0);
    const billablePercent = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;
    const revenue = billableHours * (member.hourlyRate || 0);
    const activeTasks = getMemberTaskCount(member.id);

    return {
      ...member,
      totalHours,
      billableHours,
      billablePercent,
      revenue,
      activeTasks,
    };
  }).sort((a, b) => b.totalHours - a.totalHours);

  const totalTeamHours = memberMetrics.reduce((sum, m) => sum + m.totalHours, 0);
  const totalBillableHours = memberMetrics.reduce((sum, m) => sum + m.billableHours, 0);
  const totalRevenue = memberMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const avgBillablePercent = totalTeamHours > 0 ? (totalBillableHours / totalTeamHours) * 100 : 0;

  const topPerformers = [...memberMetrics].slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium">Total Hours</div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">{totalTeamHours.toFixed(0)}h</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">Billable Hours</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{totalBillableHours.toFixed(0)}h</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Billable %</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{avgBillablePercent.toFixed(0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="text-sm text-emerald-600 font-medium">Team Revenue</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">${(totalRevenue / 1000).toFixed(1)}k</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">🏆 Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topPerformers.map((member, index) => (
            <div key={member.id} className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                  {member.role && (
                    <div className="text-xs text-gray-600">{member.role}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Hours:</span>
                  <span className="font-bold text-gray-900 ml-1">{member.totalHours.toFixed(0)}h</span>
                </div>
                <div>
                  <span className="text-gray-600">Tasks:</span>
                  <span className="font-bold text-gray-900 ml-1">{member.activeTasks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Team Members</h3>
        <div className="space-y-2">
          {memberMetrics.map(member => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  {member.role && (
                    <div className="text-xs text-gray-500">{member.role}</div>
                  )}
                </div>
                {member.hourlyRate && (
                  <span className="text-xs font-semibold text-indigo-600">
                    ${member.hourlyRate}/hr
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="font-semibold text-gray-900 ml-1">{member.totalHours.toFixed(0)}h</span>
                </div>
                <div>
                  <span className="text-gray-500">Billable:</span>
                  <span className="font-semibold text-green-600 ml-1">{member.billableHours.toFixed(0)}h</span>
                </div>
                <div>
                  <span className="text-gray-500">Tasks:</span>
                  <span className="font-semibold text-blue-600 ml-1">{member.activeTasks}</span>
                </div>
                <div>
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-semibold text-emerald-600 ml-1">${(member.revenue / 1000).toFixed(1)}k</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    member.billablePercent >= 80 ? 'bg-green-500' :
                    member.billablePercent >= 60 ? 'bg-blue-500' :
                    member.billablePercent >= 40 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${member.billablePercent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {member.billablePercent.toFixed(0)}% billable
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
