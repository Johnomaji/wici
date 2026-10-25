"use client";

import { useState } from "react";

// Small dependency-free SVG charts. Single series each; the card title names the series.

type Pt = { label: string; value: number };

const W = 480;

export function LineChart({
  data,
  height = 170,
  color = "#174034",
  unit = "",
  target,
  targetLabel,
  max,
}: {
  data: Pt[];
  height?: number;
  color?: string;
  unit?: string;
  target?: number;
  targetLabel?: string;
  max?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 34, r: 16, t: 14, b: 24 };
  const top = max ?? Math.ceil((Math.max(...data.map((d) => d.value), target ?? 0) * 1.15) / 5) * 5;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1);
  const y = (v: number) => pad.t + (1 - v / top) * (height - pad.t - pad.b);
  const ticks = [0, top / 2, top];
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${path} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const step = (W - pad.l - pad.r) / (data.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="block w-full overflow-visible" onMouseLeave={() => setHover(null)}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#ebe7dc" />
          <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular">
            {Math.round(t)}
            {unit}
          </text>
        </g>
      ))}
      {target !== undefined && (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="#b4452f" strokeDasharray="5 4" strokeWidth="1.5" />
          <text x={pad.l + 6} y={y(target) + 14} textAnchor="start" className="fill-alert text-[10px] font-bold">
            {targetLabel}
          </text>
        </g>
      )}
      <path d={area} fill={color} opacity="0.08" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label}>
          <text x={x(i)} y={height - 6} textAnchor="middle" className="fill-muted text-[10px]">
            {d.label}
          </text>
          <circle cx={x(i)} cy={y(d.value)} r={hover === i ? 5.5 : 4} fill={color} stroke="#fff" strokeWidth="2" />
          {(i === data.length - 1 || i === 0) && hover === null && (
            <text x={x(i)} y={y(d.value) - 10} textAnchor="middle" className="fill-ink text-[11px] font-bold tabular">
              {d.value}
              {unit}
            </text>
          )}
          <rect
            x={x(i) - step / 2}
            y={0}
            width={step}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        </g>
      ))}
      {hover !== null && (
        <g pointerEvents="none">
          <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="#13241f" strokeOpacity="0.25" />
          <Tip x={x(hover)} y={y(data[hover].value) - 12} text={`${data[hover].label}: ${data[hover].value}${unit}`} />
        </g>
      )}
    </svg>
  );
}

export function BarChart({
  data,
  height = 190,
  color = "#174034",
  unit = "",
  format = (v: number) => `${v}`,
}: {
  data: Pt[];
  height?: number;
  color?: string;
  unit?: string;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 30, r: 8, t: 18, b: 24 };
  const top = Math.ceil((Math.max(...data.map((d) => d.value)) * 1.15) / 5) * 5;
  const band = (W - pad.l - pad.r) / data.length;
  const bw = Math.min(46, band * 0.6);
  const y = (v: number) => pad.t + (1 - v / top) * (height - pad.t - pad.b);
  const ticks = [0, top / 2, top];

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="block w-full overflow-visible" onMouseLeave={() => setHover(null)}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#ebe7dc" />
          <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular">
            {Math.round(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = pad.l + band * i + band / 2;
        const h = y(0) - y(d.value);
        const r = Math.min(4, h / 2);
        const x0 = cx - bw / 2;
        const y0 = y(d.value);
        return (
          <g key={d.label} onMouseEnter={() => setHover(i)}>
            <path
              d={`M${x0},${y(0)} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} L${x0 + bw - r},${y0} Q${x0 + bw},${y0} ${x0 + bw},${y0 + r} L${x0 + bw},${y(0)} Z`}
              fill={color}
              opacity={hover === null || hover === i ? 1 : 0.45}
              className="transition-opacity"
            />
            {(i === data.length - 1 || hover === i) && (
              <text x={cx} y={y0 - 6} textAnchor="middle" className="fill-ink text-[11px] font-bold tabular">
                {format(d.value)}
                {unit}
              </text>
            )}
            <text x={cx} y={height - 6} textAnchor="middle" className="fill-muted text-[10px]">
              {d.label}
            </text>
            <rect x={pad.l + band * i} y={0} width={band} height={height} fill="transparent" />
          </g>
        );
      })}
    </svg>
  );
}

function Tip({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6.6 + 14;
  const tx = Math.max(2, Math.min(W - w - 2, x - w / 2));
  return (
    <g>
      <rect x={tx} y={y - 22} width={w} height={20} rx="5" fill="#13241f" />
      <text x={tx + w / 2} y={y - 8} textAnchor="middle" className="fill-[#f8f5ee] text-[11px] font-semibold tabular">
        {text}
      </text>
    </g>
  );
}
