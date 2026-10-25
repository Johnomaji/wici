import Link from "next/link";
import { Logo } from "@/components/Demo";

const CHOICES = [
  {
    href: "/pitch",
    eyebrow: "Present",
    title: "Pitch walkthrough",
    body: "Follow one hotel's waste from the bin to a buyer, screen by screen. Works with a clicker.",
    cta: "Start walkthrough →",
  },
  {
    href: "/login",
    eyebrow: "Explore",
    title: "Try the app",
    body: "Sign in with a demo account and click around the WICI operations console.",
    cta: "Open the app →",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-night px-4 py-12 text-cream">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo size={56} />
        <h1 className="text-[2.4rem] leading-tight font-extrabold tracking-tight">WICI</h1>
        <p className="max-w-md text-mist/80">
          Waste Intelligence &amp; Circular Infrastructure. See it. Separate it. Move it. Measure it.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {CHOICES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-forest p-6 transition hover:border-lime/60"
          >
            <span className="text-[0.7rem] font-bold tracking-[0.14em] text-lime uppercase">{c.eyebrow}</span>
            <span className="text-xl font-bold">{c.title}</span>
            <span className="text-sm text-mist/75">{c.body}</span>
            <span className="mt-3 text-sm font-semibold text-lime group-hover:underline">{c.cta}</span>
          </Link>
        ))}
      </div>

      <p className="text-xs text-mist/50">All data is illustrative. Nothing here is a WICI measurement.</p>
    </main>
  );
}
