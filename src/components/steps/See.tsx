"use client";

import { useEffect, useState } from "react";
import { BASELINE, DETECTIONS, HERO, MATERIALS, REVIEW_OPTIONS, material, type MaterialId } from "@/lib/data";
import type { StepProps } from "../Demo";
import { Button, Card, Eyebrow, Pill, Swatch } from "../ui";
import WasteScene from "../WasteScene";

type Phase = "idle" | "scanning" | "revealing" | "review" | "verified";

export default function See({ onNext }: StepProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [choice, setChoice] = useState<(typeof REVIEW_OPTIONS)[number] | null>(null);
  const corrected: MaterialId | null = choice?.material ?? null;

  useEffect(() => {
    if (phase === "scanning") {
      const t = setTimeout(() => setPhase("revealing"), 1500);
      return () => clearTimeout(t);
    }
    if (phase === "revealing") {
      if (revealed >= DETECTIONS.length) {
        const t = setTimeout(() => setPhase("review"), 300);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setRevealed((r) => r + 1), 180);
      return () => clearTimeout(t);
    }
  }, [phase, revealed]);

  const flagged = DETECTIONS.find((d) => d.needsReview)!;
  const effectiveMaterial = (id: number, m: MaterialId) => (id === flagged.id && corrected ? corrected : m);

  const colorFor = (d: (typeof DETECTIONS)[number]) => {
    if (d.needsReview && !corrected) return "#d9ac52";
    return material(effectiveMaterial(d.id, d.material)).color;
  };

  const run = () => {
    setRevealed(0);
    setChoice(null);
    setPhase("scanning");
  };

  const shown = DETECTIONS.slice(0, revealed);
  const total = Object.values(BASELINE).reduce((a, b) => a + b, 0);
  const recoverable = total - BASELINE.residual;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
      {/* Photo */}
      <Card className="flex min-h-0 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Eyebrow>Field capture · Bin 03, main kitchen</Eyebrow>
            <div className="mt-0.5 text-sm text-muted">
              {HERO.name} · Day 3 of 7-day baseline audit · 10:42
            </div>
          </div>
          {phase === "idle" && <Pill tone="sand">Unclassified</Pill>}
          {phase === "scanning" && <Pill tone="lime">Classifying…</Pill>}
          {phase === "revealing" && <Pill tone="lime">{revealed} items found</Pill>}
          {phase === "review" && <Pill tone="gold">1 item needs review</Pill>}
          {phase === "verified" && <Pill tone="forest">✓ Verified by field officer</Pill>}
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-night">
          <WasteScene
            detections={DETECTIONS}
            revealed={revealed}
            scanning={phase === "scanning"}
            colorFor={colorFor}
            reviewId={corrected ? null : flagged.id}
            labelFor={(d) => (d.needsReview && choice ? `${material(choice.material).short} · verified ✓` : undefined)}
          />
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-night/35">
              <Button variant="lime" onClick={run} className="px-6 py-3 text-base shadow-lg">
                ◎ Run AI classification
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Model: off-the-shelf vision model + WICI material taxonomy (prototype)</span>
          {phase !== "idle" && phase !== "scanning" && (
            <button type="button" onClick={run} className="font-semibold text-forest hover:underline">
              ↺ Re-run
            </button>
          )}
        </div>
      </Card>

      {/* Right panel */}
      <div className="flex min-h-0 flex-col gap-4">
        {phase !== "verified" ? (
          <>
            <Card className="flex min-h-0 flex-1 flex-col">
              <div className="mb-3 flex items-center justify-between">
                <Eyebrow>Detections</Eyebrow>
                <span className="tabular text-xs text-muted">{shown.length} / {DETECTIONS.length}</span>
              </div>
              {phase === "idle" || phase === "scanning" ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center text-sm text-muted">
                  <div className="text-3xl">📷</div>
                  A field officer photographs the bin.
                  <br />
                  The AI proposes what&apos;s in it. A person confirms.
                </div>
              ) : (
                <ul className="min-h-0 flex-1 space-y-1.5 overflow-auto pr-1">
                  {shown.map((d) => (
                    <li key={d.id} className="fade-up flex items-center gap-3 text-sm">
                      {d.needsReview ? (
                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px] bg-gold" />
                      ) : (
                        <Swatch id={d.material} />
                      )}
                      <span className="w-36 truncate font-medium">{d.label}</span>
                      <span className="w-24 truncate text-xs text-muted">
                        {d.needsReview ? "Uncertain" : material(d.material).short}
                      </span>
                      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                        <span
                          className={`absolute inset-y-0 left-0 rounded-full ${d.confidence < 70 ? "bg-gold" : "bg-sage"}`}
                          style={{ width: `${d.confidence}%` }}
                        />
                      </span>
                      <span className={`tabular w-10 text-right text-xs font-bold ${d.confidence < 70 ? "text-[#8a6410]" : "text-forest"}`}>
                        {d.confidence}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {phase === "review" && (
              <Card className="fade-up border-2 border-gold!">
                <div className="flex items-center justify-between">
                  <Eyebrow className="text-[#8a6410]">Human verification</Eyebrow>
                  <Pill tone="gold">Confidence 58% · below 70% threshold</Pill>
                </div>
                <p className="mt-2 text-sm">
                  The model isn&apos;t sure about item 9. <b>What is it?</b>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {REVIEW_OPTIONS.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => {
                        setChoice(o);
                        setPhase("verified");
                      }}
                      className="rounded-lg border border-line bg-cream px-3 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-mist"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">Every correction is saved and makes the next classification better.</p>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card className="fade-up">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-lg text-white">✓</span>
                <div className="text-sm">
                  <div className="font-bold text-forest">9 items classified · 1 corrected by a person</div>
                  <div className="text-muted">
                    Item 9 relabelled <b>{choice?.label}</b> by field
                    officer T. Bello
                  </div>
                </div>
              </div>
            </Card>

            <Card className="fade-up flex min-h-0 flex-1 flex-col">
              <div className="flex items-baseline justify-between">
                <Eyebrow>Baseline audit result · 7 days</Eyebrow>
                <span className="tabular text-xs text-muted">{total.toLocaleString()} kg / week</span>
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div>
                  <div className="tabular text-[2.4rem] leading-none font-extrabold text-forest">
                    {Math.round((recoverable / total) * 100)}%
                  </div>
                  <div className="mt-1 text-xs text-muted">recoverable today</div>
                </div>
                <div className="text-sm text-muted">
                  Before WICI, all {total.toLocaleString()} kg a week went to landfill as one mixed stream.
                </div>
              </div>

              {/* stacked composition bar */}
              <div className="mt-4 flex h-5 w-full gap-0.5 overflow-hidden rounded-md">
                {MATERIALS.map((m) => (
                  <div
                    key={m.id}
                    title={`${m.label}: ${BASELINE[m.id]} kg`}
                    style={{ width: `${(BASELINE[m.id] / total) * 100}%`, background: m.color }}
                  />
                ))}
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5 text-sm">
                {MATERIALS.map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <Swatch id={m.id} />
                    <span className="flex-1 truncate">{m.short}</span>
                    <span className="tabular font-semibold">{BASELINE[m.id]} kg</span>
                    <span className="tabular w-9 text-right text-xs text-muted">
                      {Math.round((BASELINE[m.id] / total) * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl bg-sand/60 px-3.5 py-2.5 text-sm">
                <b className="text-forest">Biggest opportunity:</b> organics are {Math.round((BASELINE.organics / total) * 100)}% of
                this hotel&apos;s waste. A green bin in the kitchen and a composting partner take{" "}
                {BASELINE.organics} kg a week out of landfill.
              </div>
              <div className="mt-auto flex justify-end pt-3">
                <Button onClick={onNext}>Design segregation plan →</Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
