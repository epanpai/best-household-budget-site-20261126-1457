// Hearth Ledger — one render function per page. Each returns an HTML string
// for #app; main.js wires the buttons and forms after it is inserted.
import {
  CATEGORIES, GOALS, MONTH_LABELS, MONTHLY_SUMMARY, UPCOMING_BILLS,
  monthIncome, monthSpent, monthSummary, money, pct,
} from './data.js';
import { budgetBars, donut, monthlyBars } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function monthPicker(current) {
  return `<label class="month-picker">Month
    <select id="month-select" data-action="month">
      ${Object.keys(MONTH_LABELS).map((m) => `<option value="${m}"${m === current ? ' selected' : ''}>${MONTH_LABELS[m]}</option>`).join('')}
    </select></label>`;
}

function categoryRows(month, state) {
  const byCat = state.summary.byCat;
  return CATEGORIES.map((c) => ({
    id: c.id, label: c.label, color: c.color,
    spent: byCat[c.id] || 0, budget: (state.budgets[month] || {})[c.id] || 0,
  }));
}

function progressBar(spent, budget) {
  const ratio = budget > 0 ? spent / budget : 0;
  const cls = ratio > 1 ? 'over' : ratio > 0.9 ? 'warm' : '';
  return `<div class="bar" role="img" aria-label="${pct(ratio)} of budget used"><span class="${cls}" style="width:${Math.min(100, ratio * 100)}%"></span></div>`;
}

export function viewDashboard(state) {
  const { month } = state;
  const s = state.summary;
  const rows = categoryRows(month, state).filter((r) => r.budget > 0);
  const top = [...rows].sort((a, b) => b.spent - a.spent).slice(0, 5);
  const recent = [...(state.txns[month] || [])].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const savingsRate = s.income > 0 ? ((s.income - s.spent) / s.income) : 0;
  const bills = UPCOMING_BILLS.map((b) => `<li><span>${esc(b.name)}</span><span>${b.date.slice(5)} · ${money(b.amount)}</span></li>`).join('');
  return `
  <section class="page-head">
    <div><h1>November, at a glance</h1>
    <p class="lede">Income, spending and what is left for the Marlowes — ${MONTH_LABELS[month]}.</p></div>
    ${monthPicker(month)}
  </section>
  <section class="cards" aria-label="Month summary">
    <article class="card"><h2>Income</h2><p class="big">${money(s.income)}</p><p class="muted">3 paydays this month</p></article>
    <article class="card"><h2>Spent so far</h2><p class="big">${money(s.spent)}</p><p class="muted">of ${money(s.budgetTotal)} planned</p></article>
    <article class="card"><h2>Left to spend</h2><p class="big">${money(s.left)}</p><p class="muted">${pct(savingsRate)} of income kept</p></article>
    <article class="card"><h2>Savings rate</h2><p class="big">${pct(savingsRate)}</p><p class="muted">Goal: keep at least 10%</p></article>
  </section>
  <div class="two-col">
    <section class="panel" aria-labelledby="spend-h">
      <h2 id="spend-h">Spending vs budget</h2>
      ${budgetBars(rows)}
      <p class="muted">Black tick = the budget. A red bar means the category is over budget.</p>
    </section>
    <section class="panel" aria-labelledby="recent-h">
      <h2 id="recent-h">Recent spending</h2>
      <ul class="txn-list">${recent.map((t) => `<li><span><strong>${esc(t.merchant)}</strong><br><span class="muted">${t.date} · ${esc(t.note || '')}</span></span><span>${money(t.amount)}</span></li>`).join('')}</ul>
      <p><a class="btn" href="#/transactions">See all transactions →</a></p>
    </section>
  </div>
  <div class="two-col">
    <section class="panel" aria-labelledby="top-h">
      <h2 id="top-h">Biggest categories</h2>
      <ol class="ranked">${top.map((r, i) => `<li><span>${i + 1}. ${esc(r.label)}</span><span>${money(r.spent)}</span></li>`).join('')}</ol>
    </section>
    <section class="panel" aria-labelledby="bills-h">
      <h2 id="bills-h">Bills still to come</h2>
      <ul class="txn-list">${bills}</ul>
      <p class="muted">Total due before month end: ${money(UPCOMING_BILLS.reduce((a, b) => a + b.amount, 0))}.</p>
    </section>
  </div>`;
}

