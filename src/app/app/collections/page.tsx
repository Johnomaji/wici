"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/form";
import { Button, Card, Pill } from "@/components/ui";
import { DAYS, HUB, PARTNERS, SCHEDULE, STOPS } from "@/lib/data";

const partner = (id: string) => PARTNERS.find((p) => p.id === id)!;

export default function Collections() {
  const [done, setDone] = useState<string[]>([STOPS[0].id, STOPS[1].id]);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <>
      <PageHeader title="Collections" sub="Runs on partner logistics. WICI owns zero trucks." />

      <Card className="mb-4">
        <div className="mb-3 text-sm font-bold text-forest">Weekly schedule</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="pb-2 font-semibold">Stream</th>
                {DAYS.map((d) => <th key={d} className="pb-2 font-semibold">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {SCHEDULE.map((s) => (
                <tr key={s.stream} className="border-t border-line/70">
                  <td className="py-2.5 font-medium">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                    {s.stream}
                  </td>
                  {DAYS.map((d) => (
                    <td key={d} className="py-2.5 text-xs">{s.days[d] ? partner(s.days[d]!).name : <span className="text-line">·</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-forest">Today&apos;s run · Dry recyclables</div>
            <div className="text-xs text-muted">Island Pickers Co-op → {HUB.name}</div>
          </div>
          <Pill tone="lime">{done.length} of {STOPS.length} collected</Pill>
        </div>
        <ul>
          {STOPS.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 border-t border-line/70 py-2.5 text-sm">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="tabular text-xs text-muted">{s.kg} kg expected</div>
              </div>
              <Button variant={done.includes(s.id) ? "ghost" : "primary"} onClick={() => toggle(s.id)} className="py-1.5">
                {done.includes(s.id) ? "✓ Collected" : "Mark collected"}
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
