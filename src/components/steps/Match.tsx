"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BATCH, HERO, HUB, OFFTAKERS, evaluateOfftaker, material, naira } from "@/lib/data";
import type { StepProps } from "../Demo";
import { Button, Card, Eyebrow, Pill, Swatch } from "../ui";

type Phase = "idle" | "scoring" | "ranked" | "offered" | "accepted";

export default function Match({ onNext }: StepProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scored, setScored] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const results = useMemo(() => OFFTAKERS.map((o) => ({ o, r: evaluateOfftaker(o) })), []);
  const ranked = useMemo(() => [...results].sort((a, b) => b.r.score - a.r.score), [results]);

  useEffect(() => {
    if (phase === "scoring") {
      if (scored >= OFFTAKERS.length) {
        const t = setTimeout(() => {
          setPhase("ranked");
          setSelected(ranked[0].o.id);
        }, 400);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setScored((s) => s + 1), 380);
      return () => clearTimeout(t);
    }
    if (phase === "offered") {
      const t = setTimeout(() => setPhase("accepted"), 1600);
      return () => clearTimeout(t);
    }
  }, [phase, scored, ranked]);

  const list = phase === "idle" || phase === "scoring" ? results : ranked;
  const chosen = results.find((x) => x.o.id === selected);
  const locked = phase === "offered" || phase === "accepted";

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.4fr]">
      <div className="flex min-h-0 flex-col gap-5">
        <Card>
          <div className="flex items-center justify-between">
            <Eyebrow>Batch for sale</Eyebrow>
            <Pill tone="forest">Grade {BATCH.grade}</Pill>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Swatch id={BATCH.material} size={14} />
            <span className="text-lg font-bold text-forest">
              {BATCH.id} · {material(BATCH.material).label}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Spec k="Weight" v={`${BATCH.kg.toLocaleString()} kg`} />
            <Spec k="Contamination" v={`${BATCH.contamination}%`} />
            <Spec k="Form" v={BATCH.form} />
            <Spec k="Provenance" v={`${BATCH.lots} lots · ${BATCH.generators} generators`} />
          </dl>
          {phase === "idle" && (
            <Button onClick={() => setPhase("scoring")} variant="lime" className="mt-5 w-full py-3 text-base">
              ⇄ Match to offtakers
            </Button>
          )}
        </Card>

        {phase === "accepted" ? (
          <Card className="fade-up flex-1">
            <Eyebrow>Traceability record</Eyebrow>
            <ol className="relative mt-4 space-y-4 border-l-2 border-mist pl-5 text-sm">
              {[
                ["Source", `${HERO.name} + 8 more generators`, "Baseline audit and AI-verified composition"],
                ["Collection", "Island Pickers Co-op, GreenRoute PSP", "14 pickups, on schedule"],
                ["Aggregation", HUB.name, `${BATCH.lots} lots weighed and graded`],
                ["Buyer", chosen?.o.name ?? "", `Accepted at ${naira(chosen?.o.pricePerKg ?? 0)}/kg`],
              ].map(([k, v, d]) => (
                <li key={k} className="relative">
                  <span className="absolute top-1 -left-[1.62rem] h-3 w-3 rounded-full border-2 border-white bg-sage" />
                  <div className="text-[0.65rem] font-bold tracking-wider text-sage uppercase">{k}</div>
                  <div className="font-semibold">{v}</div>
                  <div className="text-xs text-muted">{d}</div>
                </li>
              ))}
            </ol>
          </Card>
        ) : (
          <Card className="flex-1 bg-cream/60">
            <Eyebrow>How we rank buyers</Eyebrow>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <b>1. Hard specs:</b> minimum volume and contamination limit
              </li>
              <li>
                <b>2. Net value:</b> price minus any transport we must arrange
              </li>
              <li>
                <b>3. Reliability:</b> on-time pickup and payment history
              </li>
              <li>
                <b>4. Proximity:</b> fewer kilometres, lower emissions
              </li>
            </ul>
          </Card>
        )}
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Verified offtakers in network · {OFFTAKERS.length}</Eyebrow>
          {phase === "scoring" && <span className="text-xs font-semibold text-sage">Checking specs and pricing…</span>}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {list.map(({ o, r }, idx) => {
            const evaluated = phase !== "idle" && (phase !== "scoring" || OFFTAKERS.indexOf(o) < scored);
            const isSel = selected === o.id;
            const best = phase !== "idle" && phase !== "scoring" && idx === 0;
            return (
              <button
                key={o.id}
                type="button"
                disabled={!evaluated || !r.eligible || locked}
                onClick={() => setSelected(o.id)}
                className={`fade-up flex items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-left transition ${
                  isSel ? "border-forest ring-2 ring-lime" : "border-line/70 hover:border-sage"
                } ${evaluated && !r.eligible ? "opacity-60" : ""} disabled:cursor-default`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest">{o.name}</span>
                    {best && <Pill tone="lime">Best match</Pill>}
                  </div>
                  <div className="text-xs text-muted">
                    {o.kind} · {o.area} · {o.distanceKm} km · {o.collects ? "buyer collects" : "we deliver"}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Req ok={!evaluated ? null : BATCH.kg >= o.minKg}>Min {o.minKg ? `${o.minKg.toLocaleString()} kg` : "none"}</Req>
                    <Req ok={!evaluated ? null : BATCH.contamination <= o.maxContamination}>≤ {o.maxContamination}% contam.</Req>
                    <Req ok={null}>{o.reliability}% on time</Req>
                  </div>
                </div>
                <div className="w-24 text-right">
                  <div className="tabular text-lg font-extrabold">{naira(o.pricePerKg)}</div>
                  <div className="text-xs text-muted">per kg</div>
                </div>
                <div className="w-28 text-right">
                  {!evaluated ? (
                    <span className="text-xs text-muted">—</span>
                  ) : r.eligible ? (
                    <>
                      <div className="tabular text-lg font-extrabold text-forest">{naira(r.net)}</div>
                      <div className="text-xs text-muted">net · score {r.score}</div>
                    </>
                  ) : (
                    <div className="text-xs font-semibold text-alert">{r.issues[0]}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {chosen && phase !== "idle" && phase !== "scoring" && (
          <Card dark className="fade-up flex items-center gap-5">
            <div className="flex-1">
              <div className="text-xs text-mist/70">
                {phase === "accepted" ? "Deal confirmed" : phase === "offered" ? "Offer sent, waiting for buyer…" : "Proposed deal"}
              </div>
              <div className="mt-0.5 text-sm">
                <b>{BATCH.kg.toLocaleString()} kg</b> × {naira(chosen.o.pricePerKg)}/kg to <b>{chosen.o.name}</b>
              </div>
            </div>
            <div className="text-right">
              <div className="tabular text-[1.8rem] leading-none font-extrabold text-lime">{naira(chosen.r.net)}</div>
              <div className="mt-1 text-xs text-mist/70">net material value</div>
            </div>
            {phase === "ranked" && (
              <Button variant="lime" onClick={() => setPhase("offered")}>
                Send offer
              </Button>
            )}
            {phase === "offered" && <span className="h-6 w-6 animate-spin rounded-full border-2 border-lime border-t-transparent" />}
            {phase === "accepted" && (
              <Button variant="lime" onClick={onNext}>
                See cluster impact →
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}

function Req({ ok, children }: { ok: boolean | null; children: ReactNode }) {
  const cls = ok === null ? "bg-cream text-muted" : ok ? "bg-mist text-forest" : "bg-alert/12 text-alert";
  return (
    <span className={`rounded-md px-2 py-0.5 text-[0.7rem] font-semibold ${cls}`}>
      {ok === true && "✓ "}
      {ok === false && "✕ "}
      {children}
    </span>
  );
}
