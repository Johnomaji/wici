"use client";

import { CLUSTER, GENERATORS_MAP, HERO, HUB } from "@/lib/data";
import ClusterMap from "../ClusterMap";
import type { StepProps } from "../Demo";
import { Logo } from "../Demo";
import { Button, Card, Eyebrow } from "../ui";

const FLOW = ["See", "Separate", "Move", "Aggregate", "Match", "Measure"];

export default function Overview({ onNext, goTo }: StepProps) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="flex flex-col justify-center gap-6 py-4">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <Eyebrow className="text-sage">STS@10 Eco-Innovation · Live pilot demo</Eyebrow>
        </div>
        <h1 className="text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-forest">
          Follow one hotel&apos;s waste from the bin to a buyer.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          We follow <b className="text-forest">{HERO.name}</b>, one of {CLUSTER.generators} generators in our{" "}
          {CLUSTER.name}, through the six functions of the WICI system. Then we zoom out to the whole cluster.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((f, i) => (
            <div key={f} className="flex items-center gap-2">
              <span className="rounded-lg bg-forest px-3 py-1.5 text-xs font-bold tracking-wider text-cream uppercase">
                <span className="mr-1.5 text-lime">0{i + 1}</span>
                {f}
              </span>
              {i < FLOW.length - 1 && <span className="text-sage">→</span>}
            </div>
          ))}
        </div>

        <div className="grid max-w-xl grid-cols-4 gap-3">
          {[
            [CLUSTER.generators, "generators"],
            [CLUSTER.offtakers, "offtakers"],
            [CLUSTER.logisticsPartners, "logistics partners"],
            [CLUSTER.trucksOwned, "trucks owned"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-line bg-white px-3 py-3">
              <div className="tabular text-2xl font-extrabold text-forest">{v}</div>
              <div className="text-xs text-muted">{l}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={onNext} className="px-6 py-3 text-base">
            Start walkthrough →
          </Button>
          <Button variant="ghost" onClick={() => goTo(6)} className="px-5 py-3 text-base">
            Jump to dashboard
          </Button>
        </div>
      </div>

      <Card className="flex min-h-[360px] flex-col p-3">
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Eyebrow>{CLUSTER.name}</Eyebrow>
          <span className="text-xs text-muted">
            Month {CLUSTER.month} of {CLUSTER.totalMonths}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl">
          <ClusterMap>
            {GENERATORS_MAP.map((g, i) => {
              const hero = g.name === HERO.name;
              return (
                <g key={g.name} className="pop" style={{ animationDelay: `${i * 60}ms` }}>
                  {hero && <circle cx={g.x} cy={g.y} r="7" fill="#d9ac52" className="pulse-ring" />}
                  <circle
                    cx={g.x}
                    cy={g.y}
                    r={hero ? 8 : 5.5}
                    fill={hero ? "#d9ac52" : "#174034"}
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <title>{`${g.name} · ${g.type}`}</title>
                  </circle>
                </g>
              );
            })}
            <g>
              <rect x={HUB.x - 9} y={HUB.y - 9} width="18" height="18" rx="4" fill="#508260" stroke="#fff" strokeWidth="2" />
              <text x={HUB.x} y={HUB.y + 24} textAnchor="middle" className="fill-forest text-[10px] font-bold">
                {HUB.name}
              </text>
            </g>
            <g>
              <rect x="70" y="222" width="122" height="22" rx="6" fill="#13241f" />
              <text x="131" y="237" textAnchor="middle" className="fill-[#f8f5ee] text-[10.5px] font-bold">
                {HERO.name}
              </text>
            </g>
          </ClusterMap>
        </div>
        <div className="flex items-center gap-5 px-2 pt-2.5 pb-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Waste generator
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Today&apos;s focus
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-sage" /> Aggregation point (partner-owned)
          </span>
        </div>
      </Card>
    </div>
  );
}
