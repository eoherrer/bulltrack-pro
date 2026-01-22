'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
}

export function Select({ value, onChange, options, label, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-left text-white text-sm transition-colors',
          'hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500',
          isOpen && 'ring-2 ring-emerald-500'
        )}
      >
        <span className={cn(!selectedOption && 'text-gray-500')}>
          {selectedOption?.label || placeholder || 'Seleccionar...'}
        </span>
        <svg
          className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors',
                option.value === value
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-white hover:bg-gray-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
