# WICI demo

Two parts, both UI-only with illustrative data. `/` lets you pick one.

- **`/pitch`**: the Pilot Console walkthrough for the STS@10 pitch (below).
- **`/login` → `/app`**: a clickable operations app to play with: dashboard, generators (list and add form), site audit, collections, inventory (weigh-in form), marketplace and Ask WICI. Forms work but nothing is saved; a reload resets it.

The site audit and Ask WICI come from the founder's HTML prototype; both are scripted here.

## Pitch walkthrough

It follows one generator, Harbour View Hotel, through the six functions (See → Separate → Move → Aggregate → Match → Measure) and ends on the cluster impact dashboard.

**All data is illustrative.** The "AI" is scripted, and nothing calls out to the internet, so the demo works offline at the venue.

## Run it

```bash
npm install          # once
npm run build        # once, before the event
npm start            # then open http://localhost:3000/pitch
```

Run it with `npm start` on the day. `npm run dev` also works, but it is slower on the first click of each screen.

## Presenting

| Key | Action |
| --- | --- |
| → / PageDown | Next screen (works with a presentation clicker) |
| ← / PageUp | Previous screen |
| 0–6 | Jump to a screen (0 = overview) |
| D | Jump to the dashboard |
| R | Reset everything to the start |

You can also open a screen directly with `/pitch?step=6`.

Each screen has one action to click live:

1. **See**: *Run AI classification*. Wait for the flagged item, then click *PET (crushed bottle)*.
2. **Separate**: tick the checklist items.
3. **Move**: *Simulate breakdown*. The run is rerouted to a backup partner.
4. **Aggregate**: *Record weigh-in*. The PET batch becomes sale-ready.
5. **Match**: *Match to offtakers*, then *Send offer*.
6. **Measure**: hover over the charts.

## Where to edit

All numbers, names and copy are in `src/lib/data.ts`. Pitch screens are in `src/components/steps/`; app screens are in `src/app/app/`.
