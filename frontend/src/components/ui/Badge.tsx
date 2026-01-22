import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-700 text-gray-300 border-gray-600',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
