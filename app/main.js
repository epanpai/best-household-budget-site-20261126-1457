// Hearth Ledger — app shell: state, hash router, and every control's wiring.
// All data lives in localStorage under one key, seeded from data.js on first
// visit; a "Reset demo data" button in the footer restores the seed.
import {
  BUDGETS, GOALS, HOUSEHOLD, MONTH_LABELS, TRANSACTIONS,
  monthSummary, money,
} from './data.js';
import { viewDashboard, viewTransactions, viewBudgets, viewGoals, viewReports } from './views.js';

const STORAGE_KEY = 'hearth-ledger-v1';
const ROUTES = {
  '/': viewDashboard,
  '/transactions': viewTransactions,
  '/budgets': viewBudgets,
  '/goals': viewGoals,
  '/reports': viewReports,
};

function seedState() {
  return {
    month: HOUSEHOLD.currentMonth,
    txns: JSON.parse(JSON.stringify(TRANSACTIONS)),
    budgets: JSON.parse(JSON.stringify(BUDGETS)),
    goals: JSON.parse(JSON.stringify(GOALS)),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.txns && parsed.budgets && parsed.goals) return parsed;
    }
  } catch { /* corrupted storage: fall through to the seed */ }
  return seedState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState();
state.summary = monthSummary(state.month, state.txns[state.month]);

const app = document.getElementById('app');

function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  const view = ROUTES[path] || ROUTES['/'];
  state.summary = monthSummary(state.month, state.txns[state.month]);
  app.innerHTML = view(state);
  document.querySelectorAll('.nav a').forEach((a) => {
    a.setAttribute('aria-current', a.getAttribute('href') === '#' + path ? 'page' : 'false');
  });
  window.scrollTo(0, 0);
}

function rerender() {
  state.summary = monthSummary(state.month, state.txns[state.month]);
  saveState();
  route();
}

// --- event wiring (delegation on #app, so re-renders keep working) ---
app.addEventListener('change', (e) => {
  const el = e.target;
  if (el.matches('[data-action="month"]')) {
    state.month = el.value;
    rerender();
  }
  if (el.matches('#txn-filter')) applyTxnFilter();
});

app.addEventListener('input', (e) => {
  if (e.target.matches('#txn-search')) applyTxnFilter();
});

function applyTxnFilter() {
  const cat = document.getElementById('txn-filter')?.value || '';
  const q = (document.getElementById('txn-search')?.value || '').toLowerCase();
  document.querySelectorAll('#txn-body tr').forEach((row) => {
    const okCat = !cat || row.dataset.cat === cat;
    const okText = !q || row.dataset.text.includes(q);
    row.style.display = okCat && okText ? '' : 'none';
  });
}

app.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  if (form.id === 'add-txn') {
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const txn = {
      id: 't-u' + Date.now().toString(36),
      date: String(data.get('date') || state.month + '-26'),
      merchant: String(data.get('merchant') || '').trim(),
      category: String(data.get('category') || 'groceries'),
      amount: Math.round(amount * 100) / 100,
      note: String(data.get('note') || '').trim(),
    };
    if (!txn.merchant) return;
    state.txns[state.month] = state.txns[state.month] || [];
    state.txns[state.month].push(txn);
    rerender();
    const status = document.getElementById('add-status');
    if (status) status.textContent = `Added ${txn.merchant} — ${money(txn.amount)}.`;
    return;
  }
  if (form.classList.contains('budget-edit')) {
    const amount = Number(new FormData(form).get('budget'));
    if (!Number.isFinite(amount) || amount < 0) return;
    state.budgets[state.month][form.dataset.category] = Math.round(amount);
    rerender();
  }
});

app.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'delete-txn') {
    const rows = state.txns[state.month] || [];
    state.txns[state.month] = rows.filter((t) => t.id !== btn.dataset.id);
    rerender();
  }
  if (action === 'add-goal') {
    const goal = state.goals.find((g) => g.id === btn.dataset.id);
    const amount = Number(btn.dataset.amount) || 0;
    if (goal && amount > 0) {
      goal.saved = Math.min(goal.target, goal.saved + amount);
      rerender();
      const status = document.getElementById(`goal-${goal.id}-status`);
      if (status) status.textContent = `Added ${money(amount)} to ${goal.name}.`;
    }
  }
  if (action === 'export-csv') {
    const rows = [['date', 'merchant', 'category', 'amount', 'note']];
    for (const t of state.txns[state.month] || []) {
      rows.push([t.date, t.merchant, t.category, t.amount.toFixed(2), t.note || '']);
    }
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `hearth-ledger-${state.month}-transactions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
});

document.getElementById('reset-demo')?.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = seedState();
  state.month = fresh.month;
  state.txns = fresh.txns;
  state.budgets = fresh.budgets;
  state.goals = fresh.goals;
  rerender();
});

document.getElementById('year').textContent = String(new Date().getFullYear());
window.addEventListener('hashchange', route);
route();
