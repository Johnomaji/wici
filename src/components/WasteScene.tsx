"use client";

import type { Detection } from "@/lib/data";

// Stylised illustration of a mixed waste bin. Items are drawn inside the same
// boxes the "model" detects, so detections always line up. 640 x 420 viewBox.

function Art({ d }: { d: Detection }) {
  const { w, h } = d.box;
  switch (d.kind) {
    case "bottle":
      return (
        <g>
          <rect x={w * 0.36} y={0} width={w * 0.28} height={h * 0.07} rx="3" fill="#2d7db8" />
          <path
            d={`M${w * 0.38},${h * 0.07} L${w * 0.62},${h * 0.07} L${w * 0.66},${h * 0.2} C${w * 0.92},${h * 0.27} ${w * 0.9},${h * 0.32} ${w * 0.9},${h * 0.38} L${w * 0.9},${h * 0.96} Q${w * 0.9},${h} ${w * 0.8},${h} L${w * 0.2},${h} Q${w * 0.1},${h} ${w * 0.1},${h * 0.96} L${w * 0.1},${h * 0.38} C${w * 0.1},${h * 0.32} ${w * 0.08},${h * 0.27} ${w * 0.34},${h * 0.2} Z`}
            fill="#cfe9f3"
            fillOpacity="0.85"
            stroke="#8fc3d8"
            strokeWidth="1.5"
          />
          <rect x={w * 0.1} y={h * 0.5} width={w * 0.8} height={h * 0.2} fill="#e04f3a" opacity="0.85" />
          <rect x={w * 0.2} y={h * 0.25} width={w * 0.08} height={h * 0.6} rx="3" fill="#fff" opacity="0.5" />
        </g>
      );
    case "bottleFlat":
      return (
        <g>
          <rect x={w * 0.93} y={h * 0.36} width={w * 0.07} height={h * 0.28} rx="2" fill="#2d7db8" />
          <path
            d={`M${w * 0.04},${h * 0.12} L${w * 0.66},${h * 0.12} C${w * 0.78},${h * 0.14} ${w * 0.82},${h * 0.32} ${w * 0.93},${h * 0.36} L${w * 0.93},${h * 0.64} C${w * 0.82},${h * 0.68} ${w * 0.78},${h * 0.86} ${w * 0.66},${h * 0.88} L${w * 0.04},${h * 0.88} Q0,${h * 0.88} 0,${h * 0.78} L0,${h * 0.22} Q0,${h * 0.12} ${w * 0.04},${h * 0.12} Z`}
            fill="#d6eef5"
            fillOpacity="0.85"
            stroke="#8fc3d8"
            strokeWidth="1.5"
          />
          <rect x={w * 0.2} y={h * 0.12} width={w * 0.24} height={h * 0.76} fill="#3a8f4a" opacity="0.8" />
          <rect x={w * 0.06} y={h * 0.24} width={w * 0.5} height={h * 0.08} rx="3" fill="#fff" opacity="0.55" />
        </g>
      );
    case "cardboard":
      return (
        <g>
          <path d={`M0,${h * 0.25} L${w * 0.72},${h * 0.18} L${w},${h * 0.32} L${w * 0.95},${h} L${w * 0.04},${h * 0.95} Z`} fill="#c99d5f" stroke="#9c7440" strokeWidth="1.5" />
          <path d={`M0,${h * 0.25} L${w * 0.25},0 L${w * 0.86},${h * 0.04} L${w * 0.72},${h * 0.18} Z`} fill="#d9b177" stroke="#9c7440" strokeWidth="1.5" />
          <path d={`M${w * 0.72},${h * 0.18} L${w},${h * 0.32} L${w},${h * 0.12} Z`} fill="#b48647" />
          <rect x={w * 0.3} y={h * 0.45} width={w * 0.32} height={h * 0.18} fill="none" stroke="#7a5527" strokeWidth="1.5" />
          <path d={`M${w * 0.34},${h * 0.54} h${w * 0.24}`} stroke="#7a5527" strokeWidth="1.5" />
          <path d={`M${w * 0.12},${h * 0.7} l${w * 0.1},${h * 0.12} M${w * 0.22},${h * 0.7} l-${w * 0.1},${h * 0.12}`} stroke="#7a5527" strokeWidth="1.5" />
        </g>
      );
    case "sachet": {
      const sachets = [
        [0.02, 0.1, -12],
        [0.32, 0.02, 8],
        [0.6, 0.12, -4],
        [0.08, 0.52, 10],
        [0.38, 0.5, -10],
        [0.66, 0.55, 6],
      ];
      return (
        <g>
          {sachets.map(([sx, sy, r], i) => (
            <g key={i} transform={`translate(${w * sx},${h * sy}) rotate(${r} ${w * 0.15} ${h * 0.2})`}>
              <rect width={w * 0.3} height={h * 0.4} rx="4" fill="#f4f8fb" fillOpacity="0.9" stroke="#bcd3e0" strokeWidth="1" />
              <rect x={w * 0.03} y={h * 0.12} width={w * 0.24} height={h * 0.13} rx="2" fill="#2d7db8" opacity="0.7" />
              <path d={`M${w * 0.04},${h * 0.32} h${w * 0.2}`} stroke="#9bb8c8" strokeWidth="1" />
            </g>
          ))}
        </g>
      );
    }
    case "can":
      return (
        <g>
          <rect x={w * 0.1} y={h * 0.08} width={w * 0.8} height={h * 0.86} rx="5" fill="#c0392b" />
          <ellipse cx={w * 0.5} cy={h * 0.09} rx={w * 0.4} ry={h * 0.07} fill="#d9dde0" stroke="#a5abaf" />
          <ellipse cx={w * 0.5} cy={h * 0.09} rx={w * 0.14} ry={h * 0.025} fill="#a5abaf" />
          <rect x={w * 0.1} y={h * 0.86} width={w * 0.8} height={h * 0.08} rx="3" fill="#b8bec2" />
          <rect x={w * 0.22} y={h * 0.2} width={w * 0.1} height={h * 0.6} rx="3" fill="#fff" opacity="0.35" />
          <path d={`M${w * 0.3},${h * 0.5} q${w * 0.2},-${h * 0.12} ${w * 0.4},0`} fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.8" />
        </g>
      );
    case "canSide":
      return (
        <g>
          <rect x={w * 0.08} y={h * 0.1} width={w * 0.84} height={h * 0.8} rx="6" fill="#b9c2c8" />
          <ellipse cx={w * 0.9} cy={h * 0.5} rx={w * 0.07} ry={h * 0.4} fill="#dfe3e6" stroke="#9aa2a7" />
          <rect x={w * 0.25} y={h * 0.1} width={w * 0.35} height={h * 0.8} fill="#2a6f97" />
          <rect x={w * 0.12} y={h * 0.22} width={w * 0.7} height={h * 0.1} rx="3" fill="#fff" opacity="0.45" />
        </g>
      );
    case "organics":
      return (
        <g>
          <ellipse cx={w * 0.5} cy={h * 0.62} rx={w * 0.48} ry={h * 0.36} fill="#6b4a2c" />
          <ellipse cx={w * 0.3} cy={h * 0.5} rx={w * 0.2} ry={h * 0.17} fill="#7d9a3a" />
          <path d={`M${w * 0.52},${h * 0.32} q${w * 0.18},-${h * 0.3} ${w * 0.36},${h * 0.02} q-${w * 0.16},${h * 0.1} -${w * 0.36},-${h * 0.02} Z`} fill="#e6c234" stroke="#b8961c" />
          <circle cx={w * 0.66} cy={h * 0.66} r={h * 0.13} fill="#e8832a" />
          <circle cx={w * 0.66} cy={h * 0.66} r={h * 0.06} fill="#f2a55a" />
          <ellipse cx={w * 0.42} cy={h * 0.78} rx={w * 0.12} ry={h * 0.08} fill="#f1e4c3" />
          <ellipse cx={w * 0.16} cy={h * 0.74} rx={w * 0.08} ry={h * 0.07} fill="#a3c45a" />
          <circle cx={w * 0.84} cy={h * 0.78} r={h * 0.07} fill="#c94a35" />
        </g>
      );
    case "crushed":
      return (
        <g>
          <path
            d={`M${w * 0.2},${h * 0.05} L${w * 0.7},0 L${w * 0.9},${h * 0.22} L${w * 0.75},${h * 0.4} L${w * 0.95},${h * 0.62} L${w * 0.8},${h} L${w * 0.15},${h * 0.95} L${w * 0.05},${h * 0.6} L${w * 0.25},${h * 0.45} L${w * 0.02},${h * 0.25} Z`}
            fill="#e4eef0"
            fillOpacity="0.9"
            stroke="#a8bfc4"
            strokeWidth="1.5"
          />
          <path d={`M${w * 0.25},${h * 0.45} L${w * 0.75},${h * 0.4} M${w * 0.3},${h * 0.2} L${w * 0.6},${h * 0.7}`} stroke="#b9cdd1" strokeWidth="1.2" />
          <rect x={w * 0.25} y={h * 0.55} width={w * 0.45} height={h * 0.14} fill="#7aa2b0" opacity="0.5" transform={`rotate(-8 ${w / 2} ${h / 2})`} />
        </g>
      );
    case "tissue":
      return (
        <g>
          <path
            d={`M${w * 0.1},${h * 0.5} C${w * 0.05},${h * 0.2} ${w * 0.35},${h * 0.05} ${w * 0.5},${h * 0.15} C${w * 0.7},0 ${w * 0.98},${h * 0.2} ${w * 0.9},${h * 0.5} C${w},${h * 0.8} ${w * 0.7},${h} ${w * 0.5},${h * 0.9} C${w * 0.3},${h} 0,${h * 0.85} ${w * 0.1},${h * 0.5} Z`}
            fill="#ece9e1"
            stroke="#c9c4b6"
            strokeWidth="1.5"
          />
          <path d={`M${w * 0.3},${h * 0.4} q${w * 0.15},${h * 0.15} ${w * 0.35},0 M${w * 0.35},${h * 0.65} q${w * 0.12},-${h * 0.1} ${w * 0.3},${h * 0.05}`} fill="none" stroke="#c9c4b6" strokeWidth="1.2" />
          <ellipse cx={w * 0.62} cy={h * 0.55} rx={w * 0.1} ry={h * 0.07} fill="#b79a6a" opacity="0.5" />
        </g>
      );
  }
}

