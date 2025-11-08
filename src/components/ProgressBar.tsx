interface ProgressBarProps {
  progress: number;
  height?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, height = 'h-4', showLabel = false }: ProgressBarProps) {
  const getColor = () => {
    if (progress === 100) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    if (progress >= 67) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (progress >= 34) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden shadow-inner ${height}`}>
        <div
          className={`${getColor()} ${height} rounded-full transition-all duration-500 ease-out shadow-lg`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-lg font-bold text-gray-900 mt-2 block">{progress}%</span>
      )}
    </div>
  );
}
