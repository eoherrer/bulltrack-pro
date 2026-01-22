import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, sublabel, disabled }: ToggleProps) {
  return (
    <label className={cn('flex items-center cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full transition-colors',
            checked ? 'bg-emerald-500' : 'bg-gray-600'
          )}
        />
        <div
          className={cn(
            'absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {(label || sublabel) && (
        <div className="ml-3">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
        </div>
      )}
    </label>
  );
}