export default function WasteScene({
  detections,
  revealed,
  scanning,
  colorFor,
  reviewId,
  labelFor,
}: {
  detections: Detection[];
  revealed: number;
  scanning: boolean;
  colorFor: (d: Detection) => string;
  reviewId?: number | null;
  labelFor?: (d: Detection) => string | undefined;
}) {
  return (
    <svg viewBox="0 0 640 420" className="block h-full w-full" role="img" aria-label="Photo of a mixed waste bin">
      <defs>
        <radialGradient id="binfloor" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#4b4f45" />
          <stop offset="100%" stopColor="#262a24" />
        </radialGradient>
        <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a9cb72" stopOpacity="0" />
          <stop offset="85%" stopColor="#a9cb72" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a9cb72" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" fill="url(#binfloor)" />
      {/* bits of debris for texture */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 137) % 640} cy={(i * 89) % 420} r={1 + (i % 3)} fill="#5c6157" opacity="0.6" />
      ))}

      {detections.map((d) => (
        <g key={d.id} transform={`translate(${d.box.x},${d.box.y})`}>
          <Art d={d} />
        </g>
      ))}

      {scanning && (
        <g>
          <rect x="0" y="-120" width="640" height="120" fill="url(#scan)">
            <animate attributeName="y" from="-120" to="420" dur="1.4s" repeatCount="indefinite" />
          </rect>
        </g>
      )}

      {detections.slice(0, revealed).map((d) => {
        const c = colorFor(d);
        const review = d.id === reviewId;
        const label = review ? `REVIEW · ${d.confidence}%` : (labelFor?.(d) ?? `${d.label} · ${d.confidence}%`);
        const tw = label.length * 6.4 + 12;
        const ty = d.box.y > 22 ? d.box.y - 20 : d.box.y + d.box.h + 2;
        const tx = Math.min(d.box.x - 2, 640 - tw);
        return (
          <g key={`b${d.id}`} className="pop">
            <rect
              x={d.box.x - 2}
              y={d.box.y - 2}
              width={d.box.w + 4}
              height={d.box.h + 4}
              rx="4"
              fill="none"
              stroke={c}
              strokeWidth="2.5"
              strokeDasharray={review ? "6 4" : undefined}
            />
            <rect x={tx} y={ty} width={tw} height="18" rx="3" fill={c} />
            <text x={tx + 6} y={ty + 13} className="fill-white text-[11px] font-bold">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
