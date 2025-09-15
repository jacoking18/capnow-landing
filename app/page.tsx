"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* -------------------- helpers -------------------- */
function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return v;
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/* -------------------- rocket progress -------------------- */
function RocketProgress() {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(100000);
  const pct = Math.max(0, Math.min(1, target ? current / target : 0));

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/progress.json", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          setCurrent(Number(j.current || 0));
          setTarget(Number(j.target || 100000));
        }
      } catch {}
    }
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-400">
            CAPNOW PORTFOLIO • LIVE
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold mt-1">
            {formatMoney(current)} committed of {formatMoney(target)}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Be part of the first CAPNOW portfolio.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-semibold">{Math.round(pct * 100)}%</div>
          <div className="text-slate-400 text-xs">allocated</div>
        </div>
      </div>

      {/* track */}
      <div className="mt-5 relative h-5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className="absolute inset-y-0 left-0 bg-emerald-500/70"
        />
        {/* rocket removed as requested */}

        {/* ticks */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <div
              key={p}
              style={{ left: `${p * 100}%` }}
              className="absolute inset-y-0 w-px bg-white/15"
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>0</span>
        <span>25k</span>
        <span>50k</span>
        <span>75k</span>
        <span>100k</span>
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href="#interest"
          className="rounded-2xl bg-emerald-500 px-5 py-2 font-semibold hover:bg-emerald-400 transition"
        >
          Join the first portfolio
        </a>
        <span className="text-slate-400 text-sm">
          We update this bar as new commitments come in.
        </span>
      </div>
    </div>
  );
}

/* -------------------- page -------------------- */
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const amount = formData.get("amount") as string;

    // Insert into Supabase
    const { error } = await supabase.from("leads").insert([
      {
        name,
        email,
        amount: parseFloat(amount),
        source: "landing-page",
      },
    ]);

    if (error) {
      console.error(error);
      setErr(error.message);
    } else {
      setOk(true);
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">CAPNOW</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#why" className="hover:text-white">Why Capnow</a>
            <a href="#kpis" className="hover:text-white">Results</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#interest" className="hover:text-white">Invest</a>
          </nav>
          <a
            href="#interest"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400 transition"
          >
            I’m Interested
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[50rem] w-[50rem] rounded-full bg-emerald-500/10 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="absolute bottom-0 right-0 h-64 w-64 bg-cyan-500/20 blur-[80px] rounded-full"
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            Invest in Growth,<br className="hidden md:block" /> Powered by Real Returns
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl"
          >
            Capnow Portfolio 2025 — backed by <span className="text-emerald-400 font-medium">$44M+</span> funded to date.<br />
            Built for investors who understand risk and want diversified exposure to small-business finance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300"
          >
            <Badge>Target 1-Year Term</Badge>
            <Badge>Diversified allocations</Badge>
            <Badge>Connect directly with the team</Badge>
          </motion.div>

          <div className="mt-10">
            <a
              href="#interest"
              className="inline-flex items-center rounded-2xl bg-emerald-500 px-6 py-3 font-semibold hover:bg-emerald-400 transition"
            >
              Join the Investor List
            </a>
          </div>

          <RocketProgress />
        </div>

        {/* categories strip */}
        <ProductStrip />
      </section>

      {/* KPIs */}
      <Section id="kpis" title="Results & reliability">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI label="Businesses Funded" value={2847} suffix="+" />
          <KPI label="Capital Deployed" value={487} prefix="$" suffix="M+" />
          <KPI label="Active Partners" value={32} suffix="+" />
          <KPI label="Avg. Approval Time" value={2} suffix="hrs" />
        </div>
        {/* Explanatory section removed as requested */}
      </Section>

      {/* WHY */}
      <Section id="mission" title="Our Mission">
        <div className="space-y-4 text-slate-300">
          <p>
            <span className="text-slate-100 font-medium">Mission:</span> To unlock growth for small businesses by making capital accessible, fast, and simple.
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Fast, tech-enabled funding decisions</li>
            <li>• Dedicated support from real people</li>
            <li>• Transparent terms and process</li>
            <li>• Flexible solutions for unique business needs</li>
            <li>• Trusted by thousands of entrepreneurs</li>
          </ul>
        </div>
      </Section>

      {/* ABOUT */}
  <Section id="about" title="About Capnow">
        <div className="grid md:grid-cols-2 gap-8 text-slate-300">
          <div className="space-y-4">
            <p>
              <span className="text-slate-100 font-medium">Empowering Business Growth Since 2022</span><br />
              Capnow is a technology-driven brokerage firm headquartered in New York City. Since our founding, we&apos;ve helped thousands of businesses access the capital they need to grow, hire, and innovate.
            </p>
            <p>
              Our platform streamlines the funding process, connecting entrepreneurs with tailored financial solutions in record time. We believe in transparency, reliability, and building lasting partnerships that drive real-world results.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li>• 2,847 businesses funded nationwide</li>
            <li>• $487M+ capital deployed</li>
            <li>• 32+ active funding partners</li>
            <li>• Average approval time: 2 hours</li>
          </ul>
        </div>
      </Section>

      {/* FORM */}
      <Section id="interest" title="Connect with the team">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="text-slate-300 space-y-3">
            <p>
              This opportunity is for individuals who understand risk and are prepared for the possibility of loss.
              Submit your info to connect and discuss details. Capnow LLC reserves the right to approve or reject
              any requests at its discretion.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Private briefing and next steps</li>
              <li>• Timeline and allocation windows</li>
              <li>• Direct line to the Capnow team</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full name">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </Field>
              <Field label="How much are you interested in allocating?">
                <input
                  type="number"
                  name="amount"
                  required
                  placeholder="$25,000"
                  className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </Field>

              <div className="flex items-start gap-2 text-xs text-slate-400">
                <input type="checkbox" required className="mt-1" />
                <span>
                  I understand this page collects my info for contact. This is not an offer of securities.
                </span>
              </div>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-500 py-3 font-semibold hover:bg-emerald-400 transition disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit"}
              </button>

              {ok && (
                <p className="text-emerald-400 text-sm">
                  Thanks—check your email soon.
                </p>
              )}
              {err && <p className="text-rose-400 text-sm">{err}</p>}
            </form>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400 space-y-2">
          <p>© {new Date().getFullYear()} CAPNOW LLC. All rights reserved. Based in New York, NY.</p>
          <p>Contact: syndication@capnow.co</p>
          <p className="text-xs text-slate-500">
            Nothing herein is an offer to sell or solicitation to buy securities. Any potential offering
            would be made only to qualified investors via official documentation. All investments involve risk,
            including possible loss of principal. Capnow LLC reserves the right to approve or reject any requests.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- tiny components ---------- */
function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView, controls]);

  return (
    <section id={id} ref={ref} className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={controls}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold tracking-tight mb-6"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={controls}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function KPI({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const n = useCountUp(value);
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-6">
      <div className="text-3xl font-semibold">
        {prefix}
        {n}
        {suffix}
      </div>
      <div className="text-slate-400 mt-1 text-sm">{label}</div>
    </div>
  );
}


function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  );
}

function ProductStrip() {
  const items = [
    "Revenue Based Financing",
    "Credit Card Processing",
    "SBA Processing",
    "Equipment Financing",
    "Lines of Credit",
    "Real State Financing",
    "Invoice Factoring",
    "Business Term Loans",
    "Credit Repair"


  ];
  return (
    <div className="border-y border-white/10 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-4 overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-8 text-slate-400 whitespace-nowrap"
        >
          {items.concat(items).map((l, i) => (
            <span key={i} className="text-sm">
              {l}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
