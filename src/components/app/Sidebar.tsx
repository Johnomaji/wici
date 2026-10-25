"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../Demo";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/generators", label: "Generators" },
  { href: "/app/audit", label: "Site audit" },
  { href: "/app/collections", label: "Collections" },
  { href: "/app/inventory", label: "Inventory" },
  { href: "/app/marketplace", label: "Marketplace" },
  { href: "/app/assistant", label: "Ask WICI" },
];

export default function Sidebar() {
  const path = usePathname();
  const active = (href: string) => (href === "/app" ? path === href : path.startsWith(href));

  return (
    <aside className="flex shrink-0 flex-col bg-night text-cream md:h-dvh md:w-60">
      <div className="flex items-center gap-3 px-5 py-4">
        <Logo size={32} />
        <div className="leading-tight">
          <div className="text-[0.95rem] font-extrabold tracking-wide">WICI</div>
          <div className="text-[0.7rem] text-mist/70">Victoria Island Cluster</div>
        </div>
      </div>

      {/* Horizontal scroller on phones, vertical list from md up */}
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition ${
              active(n.href) ? "bg-lime text-night" : "text-mist/75 hover:bg-white/5 hover:text-cream"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-white/10 px-5 py-4 text-xs md:block">
        <div className="font-semibold">Demo user</div>
        <div className="text-mist/60">WICI Operations</div>
        <div className="mt-3 flex gap-3">
          <Link href="/pitch" className="text-lime hover:underline">
            Pitch
          </Link>
          <Link href="/login" className="text-mist/70 hover:text-cream">
            Sign out
          </Link>
        </div>
      </div>
    </aside>
  );
}
