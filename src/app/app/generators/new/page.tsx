"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, GENERATOR_TYPES, PageHeader, SubmitButton, inputClass } from "@/components/app/form";
import { Card } from "@/components/ui";
import { HERO_COMMERCIALS, naira } from "@/lib/data";

export default function NewGenerator() {
  const [saved, setSaved] = useState<string | null>(null);

  if (saved)
    return (
      <Card className="mx-auto max-w-lg text-center">
        <div className="text-lg font-bold text-forest">{saved} added</div>
        <p className="mt-1 text-sm text-muted">Next step: book a 7-day baseline audit.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/app/audit" className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream">Start audit</Link>
          <Link href="/app/generators" className="rounded-xl border border-forest/25 px-4 py-2.5 text-sm font-semibold text-forest">Back to list</Link>
        </div>
      </Card>
    );

  return (
    <>
      <PageHeader title="Add generator" sub="Onboard a new waste generator into the cluster." />
      <Card className="max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(String(new FormData(e.currentTarget).get("name")));
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field label="Site name"><input name="name" defaultValue="Eko Lagoon Restaurant" className={inputClass} required /></Field>
          <Field label="Type">
            <select className={inputClass} defaultValue="Restaurant">{GENERATOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </Field>
          <Field label="Address"><input defaultValue="Adetokunbo Ademola St, Victoria Island" className={inputClass} /></Field>
          <Field label="Estimated waste per week" hint="Rough guess; the audit measures it properly">
            <input type="number" defaultValue={400} className={inputClass} />
          </Field>
          <Field label="Contact name"><input defaultValue="Facilities Manager" className={inputClass} /></Field>
          <Field label="Contact phone"><input defaultValue="0800 000 0000" className={inputClass} /></Field>
          <Field label="Service plan">
            <select className={inputClass}>
              <option>Assessment only ({naira(HERO_COMMERCIALS.assessmentFee)})</option>
              <option>Monthly service ({naira(HERO_COMMERCIALS.monthlyFee)}/month)</option>
            </select>
          </Field>
          <Field label="Current collector"><input defaultValue="LAWMA PSP operator" className={inputClass} /></Field>
          <div className="sm:col-span-2">
            <SubmitButton>Add generator</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
