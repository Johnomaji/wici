"use client";

import {
  ACTIVE_GENERATORS,
  CLUSTER,
  CONTAMINATION_PCT,
  DIVERTED_BY_MATERIAL,
  DIVERTED_T,
  MONTHS,
  UNIT_ECONOMICS,
  VALIDATION,
  material,
  nairaShort,
} from "@/lib/data";
import { BarChart, LineChart } from "../charts";
import { Card, Eyebrow, Swatch } from "../ui";

const PHASES = [
  { months: "Months 1–3", name: "Design and test", from: 1, to: 3 },
  { months: "Months 4–6", name: "Run and measure", from: 4, to: 6 },
  { months: "Months 7–12", name: "Improve and decide", from: 7, to: 12 },
];

export default function Measure() {
  const totalT = DIVERTED_T.reduce((a, b) => a + b, 0);
  const maxMat = Math.max(...DIVERTED_BY_MATERIAL.map((d) => d.t));
  const margin = UNIT_ECONOMICS.revenuePerT - UNIT_ECONOMICS.costPerT;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Timeline */}
      <div className="flex items-stretch gap-1.5">
        {PHASES.map((p) => {
          const span = p.to - p.from + 1;
          const filled = Math.max(0, Math.min(span, CLUSTER.month - p.from + 1));
          return (
            <div key={p.name} className="relative overflow-hidden rounded-lg bg-white px-3 py-1.5 ring-1 ring-line" style={{ flex: span }}>
              <div className="absolute inset-y-0 left-0 bg-lime/35" style={{ width: `${(filled / span) * 100}%` }} />
              <div className="relative flex items-baseline gap-2">
                <span className="text-[0.65rem] font-bold tracking-wider text-sage uppercase">{p.months}</span>
                <span className="text-xs font-semibold text-forest">{p.name}</span>
                {CLUSTER.month === p.to && (
                  <span className="ml-auto text-[0.65rem] font-bold text-forest">● We are here: Month {CLUSTER.month}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Diverted from landfill" value={`${totalT.toFixed(1)} t`} sub="since Month 1" dark />
        <Kpi label="Generators active" value={`${ACTIVE_GENERATORS.at(-1)}`} sub="target 10–20" />
        <Kpi label="Paying generators" value="12 / 14" sub="86% conversion" />
        <Kpi label="Contamination" value={`${CONTAMINATION_PCT.at(-1)}%`} sub={`down from ${CONTAMINATION_PCT[0]}% in Month 1`} />
        <Kpi label="Batches accepted" value="94%" sub="on first buyer inspection" />
      </div>

      {/* Charts */}
      <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Tonnes diverted per month</Eyebrow>
            <span className="text-xs text-muted">t</span>
          </div>
          <div className="mt-2">
            <BarChart data={MONTHS.map((m, i) => ({ label: m, value: DIVERTED_T[i] }))} format={(v) => v.toFixed(1)} height={160} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Average contamination</Eyebrow>
            <span className="text-xs text-muted">% by weight</span>
          </div>
          <div className="mt-2">
            <LineChart
              data={MONTHS.map((m, i) => ({ label: m, value: CONTAMINATION_PCT[i] }))}
              unit="%"
              target={10}
              targetLabel="Buyer limit 10%"
              max={30}
              height={160}
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Diverted by material</Eyebrow>
            <span className="text-xs text-muted">tonnes, cumulative</span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {DIVERTED_BY_MATERIAL.map((d) => (
              <li key={d.material} className="text-sm" title={`${material(d.material).label}: ${d.t} t`}>
                <div className="mb-1 flex items-center gap-2">
                  <Swatch id={d.material} />
                  <span className="flex-1">{material(d.material).short}</span>
                  <span className="tabular font-semibold">{d.t} t</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-mist">
                  <div className="h-full rounded-full" style={{ width: `${(d.t / maxMat) * 100}%`, background: material(d.material).color }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Validation + economics */}
      <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-4">
          <Eyebrow>What the pilot set out to validate</Eyebrow>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
            {VALIDATION.map((v) => (
              <li key={v.q} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    v.status === "proven" ? "bg-sage text-white" : "bg-gold/30 text-[#7a5a12]"
                  }`}
                  aria-label={v.status === "proven" ? "Evidence in" : "In progress"}
                >
                  {v.status === "proven" ? "✓" : "◐"}
                </span>
                <div>
                  <div className="text-sm font-bold text-forest">{v.q}</div>
                  <div className="text-xs text-muted">
                    {v.evidence}
                    {v.status === "progress" && <b className="ml-1 text-[#7a5a12]">· in progress</b>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card dark className="p-4">
          <Eyebrow className="text-lime!">Unit economics per tonne</Eyebrow>
          <div className="mt-3 space-y-2 text-sm">
            <Row k="Revenue (materials + service fees)" v={nairaShort(UNIT_ECONOMICS.revenuePerT)} />
            <Row k="Cost (logistics, handling, field ops)" v={`−${nairaShort(UNIT_ECONOMICS.costPerT)}`} />
            <div className="flex items-baseline justify-between border-t border-white/15 pt-2">
              <span className="font-semibold">Contribution margin</span>
              <span className="tabular text-xl font-extrabold text-lime">+{nairaShort(margin)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-mist/70">
            No carbon-credit revenue assumed. This evidence decides where the first aggregation centre pays off.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, dark = false }: { label: string; value: string; sub: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${dark ? "bg-forest text-cream" : "border border-line/70 bg-white"}`}>
      <div className={`text-xs font-semibold ${dark ? "text-mist/80" : "text-muted"}`}>{label}</div>
      <div className={`tabular mt-1 text-[1.75rem] leading-none font-extrabold ${dark ? "text-lime" : "text-forest"}`}>{value}</div>
      <div className={`mt-1 text-xs ${dark ? "text-mist/70" : "text-muted"}`}>{sub}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-mist/80">{k}</span>
      <span className="tabular font-semibold">{v}</span>
    </div>
  );
}