export function viewTransactions(state) {
  const { month } = state;
  const rows = [...(state.txns[month] || [])].sort((a, b) => (a.date < b.date ? 1 : -1));
  const cats = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  return `
  <section class="page-head"><div><h1>Transactions</h1>
  <p class="lede">Every dollar in and out for ${MONTH_LABELS[month]}. Add one below — it saves on this device.</p></div>
  ${monthPicker(month)}</section>
  <section class="panel">
    <h2>Add a transaction</h2>
    <form id="add-txn" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Where <input type="text" name="merchant" placeholder="e.g. Greenbasket Market" required maxlength="60"></label>
      <label>Category <select name="category">${cats}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Note <input type="text" name="note" placeholder="What was it for?" maxlength="80"></label>
      <button class="btn primary" type="submit">Add transaction</button>
    </form>
    <p class="muted" id="add-status" aria-live="polite"></p>
  </section>
  <section class="panel">
    <h2>All transactions — ${rows.length} rows</h2>
    <div class="filters">
      <label>Filter by category
        <select id="txn-filter" data-action="filter"><option value="">All categories</option>${cats}</select></label>
      <label>Search <input type="search" id="txn-search" data-action="search" placeholder="Search merchant or note"></label>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>Where</th><th>Category</th><th>Note</th><th class="num">Amount</th><th><span class="visually-hidden">Delete</span></th></tr></thead>
      <tbody id="txn-body">
      ${rows.map((t) => `<tr data-cat="${t.category}" data-text="${esc((t.merchant + ' ' + (t.note || '')).toLowerCase())}">
        <td>${t.date}</td><td><strong>${esc(t.merchant)}</strong></td>
        <td>${esc((CATEGORIES.find((c) => c.id === t.category) || {}).label || t.category)}</td>
        <td>${esc(t.note || '')}</td><td class="num">${money(t.amount)}</td>
        <td><button class="btn small danger" data-action="delete-txn" data-id="${t.id}">Delete</button></td></tr>`).join('')}
      </tbody></table></div>
    <p class="muted">Total spent this month: <strong>${money(monthSpent(month, state.txns[month]))}</strong> · Income: <strong>${money(monthIncome(month))}</strong></p>
  </section>`;
}

export function viewBudgets(state) {
  const { month } = state;
  const rows = categoryRows(month, state).filter((r) => r.budget > 0);
  const over = rows.filter((r) => r.spent > r.budget);
  return `
  <section class="page-head"><div><h1>Budgets</h1>
  <p class="lede">The plan for ${MONTH_LABELS[month]}. Change any budget and the bars update at once.</p></div>
  ${monthPicker(month)}</section>
  <p class="notice">${over.length ? `⚠ ${over.length} categor${over.length > 1 ? 'ies are' : 'y is'} over budget: ${over.map((r) => esc(r.label)).join(', ')}.` : '✓ Every category is inside its budget this month.'}</p>
  <section class="budget-grid">
  ${rows.map((r) => {
    const ratio = r.budget > 0 ? r.spent / r.budget : 0;
    return `<article class="panel budget-card">
      <h2>${esc(r.label)}</h2>
      <p class="big">${money(r.spent)} <span class="muted">of ${money(r.budget)}</span></p>
      ${progressBar(r.spent, r.budget)}
      <p class="muted">${pct(ratio)} used · ${money(Math.max(0, r.budget - r.spent))} left</p>
      <form class="budget-edit" data-category="${r.id}">
        <label>Monthly budget ($) <input type="number" name="budget" min="0" step="1" value="${r.budget}" required></label>
        <button class="btn small" type="submit">Save</button>
      </form>
    </article>`;
  }).join('')}
  </section>
  <p class="muted">Planned total: ${money(state.summary.budgetTotal)} against ${money(state.summary.income)} of income.</p>`;
}

