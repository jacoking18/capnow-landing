"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
          <div className="font-semibold tracking-tight">CAPNOW</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#why" className="hover:text-white">Why CapNow</a>
            <a href="#kpis" className="hover:text-white">Results</a>
            <a href="#interest" className="hover:text-white">Invest</a>
          </nav>
          <a href="#interest" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400 transition">
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
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight">
            Invest in Growth,<br className="hidden md:block" /> Powered by Real Returns
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
            CapNow Portfolio 2025 — backed by <span className="text-emerald-400 font-medium">$44M+</span> funded to date.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <Badge>Target 1-Year Term</Badge>
            <Badge>Compounded growth</Badge>
            <Badge>Investor-first UX</Badge>
          </motion.div>

          <div className="mt-10">
            <a href="#interest" className="inline-flex items-center rounded-2xl bg-emerald-500 px-6 py-3 font-semibold hover:bg-emerald-400 transition">
              Join the Investor List
            </a>
          </div>
        </div>

        {/* marquee */}
        <Marquee />
      </section>

      {/* KPIs */}
      <Section id="kpis" title="Real-world traction">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI label="Capital deployed" value={44} prefix="$" suffix="M+" />
          <KPI label="On-time distributions" value={98} suffix="%" />
          <KPI label="Active deals tracked" value={120} suffix="+" />
          <KPI label="Investor NPS" value={73} />
        </div>
      </Section>

      {/* WHY / value props */}
      <Section id="why" title="What you get">
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Curated opportunities" body="Professionally screened opportunities aligned to our risk/return philosophy." />
          <Card title="Automation & reporting" body="Clean dashboards, reminders, and distribution tracking tuned for investors." />
          <Card title="Aligned incentives" body="We focus on execution and transparency—keeping investors first." />
        </div>
      </Section>

      {/* Testimonials (auto-scrolling strip) */}
      <Section title="What investors say">
        <div className="overflow-hidden">
          <motion.div
            initial={{ x: 0 }} animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="flex gap-4 whitespace-nowrap">
            {[
              "“Super smooth process—fast responses.” — J.D.",
              "“Clear updates and strong ops.” — M.K.",
              "“Exactly the dashboard I wanted.” — R.S.",
              "“Professional and investor-centric.” — A.L.",
            ].concat([
              "“Super smooth process—fast responses.” — J.D.",
              "“Clear updates and strong ops.” — M.K.",
              "“Exactly the dashboard I wanted.” — R.S.",
              "“Professional and investor-centric.” — A.L.",
            ]).map((t, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{t}</span>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* FORM */}
      <Section id="interest" title="Get early access">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-slate-300">
              Add your details to receive the investor brief and next steps. This is not an offer of securities.
            </p>
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
        </div>
      </Section>

      {/* FAQ (tight) */}
      <Section title="FAQ">
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
          <FAQ q="Who can invest?" a="Accredited investors where applicable by law. This page is informational only and not an offer." />
          <FAQ q="What’s the timeline?" a="We notify waitlist members with next steps and allocation windows." />
          <FAQ q="How are updates shared?" a="You’ll receive private email updates and a lightweight dashboard experience." />
          <FAQ q="How do I contact CapNow?" a="syndication@capnow.co" />
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} CAPNOW. All rights reserved.</p>
          <p className="mt-2">Contact: syndication@capnow.co</p>
          <p className="mt-2 text-xs text-slate-500">
            Nothing herein is an offer to sell or solicitation to buy securities. Any offering will be made only to qualified investors via official documentation.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- tiny components ---------- */
function Section({
  id, title, children,
}: { id?: string; title: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const controls = useAnimation();
  useEffect(() => { if (inView) controls.start({ opacity: 1, y: 0 }); }, [inView, controls]);

  return (
    <section id={id} ref={ref} className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 12 }} animate={controls}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">{title}</motion.h2>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={controls} transition={{ duration: 0.6 }}>
        {children}
      </motion.div>
    </section>
  );
}

function KPI({ label, value, prefix = "", suffix = "" }: { label: string; value: number; prefix?: string; suffix?: string; }) {
  const n = useCountUp(value);
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-6">
      <div className="text-3xl font-semibold">{prefix}{n}{suffix}</div>
      <div className="text-slate-400 mt-1 text-sm">{label}</div>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-slate-300 mt-2 text-sm">{body}</p>
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{children}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-4">
      <div className="font-medium">{q}</div>
      <div className="text-slate-300 mt-1">{a}</div>
    </div>
  );
}

function Marquee() {
  const logos = ["Motion", "Stripe", "Vercel", "AWS", "Google", "OpenAI"];
  return (
    <div className="border-y border-white/10 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-4 overflow-hidden">
        <motion.div
          initial={{ x: 0 }} animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-8 text-slate-400 whitespace-nowrap">
          {logos.concat(logos).map((l, i) => (
            <span key={i} className="text-sm">{l}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
