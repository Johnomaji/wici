"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, inputClass } from "@/components/app/form";
import { Card, Pill } from "@/components/ui";
import { GENERATORS_MAP } from "@/lib/data";

// Paying status is illustrative: 12 of 14 pay, matching the pitch
const TRIAL = ["Victoria Co-working Hub", "Ajose Bakery"];

export default function Generators() {
  const [q, setQ] = useState("");
  const rows = GENERATORS_MAP.filter((g) => `${g.name} ${g.type}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Generators"
        sub={`${GENERATORS_MAP.length} sites in the cluster`}
        action={
          <Link href="/app/generators/new" className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-forest-2">
            + Add generator
          </Link>
        }
      />
      <Card>
        <input placeholder="Search by name or type" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputClass} mb-4 max-w-sm`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="pb-2 font-semibold">Site</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 text-right font-semibold">Tonnes / month</th>
                <th className="pb-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.name} className="border-t border-line/70">
                  <td className="py-2.5 font-medium">{g.name}</td>
                  <td className="py-2.5 text-muted">{g.type}</td>
                  <td className="tabular py-2.5 text-right">{g.tMonth}</td>
                  <td className="py-2.5 text-right">
                    {TRIAL.includes(g.name) ? <Pill tone="gold">Trial</Pill> : <Pill tone="mist">Paying</Pill>}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted">No sites match &ldquo;{q}&rdquo;.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
