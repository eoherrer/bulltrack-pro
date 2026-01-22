import { cn } from '@/lib/utils';

interface ScoreBarProps {
  score: number;
  maxScore?: number;
}

export function ScoreBar({ score, maxScore = 100 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            percentage >= 80 ? 'bg-emerald-500' :
            percentage >= 60 ? 'bg-yellow-500' :
            'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
