"use client";

import { useState } from "react";
import { HERO, HERO_COMMERCIALS, HERO_CONTAMINATION, ONBOARDING, STREAMS, naira } from "@/lib/data";
import { LineChart } from "../charts";
import { Card, Check, Eyebrow, Pill } from "../ui";

export default function Separate() {
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(ONBOARDING.map((o) => [o.id, o.done])),
  );
  const complete = Object.values(done).filter(Boolean).length;
  const all = complete === ONBOARDING.length;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex min-h-0 flex-col gap-5">
        {/* Generator profile */}
        <Card className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mist text-2xl">🏨</div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold text-forest">{HERO.name}</div>
            <div className="text-sm text-muted">
              {HERO.type} · {HERO.area} · onboarded {HERO.onboarded}
            </div>
          </div>
          <div className="text-right">
            <div className="tabular text-xl font-extrabold text-forest">{HERO.weeklyKg.toLocaleString()} kg</div>
            <div className="text-xs text-muted">waste per week</div>
          </div>
        </Card>

        {/* Before / after */}
        <Card className="flex min-h-0 flex-1 flex-col">
          <Eyebrow>From one mixed stream to three clean ones</Eyebrow>
          <div className="mt-4 grid flex-1 grid-cols-[auto_auto_1fr] items-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <Bin color="#6f6d66" label="Mixed" />
              <div className="text-center text-xs text-muted">
                Before
                <br />
                <b className="text-ink">1,050 kg → landfill</b>
              </div>
            </div>
            <div className="text-3xl text-sage">→</div>
            <div className="grid grid-cols-3 gap-3">
              {STREAMS.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-cream/60 p-3 text-center">
                  <Bin color={s.color} label={s.bin.split(" ")[0]} />
                  <div className="text-sm font-bold text-forest">{s.name}</div>
                  <div className="tabular text-lg font-extrabold">{s.kgWeek} kg/wk</div>
                  <div className="text-xs text-muted">{s.contents}</div>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {s.points.map((p) => (
                      <Pill key={p} tone="mist" className="text-[0.65rem]!">
                        {p}
                      </Pill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
            <div>
              <div className="tabular text-xl font-extrabold text-forest">914 kg</div>
              <div className="text-xs text-muted">recoverable per week, was 0</div>
            </div>
            <div>
              <div className="tabular text-xl font-extrabold text-forest">6</div>
              <div className="text-xs text-muted">collection points mapped</div>
            </div>
            <div>
              <div className="tabular text-xl font-extrabold text-forest">2 days</div>
              <div className="text-xs text-muted">from audit to live bins</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex min-h-0 flex-col gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <Eyebrow>Onboarding checklist</Eyebrow>
            <Pill tone={all ? "forest" : "sand"}>
              {complete}/{ONBOARDING.length} {all ? "· Live" : "complete"}
            </Pill>
          </div>
          <ul className="mt-3 space-y-1">
            {ONBOARDING.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setDone((d) => ({ ...d, [o.id]: !d[o.id] }))}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-mist/60"
                >
                  <Check done={done[o.id]} />
                  <span className={`flex-1 text-sm font-medium ${done[o.id] ? "text-forest" : ""}`}>{o.label}</span>
                  <span className="text-xs text-muted">{o.detail}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex-1">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Contamination in dry recyclables</Eyebrow>
            <span className="text-xs font-semibold text-sage">↓ 73% in 6 weeks</span>
          </div>
          <div className="mt-2">
            <LineChart
              data={HERO_CONTAMINATION.map((v, i) => ({ label: `Wk ${i + 1}`, value: v }))}
              unit="%"
              target={10}
              targetLabel="Buyer limit 10%"
              max={30}
              height={150}
            />
          </div>
        </Card>

        <Card dark className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-mist/70">The generator pays for this</div>
            <div className="mt-1 text-sm">
              Assessment <b className="tabular">{naira(HERO_COMMERCIALS.assessmentFee)}</b> · Service{" "}
              <b className="tabular">{naira(HERO_COMMERCIALS.monthlyFee)}/mo</b>
            </div>
          </div>
          <Pill tone="lime">Paying customer</Pill>
        </Card>
      </div>
    </div>
  );
}

function Bin({ color, label }: { color: string; label: string }) {
  return (
    <svg viewBox="0 0 60 70" className="h-20 w-16" aria-hidden>
      <rect x="6" y="8" width="48" height="8" rx="3" fill={color} />
      <rect x="22" y="3" width="16" height="6" rx="2" fill={color} />
      <path d="M10,18 L50,18 L46,66 Q46,68 44,68 L16,68 Q14,68 14,66 Z" fill={color} opacity="0.9" />
      <path d="M22,26 L23,60 M30,26 L30,60 M38,26 L37,60" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
      <title>{label}</title>
    </svg>
  );
}
