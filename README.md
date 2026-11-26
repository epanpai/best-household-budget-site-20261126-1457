[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/epanpai/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/epanpai/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# Hearth Ledger — Household Budget Site

A household budget site for the fictional Marlowe household: track spending,
plan monthly budgets, save towards goals, and see where the money went.

Entry for the make.fun bounty
[“Make the best household budget site”](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## What it does

- **Dashboard** — income, spending, what is left, and savings rate for the
  month, with spending-vs-budget bars and recent transactions.
- **Transactions** — every dollar in and out, with category filter, search,
  add and delete. Saved on the device (localStorage).
- **Budgets** — a plan per category with progress bars; edit any budget and
  the bars update at once. Month switcher (Sep / Oct / Nov 2026).
- **Goals** — emergency fund, summer holiday, new washing machine, with
  one-click contributions.
- **Reports** — six months of income vs spending, a category donut, top
  merchants, plain-language insights, and a real CSV export.

## Run it

Static files under `app/` — no build step, no network requests, no
libraries. Serve `app/` with any static server, or run `node serve.ts`
and open http://localhost:8080. Works on desktop and phone.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are in `screenshots/` (see `shots.json` for which view each one
shows). `BUILD_LOG.md` records how the entry was built and tested.

## License

MIT — see [LICENSE](LICENSE).
