# GovZempic

**Trim the federal fat. Watch your check go up.**

GovZempic is an interactive thought experiment: what if cutting government spending wasn't just an abstract political debate — but something you could feel in your wallet every month?

The premise is simple. Take 50% of any savings from cuts to the federal budget and distribute it equally to every citizen as a monthly UBI dividend. The other 50% goes toward deficit reduction. Drag sliders, kill programs, watch your check go up.

This idea came from an essay I wrote: [**How to Make DOGE Sexier**](https://mattbratos.com/essays/doge-sexier). Go read it first — it explains why DOGE failed as a political project and what would actually make it popular.

## Fair warning

This is a vibecoded project I built in a few hours for fun. The data is sourced from public budget figures (CBO projections and enacted appropriations) but **I can't guarantee it's 100% accurate**. It might have bugs. The numbers are illustrative — the point is the thought experiment, not the spreadsheet.

Don't make financial or policy decisions based on this. Play with it, have fun, and treat it as what it is: a toy that makes an idea tangible.

## Fork it, it's MIT

Clone it, fork it, remix it, do whatever you want — it's MIT licensed.

Want to add your country's data? The budget data lives in `src/data/` as JSON files (see `budget.json` for the US format and `budget-pl.json` for an example of another country). You can add your own country with [Claude Code](https://claude.ai/code), [Codex](https://openai.com/codex), or any agentic coding tool — just prompt it to follow the existing schema. **Double-check the numbers against your government's official budget publications before submitting a PR.**

## Getting Started

```bash
git clone https://github.com/mattbratos/govzempic
cd govzempic
bun install
bun dev
```
