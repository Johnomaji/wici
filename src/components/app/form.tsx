"use client";

import type { ReactNode } from "react";

// Shared form styling for the app screens
export const inputClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-forest">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.6rem] font-extrabold tracking-tight text-forest">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// Generator types, from the founder's prototype
export const GENERATOR_TYPES = ["Hotel", "Restaurant", "Office", "School", "Retail", "Residential estate", "Event venue"];