export function viewGoals(state) {
  return `
  <section class="page-head"><div><h1>Savings goals</h1>
  <p class="lede">What the household is saving towards, and how close each goal is.</p></div></section>
  <section class="goal-grid">
  ${state.goals.map((g) => {
    const ratio = g.saved / g.target;
    return `<article class="panel goal-card">
      <h2>${esc(g.name)}</h2>
      <p>${esc(g.note)}</p>
      <p class="big">${money(g.saved)} <span class="muted">of ${money(g.target)}</span></p>
      ${progressBar(g.saved, g.target)}
      <p class="muted">${pct(ratio)} saved · ${money(g.target - g.saved)} to go</p>
      <div class="goal-actions">
        <button class="btn small" data-action="add-goal" data-id="${g.id}" data-amount="25">+ $25</button>
        <button class="btn small" data-action="add-goal" data-id="${g.id}" data-amount="50">+ $50</button>
        <button class="btn small" data-action="add-goal" data-id="${g.id}" data-amount="100">+ $100</button>
      </div>
      <p class="muted" aria-live="polite" id="goal-${g.id}-status"></p>
    </article>`;
  }).join('')}
  </section>
  <section class="panel"><h2>How the goals are funded</h2>
  <p>Every month the household moves <strong>${money((state.budgets[state.month] || {}).savings || 0)}</strong> to savings on the 1st, before anything else is spent. Extra money at month end is split between the goals above — the emergency fund first, then the holiday, then the washing machine.</p></section>`;
}

export function viewReports(state) {
  const { month } = state;
  const rows = categoryRows(month, state).filter((r) => r.spent > 0 && r.id !== 'savings');
  const summary = MONTHLY_SUMMARY.map((m) => m.month === month
    ? { ...m, spent: monthSpent(month, state.txns[month]) }
    : m);
  const merchants = {};
  for (const t of state.txns[month] || []) merchants[t.merchant] = (merchants[t.merchant] || 0) + t.amount;
  const topMerchants = Object.entries(merchants).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const s = state.summary;
  const prev = MONTHLY_SUMMARY.find((m) => m.month === '2026-10');
  const change = prev ? s.spent - prev.spent : 0;
  return `
  <section class="page-head"><div><h1>Reports</h1>
  <p class="lede">Six months of income against spending, where the money went in ${MONTH_LABELS[month]}, and what to do about it.</p></div>
  ${monthPicker(month)}</section>
  <div class="two-col">
    <section class="panel"><h2>Income vs spending — Jun to Nov</h2>
      ${monthlyBars(summary)}
      <p class="muted">November spending is ${change >= 0 ? 'up' : 'down'} ${money(Math.abs(change))} on October.</p>
    </section>
    <section class="panel"><h2>Where November’s money went</h2>
      ${donut(rows)}
    </section>
  </div>
  <div class="two-col">
    <section class="panel"><h2>Top places the money went</h2>
      <ol class="ranked">${topMerchants.map((m, i) => `<li><span>${i + 1}. ${esc(m[0])}</span><span>${money(m[1])}</span></li>`).join('')}</ol>
    </section>
    <section class="panel"><h2>What the numbers say</h2>
      <ul class="insights">
        <li>Housing is the biggest cost at ${money(s.byCat.housing || 0)} — ${pct((s.byCat.housing || 0) / Math.max(1, s.spent))} of all spending. It is fixed, so the lever is elsewhere.</li>
        <li>Groceries came in at ${money(s.byCat.groceries || 0)} against a ${money((state.budgets[month] || {}).groceries || 0)} budget — the weekly shop is the easiest place to save next month.</li>
        <li>At this pace the household keeps ${money(s.left)} of November’s income — enough to top up the emergency fund by ${money(Math.min(s.left, 500))} and still have room.</li>
      </ul>
      <p><button class="btn" data-action="export-csv">Download November transactions (CSV)</button></p>
    </section>
  </div>`;
}
