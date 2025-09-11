"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setOk(false); setLoading(true);
    const res = await fetch("/api/lead", { method: "POST", body: new FormData(e.currentTarget) });
    setLoading(false);
    if (res.ok) { setOk(true); (e.target as HTMLFormElement).reset(); }
    else setErr(await res.text());
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">CapNow</div>
          <a href="#interest" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400 transition">
            I’m Interested
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 1.2 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[48rem] w-[48rem] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight">
            Invest in Growth,<br className="hidden md:block" /> Powered by Real Returns
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
            CapNow Portfolio 2025 — backed by <span className="text-emerald-400 font-medium">$44M+</span> funded to date.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <Badge>1-Year Target Term</Badge>
            <Badge>Potential returns above real estate & stocks</Badge>
            <Badge>Compounded growth</Badge>
          </motion.div>

          <div className="mt-10">
            <a href="#interest" className="inline-flex items-center rounded-2xl bg-emerald-500 px-6 py-3 font-semibold hover:bg-emerald-400 transition">
              Join the Investor List
            </a>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
          <TrustItem label="$44M+ funded" />
          <TrustItem label="Real-world performance" />
          <TrustItem label="Professional operations" />
          <TrustItem label="Investor-first UX" />
        </div>
      </section>

      {/* FORM */}
      <section id="interest" className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Get early access</h2>
          <p className="mt-3 text-slate-300">Add your details to receive the investor brief and next steps. This is not an offer of securities.</p>
          <ul className="mt-6 space-y-2 text-slate-300 text-sm">
            <li>• Private updates and timelines</li>
            <li>• Allocation reminders when pool opens</li>
            <li>• Direct line to the CapNow team</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Full name">
              <input name="name" required placeholder="Jane Doe"
                className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </Field>
            <Field label="Email">
              <input type="email" name="email" required placeholder="you@company.com"
                className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </Field>
            <Field label="How much are you interested in allocating?">
              <input inputMode="numeric" name="amount" required placeholder="$25,000"
                className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </Field>

            <div className="flex items-start gap-2 text-xs text-slate-400">
              <input type="checkbox" required className="mt-1" />
              <span>I understand this page collects my info for contact. This is not an offer of securities.</span>
            </div>

            <button disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 py-3 font-semibold hover:bg-emerald-400 transition disabled:opacity-60">
              {loading ? "Submitting…" : "Submit"}
            </button>

            {ok && <p className="text-emerald-400 text-sm">Thanks—check your email soon.</p>}
            {err && <p className="text-rose-400 text-sm">{err}</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} CapNow. All rights reserved.</p>
          <p className="mt-2">Contact: syndication@capnow.co</p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{children}</span>;
}
function TrustItem({ label }: { label: string }) {
  return <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">{label}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  );
}
