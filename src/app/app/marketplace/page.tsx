"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/form";
import { Button, Card, Pill, Stat } from "@/components/ui";
import { BATCH, OFFTAKERS, evaluateOfftaker, material, naira } from "@/lib/data";

export default function Marketplace() {
  const [sent, setSent] = useState<string[]>([]);
  const rows = OFFTAKERS.map((o) => ({ o, e: evaluateOfftaker(o) })).sort((a, b) => b.e.score - a.e.score);

  return (
    <>
      <PageHeader title="Marketplace" sub="Match sale-ready batches to offtakers that meet the spec." />

      <Card dark className="mb-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Stat dark label="Batch" value={BATCH.id} sub={material(BATCH.material).label} />
        <Stat dark label="Weight" value={`${BATCH.kg.toLocaleString()} kg`} sub={`${BATCH.lots} lots · ${BATCH.generators} generators`} />
        <Stat dark label="Contamination" value={`${BATCH.contamination}%`} sub={`Grade ${BATCH.grade}`} />
        <Stat dark label="Form" value={<span className="text-base">Bagged</span>} sub={BATCH.form} />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(({ o, e }, i) => (
          <Card key={o.id} className={e.eligible ? "" : "opacity-60"}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-forest">{o.name}</div>
                <div className="text-xs text-muted">{o.kind} · {o.area} · {o.distanceKm} km</div>
              </div>
              {e.eligible ? <Pill tone={i === 0 ? "lime" : "mist"}>{i === 0 ? "Best match" : `Score ${e.score}`}</Pill> : <Pill tone="alert">Not eligible</Pill>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-muted">Price</div><b className="tabular">₦{o.pricePerKg}/kg</b></div>
              <div><div className="text-xs text-muted">Net value</div><b className="tabular">{naira(e.net)}</b></div>
              <div><div className="text-xs text-muted">On time</div><b className="tabular">{o.reliability}%</b></div>
            </div>
            <div className="mt-4">
              {!e.eligible ? (
                <p className="text-xs text-alert">{e.issues.join(" · ")}</p>
              ) : sent.includes(o.id) ? (
                <Pill tone="lime">✓ Offer sent, awaiting reply</Pill>
              ) : (
                <Button onClick={() => setSent((s) => [...s, o.id])} variant={i === 0 ? "primary" : "ghost"}>Send offer</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
