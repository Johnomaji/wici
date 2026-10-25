import Link from "next/link";
import { LineChart } from "@/components/charts";
import { PageHeader } from "@/components/app/form";
import { Card, Pill, Stat } from "@/components/ui";
import {
  CLUSTER,
  CONTAMINATION_PCT,
  DIVERTED_T,
  GENERATORS_MAP,
  MONTHS,
  STOCK,
  UNIT_ECONOMICS,
  material,
  nairaShort,
} from "@/lib/data";

const ALERTS = [
  { tone: "gold" as const, text: "PET stock at 94% of sale threshold. Batch PET-0612 ready to match." },
  { tone: "alert" as const, text: "Atlantic Suites sachet lot graded C (11.4% contamination). Spot-check due Friday." },
  { tone: "mist" as const, text: "Seaside Prep School: dry-recyclables pickup today, Island Pickers Co-op." },
];

export default function Dashboard() {
  const total = DIVERTED_T.reduce((a, b) => a + b, 0);
  const top = [...GENERATORS_MAP].sort((a, b) => b.tMonth - a.tMonth).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Good morning"
        sub={`${CLUSTER.name} · Month ${CLUSTER.month} of ${CLUSTER.totalMonths}`}
        action={
          <Link href="/app/audit" className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-forest-2">
            + New site audit
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><Stat label="Active generators" value={CLUSTER.generators} sub={`${CLUSTER.offtakers} offtakers`} /></Card>
        <Card><Stat label="Diverted to date" value={`${total.toFixed(1)} t`} sub={`${DIVERTED_T.at(-1)} t this month`} /></Card>
        <Card><Stat label="Contamination" value={`${CONTAMINATION_PCT.at(-1)}%`} sub={`from ${CONTAMINATION_PCT[0]}% in M1`} /></Card>
        <Card><Stat label="Margin per tonne" value={nairaShort(UNIT_ECONOMICS.revenuePerT - UNIT_ECONOMICS.costPerT)} sub="revenue minus cost" /></Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-2 text-sm font-bold text-forest">Tonnes diverted per month</div>
          <LineChart data={MONTHS.map((m, i) => ({ label: m, value: DIVERTED_T[i] }))} unit=" t" />
        </Card>
        <Card>
          <div className="mb-2 text-sm font-bold text-forest">Contamination, dry recyclables</div>
          <LineChart data={MONTHS.map((m, i) => ({ label: m, value: CONTAMINATION_PCT[i] }))} unit="%" color="#b4452f" target={10} targetLabel="Target 10%" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-forest">Top generators</span>
            <Link href="/app/generators" className="text-xs font-semibold text-sage hover:underline">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {top.map((g) => (
                <tr key={g.name} className="border-t border-line/70">
                  <td className="py-2 font-medium">{g.name}</td>
                  <td className="py-2 text-muted">{g.type}</td>
                  <td className="tabular py-2 text-right font-semibold">{g.tMonth} t/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-3 text-sm font-bold text-forest">Needs attention</div>
            <ul className="flex flex-col gap-2">
              {ALERTS.map((a) => (
                <li key={a.text} className="flex items-start gap-2 text-sm">
                  <Pill tone={a.tone}>•</Pill>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="mb-3 text-sm font-bold text-forest">Stock vs sale threshold</div>
            {STOCK.map((s) => (
              <div key={s.material} className="mb-2 text-xs">
                <div className="mb-1 flex justify-between">
                  <span>{material(s.material).short}</span>
                  <span className="tabular text-muted">{s.kg.toLocaleString()} / {s.threshold.toLocaleString()} kg</span>
                </div>
                <div className="h-2 rounded-full bg-mist">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(100, (s.kg / s.threshold) * 100)}%`, background: material(s.material).color }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
