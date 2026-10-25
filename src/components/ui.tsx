"use client";

import type { ReactNode } from "react";
import { material, type MaterialId } from "@/lib/data";

export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl ${
        dark ? "bg-forest text-cream" : "bg-white border border-line/70 shadow-[0_1px_2px_rgba(19,36,31,0.06)]"
      } p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted ${className}`}>{children}</div>
  );
}

export function Pill({
  children,
  tone = "mist",
  className = "",
}: {
  children: ReactNode;
  tone?: "mist" | "lime" | "gold" | "alert" | "forest" | "sand";
  className?: string;
}) {
  const tones = {
    mist: "bg-mist text-forest",
    lime: "bg-lime text-night",
    gold: "bg-gold/25 text-[#7a5a12]",
    alert: "bg-alert/12 text-alert",
    forest: "bg-forest text-cream",
    sand: "bg-sand text-[#6b5a32]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "lime" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-forest text-cream hover:bg-forest-2",
    lime: "bg-lime text-night hover:brightness-95",
    ghost: "bg-transparent text-forest border border-forest/25 hover:bg-mist",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Swatch({ id, size = 10 }: { id: MaterialId; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-[3px]"
      style={{ width: size, height: size, background: material(id).color }}
    />
  );
}

export function Stat({
  label,
  value,
  sub,
  dark = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div>
      <div className={`text-xs font-semibold ${dark ? "text-mist/70" : "text-muted"}`}>{label}</div>
      <div className={`tabular mt-1 text-[1.7rem] font-bold leading-none ${dark ? "text-cream" : "text-forest"}`}>
        {value}
      </div>
      {sub && <div className={`mt-1.5 text-xs ${dark ? "text-mist/70" : "text-muted"}`}>{sub}</div>}
    </div>
  );
}

export function Check({ done }: { done: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
        done ? "border-sage bg-sage text-white" : "border-line bg-white"
      }`}
    >
      {done && (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export function Proves({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-mist px-3.5 py-2.5 text-sm text-forest">
      <span className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-sage">Proves</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
