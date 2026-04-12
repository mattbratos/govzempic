# GovZempic

Trim the federal fat. Watch your check go up.

## What is this?

The government wastes a trillion dollars a year and nobody feels the savings because they vanish into an abstraction called "the federal budget." GovZempic makes it tangible: browse every federal program, vote on what gets cut, and see exactly how much that would add to a monthly UBI check for every American. Cutting stops feeling like taking when you can see your dividend go up in real time.

The thesis: DOGE failed because it solved a math problem without solving a PR problem. Bribe people with their own money and suddenly everyone's a fiscal hawk.

## Features

- **Kill List** — every federal program ranked by cost, browsable and sortable
- **Vote to Cut** — mark programs for elimination and watch the UBI meter tick up
- **The Dividend** — live calculation: if 50% of cuts went directly to Americans, here's the monthly check
- **Share your cuts** — export your personal kill list and dare others to defend the programs you axed
- **Leaderboard** — most-voted cuts nationwide, updated in real time

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Language**: TypeScript
- **Runtime**: Bun

## Getting Started

```bash
git clone https://github.com/mattbratos/govzempic
cd govzempic
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Roadmap

- [ ] Seed the kill list with real federal program data (USASpending.gov API)
- [ ] Build the UBI dividend calculator with live vote aggregation
- [ ] Add shareable cut portfolios
- [ ] Real-time leaderboard of most-voted cuts
- [ ] Embed the original essay as the About page

## License

MIT
