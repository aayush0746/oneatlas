'use client';

interface RadarDimension {
  key: string;
  label: string;
}

interface ModelScoreData {
  modelId: string;
  modelName: string;
  slug: string;
  color?: string;
  scores: Record<string, number>; // 0 - 100
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  data: ModelScoreData[];
  size?: number;
}

const COLORS = ['#38bdf8', '#a855f7', '#34d399', '#f59e0b'];

export function RadarChart({ dimensions, data, size = 340 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const totalDimensions = dimensions.length;

  // Calculate coordinates for polygon vertices
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalDimensions) * index - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Concentric background grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Rings */}
        {gridLevels.map((level, idx) => {
          const points = dimensions
            .map((_, i) => {
              const { x, y } = getCoordinates(level * 100, i);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes from center to edge */}
        {dimensions.map((dim, i) => {
          const { x, y } = getCoordinates(100, i);
          const labelAngle = (Math.PI * 2 / totalDimensions) * i - Math.PI / 2;
          const labelDistance = radius + 24;
          const labelX = center + labelDistance * Math.cos(labelAngle);
          const labelY = center + labelDistance * Math.sin(labelAngle);

          return (
            <g key={dim.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-medium fill-slate-400"
              >
                {dim.label}
              </text>
            </g>
          );
        })}

        {/* Polygons for each model */}
        {data.map((item, modelIndex) => {
          const color = item.color || COLORS[modelIndex % COLORS.length];
          const points = dimensions
            .map((dim, i) => {
              const score = item.scores[dim.key] ?? 50;
              const { x, y } = getCoordinates(score, i);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={item.modelId}>
              {/* Semi-transparent filled area */}
              <polygon
                points={points}
                fill={color}
                fillOpacity="0.22"
                stroke={color}
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              {/* Vertex dots */}
              {dimensions.map((dim, i) => {
                const score = item.scores[dim.key] ?? 50;
                const { x, y } = getCoordinates(score, i);
                return (
                  <circle
                    key={dim.key}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                    className="shadow-sm"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend below the chart */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((item, idx) => {
          const color = item.color || COLORS[idx % COLORS.length];
          return (
            <div key={item.modelId} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-medium">{item.modelName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
