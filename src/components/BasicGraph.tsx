import React from 'react';
import './BasicGraph.css';

interface DataPoint {
  x: number;
  y: number;
}

interface BasicGraphProps {
  data: DataPoint[];
  svgWidth?: number; // Used as percentage if not for viewBox
  svgHeight?: number; // Used in pixels
  padding?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisUnit?: string; // e.g., 'm', 'bpm', 's/km'
}

const BasicGraph: React.FC<BasicGraphProps> = ({
  data,
  svgWidth = 100,
  svgHeight = 200,
  padding = 30,
  color = '#1abc9c',
  xAxisLabel = '',
  yAxisLabel = '',
  yAxisUnit = '',
}) => {
  if (!data || data.length < 2) {
    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="basic-graph-svg" aria-label={`${xAxisLabel} vs ${yAxisLabel} graph`}>
        <text
          x={svgWidth / 2}
          y={svgHeight / 2}
          className="insufficient-data-text"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          Insufficient data for graph.
        </text>
      </svg>
    );
  }

  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));

  const xRange = xMax - xMin === 0 ? 1 : xMax - xMin;
  const yRange = yMax - yMin === 0 ? 1 : yMax - yMin;

  const effectiveSvgWidth = 350; // Fixed internal width for viewBox consistency
  const effectiveSvgHeight = svgHeight;

  const graphWidth = effectiveSvgWidth - 2 * padding;
  const graphHeight = effectiveSvgHeight - 2 * padding;

  const getSvgX = (x: number) => padding + ((x - xMin) / xRange) * graphWidth;
  const getSvgY = (y: number) => effectiveSvgHeight - padding - ((y - yMin) / yRange) * graphHeight;

  const linePath = data
    .map(point => `${getSvgX(point.x)},${getSvgY(point.y)}`)
    .join(' ');

  // Basic ticks - for simplicity, just min and max, or a few points
  const numXTicks = 5;
  const numYTicks = 5;
  const xTicks = [];
  const yTicks = [];

  for (let i = 0; i <= numXTicks; i++) {
    const val = xMin + (xRange / numXTicks) * i;
    xTicks.push({ val: val.toFixed(xRange < 10 ? 1 : 0), x: getSvgX(val) });
  }
  for (let i = 0; i <= numYTicks; i++) {
    const val = yMin + (yRange / numYTicks) * i;
    yTicks.push({ val: val.toFixed(yRange < 10 ? 1 : 0), y: getSvgY(val) });
  }


  return (
    <svg viewBox={`0 0 ${effectiveSvgWidth} ${effectiveSvgHeight}`} className="basic-graph-svg" preserveAspectRatio="xMidYMid meet" aria-label={`${xAxisLabel} vs ${yAxisLabel} graph`}>
      {/* Y Axis Line */}
      <line x1={padding} y1={padding} x2={padding} y2={effectiveSvgHeight - padding} className="axis-line" />
      {/* X Axis Line */}
      <line x1={padding} y1={effectiveSvgHeight - padding} x2={effectiveSvgWidth - padding} y2={effectiveSvgHeight - padding} className="axis-line" />

      {/* Y Axis Ticks and Labels */}
      {yTicks.map((tick, i) => (
        <g key={`y-tick-${i}`}>
          <line x1={padding - 5} y1={tick.y} x2={padding} y2={tick.y} className="axis-line" />
          <text x={padding - 10} y={tick.y} dy="0.3em" textAnchor="end" className="axis-label">
            {tick.val}
          </text>
        </g>
      ))}

      {/* X Axis Ticks and Labels */}
      {xTicks.map((tick, i) => (
        <g key={`x-tick-${i}`}>
          <line x1={tick.x} y1={effectiveSvgHeight - padding} x2={tick.x} y2={effectiveSvgHeight - padding + 5} className="axis-line" />
          <text x={tick.x} y={effectiveSvgHeight - padding + 15} textAnchor="middle" className="axis-label">
            {tick.val}
          </text>
        </g>
      ))}

      {/* Data Line */}
      <polyline points={linePath} style={{ stroke: color, fill: 'none', strokeWidth: 2 }} className="data-line" />

      {/* X Axis Label */}
      {xAxisLabel && (
        <text x={effectiveSvgWidth / 2} y={effectiveSvgHeight - 5} textAnchor="middle" className="axis-label">
          {xAxisLabel}
        </text>
      )}
      {/* Y Axis Label */}
      {yAxisLabel && (
        <text
          transform={`translate(10, ${effectiveSvgHeight / 2}) rotate(-90)`}
          textAnchor="middle"
          className="axis-label y-axis-label"
        >
          {yAxisLabel} {yAxisUnit && `(${yAxisUnit})`}
        </text>
      )}
    </svg>
  );
};

export default BasicGraph;