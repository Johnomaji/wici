"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Demo";
import { Field, SubmitButton, inputClass } from "@/components/app/form";

// Demo login: any password works, nothing is checked or stored
export default function Login() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-night px-4 py-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/app");
        }}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-7"
      >
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="font-extrabold tracking-wide text-forest">WICI</div>
            <div className="text-xs text-muted">Operations console</div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-forest">Sign in</h1>

        <Field label="Email">
          <input type="email" defaultValue="ops@wici.demo" className={inputClass} required />
        </Field>
        <Field label="Password">
          <input type="password" defaultValue="demo1234" className={inputClass} required />
        </Field>

        <SubmitButton>Sign in</SubmitButton>

        <p className="rounded-xl bg-mist px-3 py-2.5 text-xs text-forest">
          Demo account. The details are filled in for you, and any password works.
        </p>
        <Link href="/" className="text-center text-xs text-muted hover:text-forest">
          ← Back to start
        </Link>
      </form>
    </main>
  );
}
