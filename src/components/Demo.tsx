"use client";

import { useCallback, useEffect, useState } from "react";
import { CLUSTER } from "@/lib/data";
import Overview from "./steps/Overview";
import See from "./steps/See";
import Separate from "./steps/Separate";
import Move from "./steps/Move";
import Aggregate from "./steps/Aggregate";
import Match from "./steps/Match";
import Measure from "./steps/Measure";

export type StepProps = { onNext: () => void; goTo: (i: number) => void };

const STEPS = [
  { key: "overview", label: "Pilot", title: "One cluster, one generator, end to end", proves: "WICI starts with one focused Lagos cluster, not a plant.", C: Overview },
  { key: "see", label: "See", title: "AI-assisted waste audit", proves: "AI does the heavy lifting; people verify. No black box.", C: See },
  { key: "separate", label: "Separate", title: "Source segregation plan", proves: "Generators participate, segregate and pay for the service.", C: Separate },
  { key: "move", label: "Move", title: "Partner-led collection", proves: "Collection runs on existing partners. WICI owns zero trucks.", C: Move },
  { key: "aggregate", label: "Aggregate", title: "Weigh, grade, consolidate", proves: "Every kilo is weighed, graded and traceable to its source.", C: Aggregate },
  { key: "match", label: "Match", title: "Batch-to-buyer matching", proves: "Materials meet buyer specs and turn into revenue.", C: Match },
  { key: "measure", label: "Measure", title: "Cluster impact dashboard", proves: "The pilot produces the evidence to decide where infrastructure pays off.", C: Measure },
];

export default function Demo({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(Math.max(0, Math.min(6, initialStep)));
  const [runId, setRunId] = useState(0);

  const goTo = useCallback((i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i))), []);
  const next = useCallback(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), []);
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);


  // Keyboard + presentation clicker support (clickers send PageDown/PageUp)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") back();
      else if (/^[0-6]$/.test(e.key)) goTo(Number(e.key));
      else if (e.key.toLowerCase() === "d") goTo(6);
      else if (e.key.toLowerCase() === "r") {
        setRunId((r) => r + 1);
        goTo(0);
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back, goTo]);

  const S = STEPS[step];
  const Step = S.C;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-6 bg-night px-6 py-3 text-cream">
        <button type="button" onClick={() => goTo(0)} className="flex items-center gap-3 text-left">
          <Logo />
          <div className="leading-tight">
            <div className="text-[0.95rem] font-extrabold tracking-wide">WICI</div>
            <div className="text-[0.7rem] text-mist/70">Pilot Console</div>
          </div>
        </button>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {STEPS.slice(1).map((s, idx) => {
            const i = idx + 1;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition ${
                    active ? "bg-lime text-night" : done ? "text-lime hover:bg-white/5" : "text-mist/50 hover:bg-white/5 hover:text-mist"
                  }`}
                >
                  <span className="tabular opacity-70">0{i}</span>
                  {s.label}
                </button>
                {i < STEPS.length - 1 && <span className={`mx-0.5 h-px w-4 ${done ? "bg-lime/60" : "bg-white/15"}`} />}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-right">
          <div className="leading-tight">
            <div className="text-xs font-semibold">{CLUSTER.name}</div>
            <div className="text-[0.7rem] text-mist/70">
              Month {CLUSTER.month} of {CLUSTER.totalMonths}
            </div>
          </div>
          <span
            className="rounded-full border border-gold/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold"
            title="All figures are illustrative pilot data, not WICI measurements"
          >
            Illustrative data
          </span>
        </div>
      </header>

      {/* Step content */}
      <main className="min-h-0 flex-1 overflow-auto">
        <div key={`${S.key}-${runId}`} className="fade-up mx-auto flex h-full max-w-[1500px] flex-col px-6 py-5">
          {step > 0 && (
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-sage uppercase">
                0{step} · {S.label}
              </span>
              <h1 className="text-[1.6rem] font-extrabold tracking-tight text-forest">{S.title}</h1>
            </div>
          )}
          <Step onNext={next} goTo={goTo} />
        </div>
      </main>

      {/* Footer */}
      <footer className="flex shrink-0 items-center gap-4 border-t border-line bg-white px-6 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
          <span className="text-[0.65rem] font-bold tracking-widest text-sage uppercase">Proves</span>
          <span className="truncate font-medium text-forest">{S.proves}</span>
        </div>
        <span className="hidden text-[0.7rem] text-muted lg:block">← → to navigate · D dashboard · R reset</span>
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-forest transition hover:bg-mist disabled:opacity-30"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream transition hover:bg-forest-2"
          >
            Next: {STEPS[step + 1].label} →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setRunId((r) => r + 1);
              goTo(0);
            }}
            className="rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream transition hover:bg-forest-2"
          >
            ↺ Restart demo
          </button>
        )}
      </footer>
    </div>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  // The four circles from the deck cover
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="16" cy="12" r="10" fill="#a9cb72" />
      <circle cx="29" cy="15" r="7.5" fill="#d9ac52" />
      <circle cx="14" cy="28" r="9.5" fill="#508260" />
      <circle cx="29" cy="31" r="6" fill="#e6edde" />
    </svg>
  );
}
