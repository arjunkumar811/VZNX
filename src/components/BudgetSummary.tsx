import { useStore } from '../store';
import { ID } from '../types';

interface BudgetSummaryProps {
  projectId: ID;
}

export default function BudgetSummary({ projectId }: BudgetSummaryProps) {
  const project = useStore((state) => state.projects.find(p => p.id === projectId));
  const getProjectCost = useStore((state) => state.getProjectCost);
  const getProjectHours = useStore((state) => state.getProjectHours);
  const tasks = useStore((state) => state.getProjectTasks(projectId));
  const timeEntries = useStore((state) => state.timeEntries);
  const members = useStore((state) => state.members);

  const projectTimeEntries = timeEntries.filter(te => 
    tasks.some(task => task.id === te.taskId)
  );

  const totalHours = getProjectHours(projectId);
  const totalCost = getProjectCost(projectId);
  const budget = project?.budget || 0;
  const remaining = budget - totalCost;
  const budgetUsed = budget > 0 ? (totalCost / budget) * 100 : 0;

  const billableHours = projectTimeEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
  const nonBillableHours = totalHours - billableHours;

  const billableCost = projectTimeEntries
    .filter(e => e.billable)
    .reduce((sum, entry) => {
      const member = members.find(m => m.id === entry.memberId);
      return sum + (entry.hours * (member?.hourlyRate || 0));
    }, 0);

  const nonBillableCost = totalCost - billableCost;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Budget & Cost Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Budget</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${budget.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            ${totalCost.toLocaleString()}
          </div>
        </div>

        <div className={`bg-gradient-to-br ${
          remaining >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
        } p-4 rounded-lg`}>
          <div className={`text-sm font-medium ${
            remaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            remaining >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            ${Math.abs(remaining).toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
          <div className="text-sm text-amber-600 font-medium">Total Hours</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {totalHours.toFixed(1)}h
          </div>
        </div>
      </div>

      {budget > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Budget Utilization</span>
            <span className="font-medium">{budgetUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                budgetUsed >= 100 ? 'bg-red-600' :
                budgetUsed >= 80 ? 'bg-amber-500' :
                budgetUsed >= 50 ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          {budgetUsed >= 100 && (
            <p className="text-sm text-red-600 mt-2 font-medium">
              ⚠️ Budget exceeded by ${(totalCost - budget).toLocaleString()}
            </p>
          )}
          {budgetUsed >= 80 && budgetUsed < 100 && (
            <p className="text-sm text-amber-600 mt-2 font-medium">
              ⚠️ Approaching budget limit
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Hours Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Billable</span>
              <span className="text-sm font-semibold text-green-600">
                {billableHours.toFixed(1)}h ({totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Non-billable</span>
              <span className="text-sm font-semibold text-gray-600">
                {nonBillableHours.toFixed(1)}h ({totalHours > 0 ? ((nonBillableHours / totalHours) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Billable</span>
              <span className="text-sm font-semibold text-green-600">
                ${billableCost.toLocaleString()} ({totalCost > 0 ? ((billableCost / totalCost) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Non-billable</span>
              <span className="text-sm font-semibold text-gray-600">
                ${nonBillableCost.toLocaleString()} ({totalCost > 0 ? ((nonBillableCost / totalCost) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {totalHours > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            Average hourly cost: <span className="font-semibold text-gray-900">${(totalCost / totalHours).toFixed(2)}/hr</span>
          </div>
        </div>
      )}
    </div>
  );
}
