// app/dashboard/page.tsx
import Link from "next/link";

function Stat({
  label,
  caption,
  value,
  sub,
}: {
  label: string;
  caption: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-0.5 text-[11px] text-white/40">{caption}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {sub ? <div className="mt-1 text-[13px] text-white/60">{sub}</div> : null}
    </div>
  );
}

function Bar({ value, hint }: { value: number; hint: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-emerald-500"
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-white/70">{hint}</div>
    </div>
  );
}

export default function DashboardPage() {
  // —— Month 9 illustrative snapshot
  const committed = 100_000;
  const deployed = 90_000;
  const collected = 96_500;
  const collectedPrincipal = 72_000;
  const collectedYield = 24_500;
  const outstandingPrincipal = 18_000;
  const realizedProfit = collectedYield;
  const runRateAnnualized = 0.32;
  const defaultsReserved = 3_200;
  const defaultsPctOfDeployed = defaultsReserved / deployed;
  const deals = 13;
  const renewals = 2;

  const deploymentPct = deployed / committed;
  const collectionsPct = collected / (committed + collectedYield);

  return (
    <main
      className="
        min-h-screen text-white
        bg-slate-950
        [background-image:radial-gradient(1200px_600px_at_30%_-10%,rgba(16,185,129,.15),transparent),radial-gradient(1200px_600px_at_80%_10%,rgba(59,130,246,.12),transparent)]
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Investor Dashboard (Preview)</h1>
            <p className="mt-1 text-sm text-white/70">
              Illustrative snapshot of how portfolio metrics will appear.
            </p>
            <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-white/70">
              Snapshot: <span className="ml-1 font-medium text-white">Month 9</span>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-emerald-500/90 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            ← Back to Capnow
          </Link>
        </div>

        {/* Top grid — capital posture */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Committed Capital"
            caption="Total investor money allocated to this fund."
            value={`$${committed.toLocaleString()}`}
            sub="Target fund size"
          />
          <Stat
            label="Capital Deployed"
            caption="Amount currently placed into deals."
            value={`$${deployed.toLocaleString()}`}
            sub={`${Math.round((deployed / committed) * 100)}% deployed`}
          />
          <Stat
            label="Collected Back"
            caption="Cash already received (principal + yield)."
            value={`$${collected.toLocaleString()}`}
            sub={`$${collectedPrincipal.toLocaleString()} principal, $${collectedYield.toLocaleString()} yield`}
          />
          <Stat
            label="Outstanding Principal"
            caption="Still in active positions; expected to return as deals mature."
            value={`$${outstandingPrincipal.toLocaleString()}`}
            sub="Open exposure in current cycle"
          />
        </div>

        {/* Performance / risk row */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Realized Profit (to date)"
            caption="Actual profit collected to date (excludes principal)."
            value={`$${realizedProfit.toLocaleString()}`}
            sub={`Realized ROI: ${((realizedProfit / committed) * 100).toFixed(1)}%`}
          />
          <Stat
            label="Run-rate Yield (30d annualized)"
            caption="If the last 30 days continued for a full year, estimated annualized yield."
            value={`${Math.round(runRateAnnualized * 100)}%`}
            sub="Illustrative; not a promise"
          />
          <Stat
            label="Defaults Reserved"
            caption="Capital set aside for a deal expected not to repay (fully reserved inside returns)."
            value={`1 deal • $${defaultsReserved.toLocaleString()}`}
            sub={`${(defaultsPctOfDeployed * 100).toFixed(1)}% of deployed`}
          />
          <Stat
            label="Renewals"
            caption="Deals extended and reinvested, often at higher effective yield."
            value={`${renewals} of ${deals}`}
            sub="Extensions that reinvest at higher yield"
          />
        </div>

        {/* Progress bars */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <div className="text-sm font-medium text-white">Deployment Progress</div>
            <div className="mt-3">
              <Bar
                value={deploymentPct}
                hint={`$${deployed.toLocaleString()} of $${committed.toLocaleString()} deployed`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <div className="text-sm font-medium text-white">Collections Progress</div>
            <div className="mt-3">
              <Bar
                value={collectionsPct}
                hint={`$${collected.toLocaleString()} collected back ($${collectedPrincipal.toLocaleString()} principal, $${collectedYield.toLocaleString()} yield)`}
              />
            </div>
          </div>
        </div>

        {/* Trend + summary */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Simple illustrative trend (SVG line) */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <div className="text-sm font-medium text-white">ROI Trend (Illustrative)</div>
            <svg viewBox="0 0 600 220" className="mt-4 w-full">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="220" fill="none" />
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
              ))}
              <path
                d="M0,200 L60,195 L120,185 L180,168 L240,148 L300,125 L360,102 L420,86 L480,70 L540,58 L600,55"
                fill="none"
                stroke="rgb(16 185 129)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,200 L60,195 L120,185 L180,168 L240,148 L300,125 L360,102 L420,86 L480,70 L540,58 L600,55 L600,220 L0,220 Z"
                fill="url(#g)"
              />
              {["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"].map((m, i) => (
                <text
                  key={m}
                  x={i * (600 / 9)}
                  y={212}
                  className="fill-white/50 text-[10px]"
                  textAnchor="start"
                >
                  {m}
                </text>
              ))}
            </svg>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
            <div className="text-sm font-medium text-white">Portfolio Summary</div>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <div>
                <span className="text-white/60">Deals funded:</span>{" "}
                <span className="font-medium text-white">{deals}</span>
              </div>
              <div>
                <span className="text-white/60">Renewals:</span>{" "}
                <span className="font-medium text-white">
                  {renewals} of {deals}
                </span>{" "}
                <span className="text-white/60">
                  (reinvested at higher yield; helps maximize profit)
                </span>
              </div>
              <div>
                <span className="text-white/60">Defaults reserved:</span>{" "}
                <span className="font-medium text-white">$3,200</span>{" "}
                <span className="text-white/60">(fully reserved inside returns)</span>
              </div>
              <div>
                <span className="text-white/60">Industries:</span> Retail 28%, Services 24%,
                Logistics 22%, Healthcare 26%
              </div>
              <div>
                <span className="text-white/60">Average ticket:</span> $10k–$15k{" "}
                <span className="ml-3 text-white/60">Typical duration:</span> 4–6 months
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[13px] text-amber-200">
              <span className="font-medium">Important:</span> This preview is for demonstration
              only. Returns are variable and not capped; however, Capnow does not promise more than
              ~35% annually. Forecasts are illustrative and not guarantees of future results.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
