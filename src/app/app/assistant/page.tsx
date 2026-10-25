"use client";

import { useState } from "react";
import { PageHeader, inputClass } from "@/components/app/form";
import { Card } from "@/components/ui";

// "Ask WICI" from the founder's prototype. Answers are scripted for the demo.
const ANSWERS: Record<string, string> = {
  "Which generator should we onboard next?":
    "Island Event Centre. Event venues in the cluster average 1.6 t a month, mostly PET and cardboard, and it sits on Tuesday's dry-recyclables route, so pickup adds no extra trip.",
  "Where is contamination worst?":
    "Sachet film. Atlantic Suites' last lot graded C at 11.4%. Cluster-wide dry-recyclables contamination is 7.2%, down from 21% in month 1.",
  "Where could an aggregation centre make sense?":
    "Between Ozumba and Oniru. Ten of 14 generators sit within 3 km of the current partner yard, and PET and paper stock reach sale thresholds every 2 to 3 weeks. Logistics cost is ₦18.4k per tonne against a ₦15k target; a closer yard is the biggest lever.",
  "Are we covering costs?":
    "Yes, narrowly. Blended revenue is ₦142k per tonne against ₦118k cost, a ₦24k margin. 12 of 14 generators pay a monthly fee.",
};

type Msg = { from: "you" | "wici"; text: string };

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");

  const ask = (question: string) => {
    if (!question.trim()) return;
    const answer =
      ANSWERS[question] ??
      "This demo answers the suggested questions only. In the full version, WICI reads the live pilot data to answer anything.";
    setMsgs((m) => [...m, { from: "you", text: question }, { from: "wici", text: answer }]);
    setQ("");
  };

  return (
    <>
      <PageHeader title="Ask WICI" sub="An operations analyst that reads the pilot data." />
      <Card className="flex min-h-[60vh] flex-col">
        <div className="flex flex-1 flex-col gap-3">
          {msgs.length === 0 && <p className="text-sm text-muted">Pick a question below, or type your own.</p>}
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`fade-up max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "you" ? "self-end bg-forest text-cream" : "self-start bg-mist text-ink"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(ANSWERS).map((k) => (
            <button key={k} type="button" onClick={() => ask(k)} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-forest hover:bg-mist">
              {k}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(q);
          }}
          className="mt-3 flex gap-2"
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about the pilot…" className={inputClass} />
          <button type="submit" className="rounded-xl bg-forest px-5 text-sm font-semibold text-cream hover:bg-forest-2">Ask</button>
        </form>
      </Card>
    </>
  );
}
