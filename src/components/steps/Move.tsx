"use client";

import { useEffect, useState } from "react";
import { CLUSTER, DAYS, HUB, PARTNERS, SCHEDULE, STOPS, type PartnerId } from "@/lib/data";
import ClusterMap from "../ClusterMap";
import { Button, Card, Eyebrow, Pill } from "../ui";

const partner = (id: PartnerId) => PARTNERS.find((p) => p.id === id)!;
const STATUS_BASE = ["collected", "collected", "en route", "scheduled", "scheduled"] as const;
type Disruption = "none" | "reassigning" | "rerouted";

export default function Move() {
  const [disruption, setDisruption] = useState<Disruption>("none");

  useEffect(() => {
    if (disruption !== "reassigning") return;
    const t = setTimeout(() => setDisruption("rerouted"), 1400);
    return () => clearTimeout(t);
  }, [disruption]);

  // Stops 4 and 5 are tricycle #2's run: affected by the breakdown
  const stops = STOPS.map((s, i) => {
    const affected = i >= 3;
    const p: PartnerId = affected && disruption === "rerouted" ? "greenroute" : s.partner;
    const status =
      affected && disruption === "reassigning" ? "reassigning" : affected && disruption === "rerouted" ? "rerouted" : STATUS_BASE[i];
    return { ...s, partner: p, status, affected };
  });

  const routeA = stops.slice(0, 3);
  const routeB = stops.slice(3);
  const line = (pts: { x: number; y: number }[]) =>
    [...pts, HUB].map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex min-h-0 flex-col gap-5">
        <Card>
          <Eyebrow>Weekly collection schedule · {stops[0].name}</Eyebrow>
          <table className="mt-3 w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="w-32 pb-2 text-left font-semibold">Stream</th>
                {DAYS.map((d) => (
                  <th key={d} className={`pb-2 font-semibold ${d === "Tue" ? "text-forest" : ""}`}>
                    {d}
                    {d === "Tue" && <span className="ml-1 text-[0.6rem] text-sage">today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((row) => (
                <tr key={row.stream} className="border-t border-line/70">
                  <td className="py-2.5">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                      {row.stream}
                    </span>
                  </td>
                  {DAYS.map((d) => {
                    const pid = row.days[d];
                    return (
                      <td key={d} className={`px-0.5 py-2 text-center ${d === "Tue" ? "bg-mist/50" : ""}`}>
                        {pid && (
                          <span
                            className="inline-block w-full truncate rounded-md px-1 py-1 text-[0.65rem] font-bold text-white"
                            style={{ background: partner(pid).color }}
                            title={partner(pid).name}
                          >
                            {partner(pid).name.split(" ")[0]}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between">
            <Eyebrow>Logistics partners</Eyebrow>
            <Pill tone="lime">WICI owns {CLUSTER.trucksOwned} trucks</Pill>
          </div>
          <ul className="mt-3 space-y-2.5">
            {PARTNERS.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full" style={{ background: p.color }} />
                <div className="flex-1">
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted">{p.kind}</div>
                </div>
                {p.id === "greenroute" && disruption === "rerouted" && <Pill tone="gold">Covering backup run</Pill>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            WICI coordinates schedules and routes. Partners keep their vehicles and earn more from fuller, more predictable runs.
          </p>
        </Card>
      </div>

      <Card className="flex min-h-0 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Eyebrow>Today · Tuesday dry-recyclables run</Eyebrow>
            <div className="text-sm text-muted">5 stops · {stops.reduce((a, s) => a + s.kg, 0)} kg expected</div>
          </div>
          {disruption === "none" ? (
            <Button variant="ghost" onClick={() => setDisruption("reassigning")} className="py-1.5! text-xs">
              ⚠ Simulate breakdown
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setDisruption("none")} className="py-1.5! text-xs">
              ↺ Reset
            </Button>
          )}
        </div>

        {disruption !== "none" && (
          <div
            className={`fade-up rounded-xl px-3.5 py-2.5 text-sm ${
              disruption === "reassigning" ? "bg-alert/10 text-alert" : "bg-mist text-forest"
            }`}
          >
            {disruption === "reassigning" ? (
              <>
                <b>Island Pickers tricycle #2 broke down.</b> Finding the next available partner…
              </>
            ) : (
              <>
                <b>Rerouted automatically.</b> GreenRoute PSP picks up stops 4 and 5 · ETA +35 min · no missed pickups.
              </>
            )}
          </div>
        )}

        <div className="min-h-[200px] flex-1 overflow-hidden rounded-xl">
          <ClusterMap>
            <path d={line(routeA)} fill="none" stroke={partner("pickers").color} strokeWidth="3.5" strokeDasharray="8 5" />
            <path
              d={line(routeB)}
              fill="none"
              stroke={disruption === "reassigning" ? "#b4452f" : partner(routeB[0].partner).color}
              strokeWidth="3.5"
              strokeDasharray="8 5"
              className="transition-all"
            />
            <rect x={HUB.x - 10} y={HUB.y - 10} width="20" height="20" rx="4" fill="#508260" stroke="#fff" strokeWidth="2" />
            <text x={HUB.x} y={HUB.y + 25} textAnchor="middle" className="fill-forest text-[10px] font-bold">
              {HUB.name}
            </text>
            {stops.map((s, i) => (
              <g key={s.id}>
                {s.status === "en route" && <circle cx={s.x} cy={s.y} r="7" fill="#508260" className="pulse-ring" />}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r="11"
                  fill={s.status === "collected" ? "#508260" : s.status === "reassigning" ? "#b4452f" : "#fff"}
                  stroke={s.status === "reassigning" ? "#b4452f" : partner(s.partner).color}
                  strokeWidth="2.5"
                />
                <text
                  x={s.x}
                  y={s.y + 4}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${s.status === "collected" || s.status === "reassigning" ? "fill-white" : "fill-forest"}`}
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </ClusterMap>
        </div>

        <ul className="grid grid-cols-1 gap-1.5 text-sm">
          {stops.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3">
              <span className="tabular w-5 text-center text-xs font-bold text-muted">{i + 1}</span>
              <span className="flex-1 truncate font-medium">{s.name}</span>
              <span className="tabular w-16 text-right text-xs text-muted">{s.kg} kg</span>
              <span className="w-32 truncate text-xs" style={{ color: partner(s.partner).color }}>
                {partner(s.partner).name}
              </span>
              <StatusPill status={s.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { tone: "mist" | "lime" | "gold" | "alert" | "forest" | "sand"; text: string }> = {
    collected: { tone: "forest", text: "✓ Collected" },
    "en route": { tone: "lime", text: "En route" },
    scheduled: { tone: "sand", text: "Scheduled" },
    reassigning: { tone: "alert", text: "Reassigning…" },
    rerouted: { tone: "gold", text: "Rerouted" },
  };
  const m = map[status];
  return (
    <Pill tone={m.tone} className="w-28 justify-center">
      {m.text}
    </Pill>
  );
}
