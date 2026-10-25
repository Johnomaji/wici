"use client";

import { useEffect, useState } from "react";
import { HUB, LOTS, NEW_LOT, STOCK, material, type Lot } from "@/lib/data";
import type { StepProps } from "../Demo";
import { Button, Card, Eyebrow, Pill, Swatch } from "../ui";

type Phase = "idle" | "weighing" | "done";

export default function Aggregate({ onNext }: StepProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reading, setReading] = useState(0);

  useEffect(() => {
    if (phase !== "weighing") return;
    if (reading >= NEW_LOT.kg) {
      const t = setTimeout(() => setPhase("done"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setReading((r) => Math.min(NEW_LOT.kg, r + Math.max(1, Math.round((NEW_LOT.kg - r) / 6)))), 45);
    return () => clearTimeout(t);
  }, [phase, reading]);

  // Newest lot first
  const ordered: Lot[] = phase === "done" ? [NEW_LOT, ...[...LOTS].reverse()] : [...LOTS].reverse();
  const stock = STOCK.map((s) => (s.material === NEW_LOT.material && phase === "done" ? { ...s, kg: s.kg + NEW_LOT.kg } : s));
  const petReady = phase === "done";

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.3fr]">
      <div className="flex min-h-0 flex-col gap-5">
        {/* Scale */}
        <Card dark className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Eyebrow className="text-lime!">Weighbridge · {HUB.name}</Eyebrow>
            <span className="text-xs text-mist/70">Incoming: {NEW_LOT.generator}</span>
          </div>
          <div className="flex items-end justify-between gap-4 rounded-xl bg-night px-5 py-4">
            <div>
              <div className="text-xs text-mist/60">{material(NEW_LOT.material).label}</div>
              <div className="tabular font-mono text-[3.2rem] leading-none font-bold text-lime">
                {(phase === "idle" ? 0 : reading).toFixed(1)}
                <span className="ml-2 text-xl text-mist/60">kg</span>
              </div>
            </div>
            {phase === "done" && (
              <div className="fade-up text-right text-sm">
                <div>
                  Contamination <b className="tabular">{NEW_LOT.contamination}%</b>
                </div>
                <div className="mt-1">
                  <Pill tone="lime">Grade {NEW_LOT.grade}</Pill>
                </div>
              </div>
            )}
          </div>
          {phase === "idle" ? (
            <Button variant="lime" onClick={() => setPhase("weighing")} className="py-3 text-base">
              ⚖ Record weigh-in
            </Button>
          ) : phase === "weighing" ? (
            <div className="py-3 text-center text-sm text-mist/70">Weighing and grading…</div>
          ) : (
            <div className="fade-up text-center text-sm text-mist/80">
              Lot <b className="text-cream">{NEW_LOT.id}</b> logged, photographed and linked to {NEW_LOT.generator}.
            </div>
          )}
        </Card>

        {/* Stock */}
        <Card className="flex-1">
          <div className="flex items-center justify-between">
            <Eyebrow>Stock vs. sale-ready batch size</Eyebrow>
          </div>
          <ul className="mt-4 space-y-4">
            {stock.map((s) => {
              const pct = Math.min(100, (s.kg / s.threshold) * 100);
              const ready = s.kg >= s.threshold;
              return (
                <li key={s.material}>
                  <div className="mb-1.5 flex items-center gap-2 text-sm">
                    <Swatch id={s.material} />
                    <span className="flex-1 font-medium">{material(s.material).short}</span>
                    <span className="tabular text-xs text-muted">
                      <b className="text-ink">{s.kg.toLocaleString()}</b> / {s.threshold.toLocaleString()} kg
                    </span>
                    {ready && <Pill tone="forest" className="fade-up">Batch ready</Pill>}
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-mist">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: material(s.material).color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="flex min-h-0 flex-col gap-5">
        <Card className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between">
            <Eyebrow>Today&apos;s weigh-in log</Eyebrow>
            <span className="text-xs text-muted">{ordered.length} lots · every lot traceable to source</span>
          </div>
          <div className="mt-3 min-h-0 flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="pb-2 font-semibold">Lot</th>
                  <th className="pb-2 font-semibold">Time</th>
                  <th className="pb-2 font-semibold">Generator</th>
                  <th className="pb-2 font-semibold">Material</th>
                  <th className="pb-2 text-right font-semibold">Weight</th>
                  <th className="pb-2 text-right font-semibold">Contam.</th>
                  <th className="pb-2 text-center font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((l) => {
                  const fresh = l.id === NEW_LOT.id;
                  return (
                    <tr key={l.id} className={`border-t border-line/70 ${fresh ? "fade-up bg-lime/20" : ""}`}>
                      <td className="tabular py-2.5 font-mono text-xs">{l.id}</td>
                      <td className="tabular py-2.5 text-muted">{l.time}</td>
                      <td className="py-2.5 font-medium">{l.generator}</td>
                      <td className="py-2.5">
                        <span className="flex items-center gap-2">
                          <Swatch id={l.material} />
                          {material(l.material).short}
                        </span>
                      </td>
                      <td className="tabular py-2.5 text-right font-semibold">{l.kg} kg</td>
                      <td className={`tabular py-2.5 text-right ${l.contamination > 10 ? "font-semibold text-alert" : ""}`}>
                        {l.contamination}%
                      </td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                            l.grade === "A" ? "bg-forest text-cream" : l.grade === "B" ? "bg-mist text-forest" : "bg-alert/15 text-alert"
                          }`}
                        >
                          {l.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-line pt-3 text-xs text-muted">
            <span>
              <b className="text-ink">Grade A</b> ≤ 5% contamination
            </span>
            <span>
              <b className="text-ink">B</b> ≤ 10%
            </span>
            <span>
              <b className="text-ink">C</b> &gt; 10%: sent back with feedback to the generator
            </span>
          </div>
        </Card>

        <Card
          className={`flex items-center justify-between gap-4 transition ${petReady ? "border-forest! ring-2 ring-lime" : "opacity-60"}`}
        >
          <div>
            <div className="text-sm font-bold text-forest">
              {petReady ? "PET batch PET-0612 is ready: 1,536 kg, Grade A" : "PET batch: 90 kg short of sale size"}
            </div>
            <div className="text-xs text-muted">14 lots from 9 generators, consolidated to buyer specification</div>
          </div>
          <Button onClick={onNext} disabled={!petReady}>
            Find a buyer →
          </Button>
        </Card>
      </div>
    </div>
  );
}
