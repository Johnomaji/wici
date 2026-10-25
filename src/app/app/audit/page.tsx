"use client";

import { useState } from "react";
import { Field, GENERATOR_TYPES, PageHeader, inputClass } from "@/components/app/form";
import { Button, Card, Pill } from "@/components/ui";

// Adapted from the founder's prototype: a field officer describes the site,
// WICI estimates the streams, and a person verifies. Scripted, no AI call.
const CATEGORIES = [
  { name: "Organics", color: "#4F8A2E", re: /\b(food|organic|scraps?|peels?|leftovers?|kitchen)\b/i, offtaker: "Composters" },
  { name: "Plastics", color: "#2D7DB8", re: /\b(plastics?|pet|bottles?|sachets?|nylon|polythene)\b/i, offtaker: "PET flake processors" },
  { name: "Paper & cardboard", color: "#C08A2B", re: /\b(paper|cardboard|cartons?|boxes|newspapers?)\b/i, offtaker: "Paper balers" },
  { name: "Glass", color: "#3f9c94", re: /\bglass\b/i, offtaker: "Glass aggregators" },
  { name: "Metals", color: "#D0584A", re: /\b(cans|tins?|metal|aluminium)\b/i, offtaker: "Scrap metal dealers" },
  { name: "E-waste", color: "#8B5CB8", re: /\b(e-?waste|batter(y|ies)|electronics?|cables?|bulbs?)\b/i, offtaker: "Licensed e-waste recyclers" },
];

const SAMPLE =
  "Kitchen throws out about 150 kg of food scraps a week. Guests leave lots of plastic water bottles, around 60 kg. Cardboard from deliveries, 80 kg. Some glass bottles from the bar and a few cans. All of it goes into one mixed bin.";

type Result = { items: { name: string; color: string; kg: number; estimated: boolean }[]; mixed: boolean };

function classify(text: string): Result {
  const sentences = text.split(/[.;\n]/);
  // First sentence mentioning the material; its kg figure if stated, else a placeholder
  const items = CATEGORIES.flatMap((c) => {
    const s = sentences.find((x) => c.re.test(x));
    if (!s) return [];
    const kg = s.match(/(\d+)\s*(kg|kilo)/i)?.[1];
    return [{ name: c.name, color: c.color, kg: kg ? +kg : 15, estimated: !kg }];
  });
  return { items, mixed: /mixed|one bin|same bin|together/i.test(text) };
}

export default function Audit() {
  const [text, setText] = useState(SAMPLE);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState(false);

  const run = () => {
    setBusy(true);
    setResult(null);
    setSaved(false);
    setTimeout(() => {
      setResult(classify(text));
      setBusy(false);
    }, 900);
  };

  const total = result?.items.reduce((a, b) => a + b.kg, 0) || 1;
  const estimated = result?.items.filter((i) => i.estimated).map((i) => i.name) ?? [];

  return (
    <>
      <PageHeader title="Site audit" sub="Describe what you see on site. WICI estimates the waste streams; you verify them." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site name"><input defaultValue="Ikoyi Boutique Hotel" className={inputClass} /></Field>
              <Field label="Generator type">
                <select className={inputClass}>{GENERATOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </Field>
            </div>
            <Field label="Field observations" hint="Include rough weights where you can, e.g. “about 60 kg of PET a week”.">
              <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Photos (optional)">
              <input type="file" accept="image/*" multiple className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-mist file:px-3 file:py-2 file:text-sm file:font-semibold file:text-forest" />
            </Field>
            <div>
              <Button onClick={run} disabled={busy || !text.trim()}>{busy ? "Classifying…" : "Classify with WICI"}</Button>
            </div>
          </div>
        </Card>

        <Card>
          {!result ? (
            <div className="flex h-full min-h-60 items-center justify-center text-center text-sm text-muted">
              {busy ? "Reading observations…" : "The classification result will appear here."}
            </div>
          ) : (
            <div className="fade-up flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-forest">Estimated streams</span>
                <Pill tone={estimated.length ? "gold" : "lime"}>Confidence: {estimated.length ? "medium" : "high"}</Pill>
              </div>
              <div>
                {result.items.map((i) => (
                  <div key={i.name} className="mb-2.5 text-sm">
                    <div className="mb-1 flex justify-between">
                      <span>{i.name}</span>
                      <span className="tabular text-muted">
                        {i.estimated && "~"}{i.kg} kg/wk · {Math.round((i.kg / total) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-mist">
                      <div className="h-2 rounded-full" style={{ width: `${(i.kg / total) * 100}%`, background: i.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-1 text-xs font-bold text-forest uppercase">Segregation plan</div>
                <ul className="list-disc pl-5 text-sm">
                  {result.mixed && <li>Replace the single mixed bin with three colour-coded bins.</li>}
                  <li>Green for organics, blue for dry recyclables, grey for residual.</li>
                  <li>Brief kitchen and housekeeping staff; weekly spot-check by a field officer.</li>
                </ul>
              </div>

              <div>
                <div className="mb-1.5 text-xs font-bold text-forest uppercase">Offtakers to approach</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.items.map((i) => <Pill key={i.name}>{CATEGORIES.find((c) => c.name === i.name)!.offtaker}</Pill>)}
                </div>
              </div>

              <div className="rounded-xl bg-sand px-3 py-2.5 text-sm text-[#6b5a32]">
                <b>Human to verify:</b>{" "}
                {estimated.length ? `weights for ${estimated.join(", ")} (not stated); ` : ""}
                contamination levels on a 7-day weigh-in.
              </div>

              {saved ? (
                <Pill tone="lime" className="self-start">Saved to site as a draft baseline</Pill>
              ) : (
                <Button variant="lime" onClick={() => setSaved(true)} className="self-start">Save to site</Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
