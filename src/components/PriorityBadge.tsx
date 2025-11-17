import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = {
    urgent: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: '🔴',
      label: 'Urgent'
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      icon: '🟠',
      label: 'High'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: '🟡',
      label: 'Medium'
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: '🟢',
      label: 'Low'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const style = config[priority];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border-2 font-semibold ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}>
      <span>{style.icon}</span>
      <span>{style.label}</span>
    </span>
  );
}
