"use client";

import { useState } from "react";
import { Field, PageHeader, SubmitButton, inputClass } from "@/components/app/form";
import { Card, Pill, Swatch } from "@/components/ui";
import { GENERATORS_MAP, LOTS, MATERIALS, STOCK, material, type Lot, type MaterialId } from "@/lib/data";

const grade = (c: number): Lot["grade"] => (c < 5 ? "A" : c < 10 ? "B" : "C");
const GRADE_TONE = { A: "lime", B: "gold", C: "alert" } as const;

export default function Inventory() {
  const [lots, setLots] = useState(LOTS);

  return (
    <>
      <PageHeader title="Inventory" sub="Every lot is weighed, graded and traced to its source." />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <div className="mb-3 text-sm font-bold text-forest">Record weigh-in</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const contamination = Number(f.get("contamination"));
              const now = new Date();
              setLots((l) => [
                ...l,
                {
                  id: `L-${2421 + l.length - LOTS.length}`,
                  time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
                  generator: String(f.get("generator")),
                  material: f.get("material") as MaterialId,
                  kg: Number(f.get("kg")),
                  contamination,
                  grade: grade(contamination),
                },
              ]);
            }}
            className="grid gap-4"
          >
            <Field label="Generator">
              <select name="generator" className={inputClass}>{GENERATORS_MAP.map((g) => <option key={g.name}>{g.name}</option>)}</select>
            </Field>
            <Field label="Material">
              <select name="material" defaultValue="pet" className={inputClass}>
                {MATERIALS.filter((m) => m.recoverable).map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Weight (kg)"><input name="kg" type="number" min={1} defaultValue={126} className={inputClass} required /></Field>
              <Field label="Contamination %"><input name="contamination" type="number" step="0.1" min={0} max={100} defaultValue={4.1} className={inputClass} required /></Field>
            </div>
            <div><SubmitButton>Record lot</SubmitButton></div>
          </form>
        </Card>

        <Card>
          <div className="mb-3 text-sm font-bold text-forest">Today&apos;s lots</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="pb-2 font-semibold">Lot</th>
                  <th className="pb-2 font-semibold">Source</th>
                  <th className="pb-2 font-semibold">Material</th>
                  <th className="pb-2 text-right font-semibold">kg</th>
                  <th className="pb-2 text-right font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {[...lots].reverse().map((l) => (
                  <tr key={l.id} className="border-t border-line/70">
                    <td className="tabular py-2.5 text-xs text-muted">{l.id}<br />{l.time}</td>
                    <td className="py-2.5">{l.generator}</td>
                    <td className="py-2.5"><span className="flex items-center gap-1.5"><Swatch id={l.material} />{material(l.material).short}</span></td>
                    <td className="tabular py-2.5 text-right">{l.kg}</td>
                    <td className="py-2.5 text-right"><Pill tone={GRADE_TONE[l.grade]}>{l.grade} · {l.contamination}%</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-3 text-sm font-bold text-forest">Stock at partner yard</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STOCK.map((s) => (
            <div key={s.material} className="rounded-xl border border-line p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted"><Swatch id={s.material} />{material(s.material).short}</div>
              <div className="tabular mt-1 text-xl font-bold text-forest">{s.kg.toLocaleString()} kg</div>
              <div className="text-xs text-muted">sale-ready at {s.threshold.toLocaleString()} kg</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
