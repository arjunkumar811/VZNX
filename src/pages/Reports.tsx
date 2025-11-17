import { useState } from 'react';
import { useStore } from '../store';
import RevenueChart from '../components/RevenueChart';
import BudgetDistributionChart from '../components/BudgetDistributionChart';
import ProjectStatusChart from '../components/ProjectStatusChart';
import TeamWorkloadChart from '../components/TeamWorkloadChart';

type ReportType = 'project-summary' | 'time-tracking' | 'budget-analysis' | 'client-revenue';
type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';

export default function Reports() {
  const projects = useStore((state) => state.projects);
  const clients = useStore((state) => state.clients);
  const members = useStore((state) => state.members);
  const timeEntries = useStore((state) => state.timeEntries);
  const getProjectCost = useStore((state) => state.getProjectCost);
  const getProjectRevenue = useStore((state) => state.getProjectRevenue);
  const getProjectHours = useStore((state) => state.getProjectHours);
  const getClientProjects = useStore((state) => state.getClientProjects);
  const getProjectTasks = useStore((state) => state.getProjectTasks);

  const [reportType, setReportType] = useState<ReportType>('project-summary');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const getDateRangeFilter = () => {
    const now = new Date();
    let startDate = new Date();

    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (dateRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (dateRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (dateRange === 'custom') {
      if (customStartDate && customEndDate) {
        return {
          start: new Date(customStartDate),
          end: new Date(customEndDate)
        };
      }
      return null;
    } else {
      return null;
    }

    return { start: startDate, end: now };
  };

  const filterDataByDate = (date: string) => {
    const range = getDateRangeFilter();
    if (!range) return true;
    const itemDate = new Date(date);
    return itemDate >= range.start && itemDate <= range.end;
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (selectedClient !== 'all') {
      filtered = filtered.filter(p => p.clientId === selectedClient);
    }
    
    if (selectedProject !== 'all') {
      filtered = filtered.filter(p => p.id === selectedProject);
    }

    filtered = filtered.filter(p => filterDataByDate(p.createdAt));
    
    return filtered;
  };

  const getFilteredTimeEntries = () => {
    return timeEntries.filter(entry => filterDataByDate(entry.date));
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportProjectSummaryCSV = () => {
    const filteredProjects = getFilteredProjects();
    const data = filteredProjects.map(project => {
      const client = clients.find(c => c.id === project.clientId);
      return {
        'Project Name': project.name,
        'Client': client?.name || 'N/A',
        'Status': project.status,
        'Progress': `${project.progress}%`,
        'Budget': `$${project.budget || 0}`,
        'Cost': `$${getProjectCost(project.id).toFixed(2)}`,
        'Revenue': `$${getProjectRevenue(project.id).toFixed(2)}`,
        'Hours': getProjectHours(project.id).toFixed(1),
        'Tasks': getProjectTasks(project.id).length,
        'Created': new Date(project.createdAt).toLocaleDateString(),
        'Due Date': project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'
      };
    });
    exportToCSV(data, 'project_summary');
  };

  const exportTimeTrackingCSV = () => {
    const filteredEntries = getFilteredTimeEntries();
    const data = filteredEntries.map(entry => {
      const member = members.find(m => m.id === entry.memberId);
      const task = projects.flatMap(p => useStore.getState().getProjectTasks(p.id)).find(t => t.id === entry.taskId);
      const project = projects.find(p => useStore.getState().getProjectTasks(p.id).some(t => t.id === entry.taskId));
      
      return {
        'Date': new Date(entry.date).toLocaleDateString(),
        'Member': member?.name || 'Unknown',
        'Project': project?.name || 'N/A',
        'Task': task?.name || 'N/A',
        'Hours': entry.hours,
        'Billable': entry.billable ? 'Yes' : 'No',
        'Rate': `$${member?.hourlyRate || 0}`,
        'Cost': `$${(entry.hours * (member?.hourlyRate || 0)).toFixed(2)}`
      };
    });
    exportToCSV(data, 'time_tracking');
  };

  const exportBudgetAnalysisCSV = () => {
    const filteredProjects = getFilteredProjects();
    const data = filteredProjects.map(project => {
      const cost = getProjectCost(project.id);
      const budget = project.budget || 0;
      const remaining = budget - cost;
      const utilization = budget > 0 ? (cost / budget) * 100 : 0;
      const client = clients.find(c => c.id === project.clientId);
      
      return {
        'Project': project.name,
        'Client': client?.name || 'N/A',
        'Budget': `$${budget}`,
        'Cost': `$${cost.toFixed(2)}`,
        'Remaining': `$${remaining.toFixed(2)}`,
        'Utilization': `${utilization.toFixed(1)}%`,
        'Status': utilization >= 100 ? 'Over Budget' : utilization >= 80 ? 'At Risk' : 'On Track',
        'Hours': getProjectHours(project.id).toFixed(1)
      };
    });
    exportToCSV(data, 'budget_analysis');
  };

  const exportClientRevenueCSV = () => {
    const data = clients.map(client => {
      const clientProjects = getClientProjects(client.id);
      const totalRevenue = clientProjects.reduce((sum, p) => sum + getProjectRevenue(p.id), 0);
      const totalCost = clientProjects.reduce((sum, p) => sum + getProjectCost(p.id), 0);
      const profit = totalRevenue - totalCost;
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      const activeProjects = clientProjects.filter(p => p.status === 'In Progress').length;
      const completedProjects = clientProjects.filter(p => p.status === 'Completed').length;
      
      return {
        'Client': client.name,
        'Company': client.company || 'N/A',
        'Email': client.email,
        'Total Projects': clientProjects.length,
        'Active': activeProjects,
        'Completed': completedProjects,
        'Revenue': `$${totalRevenue.toFixed(2)}`,
        'Cost': `$${totalCost.toFixed(2)}`,
        'Profit': `$${profit.toFixed(2)}`,
        'Margin': `${margin.toFixed(1)}%`
      };
    });
    exportToCSV(data, 'client_revenue');
  };

  const printReport = () => {
    window.print();
  };

  const renderProjectSummary = () => {
    const filteredProjects = getFilteredProjects();
    
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalRevenue = filteredProjects.reduce((sum, p) => sum + getProjectRevenue(p.id), 0);
    const totalHours = filteredProjects.reduce((sum, p) => sum + getProjectHours(p.id), 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Projects</div>
            <div className="text-2xl font-bold text-blue-900">{filteredProjects.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Total Budget</div>
            <div className="text-2xl font-bold text-green-900">${totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-purple-900">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-sm text-amber-600 font-medium">Total Hours</div>
            <div className="text-2xl font-bold text-amber-900">{totalHours.toFixed(1)}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map(project => {
                const client = clients.find(c => c.id === project.clientId);
                const cost = getProjectCost(project.id);
                const revenue = getProjectRevenue(project.id);
                const hours = getProjectHours(project.id);

                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{project.progress}%</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${(project.budget || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{hours.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTimeTracking = () => {
    const filteredEntries = getFilteredTimeEntries();
    const totalHours = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
    const billableHours = filteredEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
    const totalCost = filteredEntries.reduce((sum, e) => {
      const member = members.find(m => m.id === e.memberId);
      return sum + (e.hours * (member?.hourlyRate || 0));
    }, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Entries</div>
            <div className="text-2xl font-bold text-blue-900">{filteredEntries.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Total Hours</div>
            <div className="text-2xl font-bold text-green-900">{totalHours.toFixed(1)}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Billable Hours</div>
            <div className="text-2xl font-bold text-purple-900">{billableHours.toFixed(1)}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-sm text-amber-600 font-medium">Total Cost</div>
            <div className="text-2xl font-bold text-amber-900">${totalCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billable</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.slice(0, 100).map(entry => {
                const member = members.find(m => m.id === entry.memberId);
                const project = projects.find(p => useStore.getState().getProjectTasks(p.id).some(t => t.id === entry.taskId));
                const rate = member?.hourlyRate || 0;
                const cost = entry.hours * rate;

                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{member?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{entry.hours}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.billable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${rate}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${cost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBudgetAnalysis = () => {
    const filteredProjects = getFilteredProjects();
    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalCost = filteredProjects.reduce((sum, p) => sum + getProjectCost(p.id), 0);
    const remaining = totalBudget - totalCost;
    const atRisk = filteredProjects.filter(p => {
      const cost = getProjectCost(p.id);
      const budget = p.budget || 0;
      return budget > 0 && (cost / budget) >= 0.8;
    }).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Budget</div>
            <div className="text-2xl font-bold text-blue-900">${totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600 font-medium">Total Cost</div>
            <div className="text-2xl font-bold text-red-900">${totalCost.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Remaining</div>
            <div className="text-2xl font-bold text-green-900">${remaining.toLocaleString()}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-sm text-amber-600 font-medium">At Risk</div>
            <div className="text-2xl font-bold text-amber-900">{atRisk}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map(project => {
                const client = clients.find(c => c.id === project.clientId);
                const cost = getProjectCost(project.id);
                const budget = project.budget || 0;
                const remaining = budget - cost;
                const utilization = budget > 0 ? (cost / budget) * 100 : 0;
                const status = utilization >= 100 ? 'Over Budget' : utilization >= 80 ? 'At Risk' : 'On Track';

                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${remaining.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{utilization.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'Over Budget' ? 'bg-red-100 text-red-800' :
                        status === 'At Risk' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderClientRevenue = () => {
    const totalRevenue = clients.reduce((sum, c) => {
      const clientProjects = getClientProjects(c.id);
      return sum + clientProjects.reduce((pSum, p) => pSum + getProjectRevenue(p.id), 0);
    }, 0);

    const totalCost = clients.reduce((sum, c) => {
      const clientProjects = getClientProjects(c.id);
      return sum + clientProjects.reduce((pSum, p) => pSum + getProjectCost(p.id), 0);
    }, 0);

    const totalProfit = totalRevenue - totalCost;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Clients</div>
            <div className="text-2xl font-bold text-blue-900">{clients.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600 font-medium">Total Cost</div>
            <div className="text-2xl font-bold text-red-900">${totalCost.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Total Profit</div>
            <div className="text-2xl font-bold text-purple-900">${totalProfit.toLocaleString()}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Projects</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map(client => {
                const clientProjects = getClientProjects(client.id);
                const revenue = clientProjects.reduce((sum, p) => sum + getProjectRevenue(p.id), 0);
                const cost = clientProjects.reduce((sum, p) => sum + getProjectCost(p.id), 0);
                const profit = revenue - cost;
                const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.company || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{clientProjects.length}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">${profit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        margin >= 30 ? 'bg-green-100 text-green-800' :
                        margin >= 15 ? 'bg-blue-100 text-blue-800' :
                        margin >= 0 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
            <p className="text-sm text-gray-600 mt-1">Generate and export comprehensive reports</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={printReport}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={() => {
                if (reportType === 'project-summary') exportProjectSummaryCSV();
                else if (reportType === 'time-tracking') exportTimeTrackingCSV();
                else if (reportType === 'budget-analysis') exportBudgetAnalysisCSV();
                else if (reportType === 'client-revenue') exportClientRevenueCSV();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="project-summary">Project Summary</option>
              <option value="time-tracking">Time Tracking</option>
              <option value="budget-analysis">Budget Analysis</option>
              <option value="client-revenue">Client Revenue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {reportType !== 'client-revenue' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Filter</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}

          {(reportType === 'time-tracking' || reportType === 'budget-analysis') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Filter</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          {reportType === 'project-summary' && renderProjectSummary()}
          {reportType === 'time-tracking' && renderTimeTracking()}
          {reportType === 'budget-analysis' && renderBudgetAnalysis()}
          {reportType === 'client-revenue' && renderClientRevenue()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RevenueChart />
          <BudgetDistributionChart />
          <ProjectStatusChart />
          <TeamWorkloadChart />
        </div>
      </div>
    </div>
  );
}
