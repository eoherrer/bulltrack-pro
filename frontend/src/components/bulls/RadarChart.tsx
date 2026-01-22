'use client';

import { BullStats } from '@/types';

interface RadarChartProps {
  stats: BullStats;
  size?: number;
}

export function RadarChart({ stats, size = 80 }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) - 10;

  // Stats in order for pentagon
  const values = [
    stats.crecimiento,
    stats.facilidadParto,
    stats.reproduccion,
    stats.moderacion,
    stats.carcasa,
  ];

  // Calculate points for pentagon
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Create path for the data polygon
  const dataPoints = values.map((value, index) => getPoint(index, value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Create background pentagon lines
  const bgLevels = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background pentagons */}
      {bgLevels.map((level) => {
        const points = Array.from({ length: 5 }, (_, i) => getPoint(i, level));
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            opacity={0.3}
          />
        );
      })}

      {/* Axis lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const point = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#374151"
            strokeWidth="1"
            opacity={0.3}
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="rgba(16, 185, 129, 0.2)"
        stroke="#10B981"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#10B981"
        />
      ))}
    </svg>
  );
}
