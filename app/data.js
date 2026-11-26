// Hearth Ledger — seed data for the fictional Marlowe household.
// Every figure below is invented for this demo household; nothing is copied
// from a real budget site. The app computes all totals from these rows, so
// the numbers on screen always add up.
export const HOUSEHOLD = {
  name: 'The Marlowe Household',
  members: ['Dana Marlowe', 'Theo Marlowe', 'Milo Marlowe (9)', 'June Marlowe (6)'],
  currency: 'USD',
  months: ['2026-09', '2026-10', '2026-11'],
  currentMonth: '2026-11',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1f4d3a' },
  { id: 'groceries', label: 'Groceries', color: '#2e7d5b' },
  { id: 'utilities', label: 'Utilities', color: '#c9a227' },
  { id: 'transport', label: 'Transport', color: '#4a6fa5' },
  { id: 'dining', label: 'Dining out', color: '#c96f4a' },
  { id: 'kids', label: 'Kids & school', color: '#7d5ba6' },
  { id: 'health', label: 'Health', color: '#3e8e8a' },
  { id: 'fun', label: 'Fun & leisure', color: '#d98e32' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#8a7d6b' },
  { id: 'savings', label: 'Savings', color: '#1f4d3a' },
];

export const MONTH_LABELS = {
  '2026-09': 'September 2026',
  '2026-10': 'October 2026',
  '2026-11': 'November 2026',
};

// Monthly aggregates for the trend chart (Jun–Aug have summaries only).
export const MONTHLY_SUMMARY = [
  { month: '2026-06', label: 'Jun', income: 6720, spent: 5788 },
  { month: '2026-07', label: 'Jul', income: 6850, spent: 6012 },
  { month: '2026-08', label: 'Aug', income: 6790, spent: 6341 },
  { month: '2026-09', label: 'Sep', income: 6850, spent: 5894 },
  { month: '2026-10', label: 'Oct', income: 6900, spent: 5961 },
  { month: '2026-11', label: 'Nov', income: 6850, spent: 0 }, // spent computed from txns
];

// Budgets per month (category id -> planned dollars).
export const BUDGETS = {
  '2026-09': { housing: 1850, groceries: 700, utilities: 300, transport: 370, dining: 220, kids: 420, health: 200, fun: 170, subscriptions: 96, savings: 900 },
  '2026-10': { housing: 1850, groceries: 710, utilities: 305, transport: 375, dining: 230, kids: 440, health: 210, fun: 175, subscriptions: 96, savings: 950 },
  '2026-11': { housing: 1850, groceries: 720, utilities: 310, transport: 380, dining: 240, kids: 450, health: 220, fun: 180, subscriptions: 96, savings: 1000 },
};

// Income rows per month.
export const INCOME = {
  '2026-09': [
    { id: 'i-0901', date: '2026-09-01', source: 'Dana — salary, Northwind Clinic', amount: 3900 },
    { id: 'i-0902', date: '2026-09-01', source: 'Theo — salary, Harbor Logistics', amount: 2400 },
    { id: 'i-0903', date: '2026-09-18', source: 'Theo — freelance shelving build', amount: 550 },
  ],
  '2026-10': [
    { id: 'i-1001', date: '2026-10-01', source: 'Dana — salary, Northwind Clinic', amount: 3900 },
    { id: 'i-1002', date: '2026-10-01', source: 'Theo — salary, Harbor Logistics', amount: 2400 },
    { id: 'i-1003', date: '2026-10-22', source: 'Theo — freelance fence repair', amount: 600 },
  ],
  '2026-11': [
    { id: 'i-1101', date: '2026-11-01', source: 'Dana — salary, Northwind Clinic', amount: 3900 },
    { id: 'i-1102', date: '2026-11-01', source: 'Theo — salary, Harbor Logistics', amount: 2400 },
    { id: 'i-1103', date: '2026-11-14', source: 'Theo — freelance bookshelf build', amount: 550 },
  ],
};

// Expense transactions. Amounts are positive dollars spent.
export const TRANSACTIONS = {
  '2026-09': [
    { id: 't-0901', date: '2026-09-01', merchant: 'Maple Court Apartments', category: 'housing', amount: 1750.00, note: 'Monthly rent' },
    { id: 't-0902', date: '2026-09-02', merchant: 'Greenbasket Market', category: 'groceries', amount: 96.40, note: 'Weekly shop' },
    { id: 't-0903', date: '2026-09-05', merchant: 'City Power & Light', category: 'utilities', amount: 118.20, note: 'Electric bill' },
    { id: 't-0904', date: '2026-09-06', merchant: 'Greenbasket Market', category: 'groceries', amount: 88.15, note: 'Weekly shop' },
    { id: 't-0905', date: '2026-09-08', merchant: 'Metro Transit', category: 'transport', amount: 64.00, note: 'Bus passes x2' },
    { id: 't-0906', date: '2026-09-10', merchant: 'Pete’s Garage', category: 'transport', amount: 142.50, note: 'Oil change + inspection' },
    { id: 't-0907', date: '2026-09-12', merchant: 'Sunny Daycare', category: 'kids', amount: 210.00, note: 'June, two weeks' },
    { id: 't-0908', date: '2026-09-13', merchant: 'Greenbasket Market', category: 'groceries', amount: 104.75, note: 'Weekly shop' },
    { id: 't-0909', date: '2026-09-15', merchant: 'Riverside Pharmacy', category: 'health', amount: 38.60, note: 'Allergy medicine' },
    { id: 't-0910', date: '2026-09-16', merchant: 'Noodle House', category: 'dining', amount: 46.80, note: 'Family dinner out' },
    { id: 't-0911', date: '2026-09-19', merchant: 'Corner Bookshop', category: 'kids', amount: 32.40, note: 'Milo’s school books' },
    { id: 't-0912', date: '2026-09-20', merchant: 'Greenbasket Market', category: 'groceries', amount: 91.30, note: 'Weekly shop' },
    { id: 't-0913', date: '2026-09-22', merchant: 'StreamBox', category: 'subscriptions', amount: 15.99, note: 'Monthly plan' },
    { id: 't-0914', date: '2026-09-24', merchant: 'Town Cinema', category: 'fun', amount: 38.00, note: 'Movie night x4' },
    { id: 't-0915', date: '2026-09-26', merchant: 'Greenbasket Market', category: 'groceries', amount: 112.55, note: 'Weekly shop + pantry' },
    { id: 't-0916', date: '2026-09-28', merchant: 'City Water Works', category: 'utilities', amount: 54.30, note: 'Water bill' },
  ],
  '2026-10': [
    { id: 't-1001', date: '2026-10-01', merchant: 'Maple Court Apartments', category: 'housing', amount: 1750.00, note: 'Monthly rent' },
    { id: 't-1002', date: '2026-10-03', merchant: 'Greenbasket Market', category: 'groceries', amount: 98.20, note: 'Weekly shop' },
    { id: 't-1003', date: '2026-10-05', merchant: 'City Power & Light', category: 'utilities', amount: 121.45, note: 'Electric bill' },
    { id: 't-1004', date: '2026-10-07', merchant: 'Fuel Stop 12', category: 'transport', amount: 48.60, note: 'Petrol' },
    { id: 't-1005', date: '2026-10-09', merchant: 'Sunny Daycare', category: 'kids', amount: 210.00, note: 'June, two weeks' },
    { id: 't-1006', date: '2026-10-10', merchant: 'Greenbasket Market', category: 'groceries', amount: 121.10, note: 'Weekly shop' },
    { id: 't-1007', date: '2026-10-12', merchant: 'Harbor Dental', category: 'health', amount: 85.00, note: 'Milo check-up' },
    { id: 't-1008', date: '2026-10-14', merchant: 'Pizza Corner', category: 'dining', amount: 38.50, note: 'Friday pizza' },
    { id: 't-1009', date: '2026-10-16', merchant: 'Greenbasket Market', category: 'groceries', amount: 89.75, note: 'Weekly shop' },
    { id: 't-1010', date: '2026-10-18', merchant: 'Playhouse Toys', category: 'kids', amount: 54.90, note: 'June birthday gift' },
    { id: 't-1011', date: '2026-10-20', merchant: 'StreamBox', category: 'subscriptions', amount: 15.99, note: 'Monthly plan' },
    { id: 't-1012', date: '2026-10-21', merchant: 'Fuel Stop 12', category: 'transport', amount: 52.30, note: 'Petrol' },
    { id: 't-1013', date: '2026-10-23', merchant: 'Greenbasket Market', category: 'groceries', amount: 107.40, note: 'Weekly shop' },
    { id: 't-1014', date: '2026-10-25', merchant: 'Riverside Pharmacy', category: 'health', amount: 27.80, note: 'Vitamins' },
    { id: 't-1015', date: '2026-10-27', merchant: 'Town Cinema', category: 'fun', amount: 42.00, note: 'Movie night x4' },
    { id: 't-1016', date: '2026-10-29', merchant: 'Greenbasket Market', category: 'groceries', amount: 94.60, note: 'Weekly shop' },
    { id: 't-1017', date: '2026-10-30', merchant: 'City Water Works', category: 'utilities', amount: 56.10, note: 'Water bill' },
    { id: 't-1018', date: '2026-10-31', merchant: 'Pumpkin Patch Farm', category: 'fun', amount: 46.00, note: 'Halloween outing' },
  ],
  '2026-11': [
    { id: 't-1101', date: '2026-11-01', merchant: 'Maple Court Apartments', category: 'housing', amount: 1750.00, note: 'Monthly rent' },
    { id: 't-1102', date: '2026-11-01', merchant: 'Hearth Savings', category: 'savings', amount: 1000.00, note: 'Auto-transfer to savings' },
    { id: 't-1103', date: '2026-11-02', merchant: 'Greenbasket Market', category: 'groceries', amount: 102.35, note: 'Weekly shop' },
    { id: 't-1104', date: '2026-11-03', merchant: 'City Power & Light', category: 'utilities', amount: 124.60, note: 'Electric bill' },
    { id: 't-1105', date: '2026-11-04', merchant: 'Metro Transit', category: 'transport', amount: 64.00, note: 'Bus passes x2' },
    { id: 't-1106', date: '2026-11-05', merchant: 'Fuel Stop 12', category: 'transport', amount: 51.40, note: 'Petrol' },
    { id: 't-1107', date: '2026-11-06', merchant: 'Sunny Daycare', category: 'kids', amount: 210.00, note: 'June, two weeks' },
    { id: 't-1108', date: '2026-11-07', merchant: 'Greenbasket Market', category: 'groceries', amount: 118.90, note: 'Weekly shop' },
    { id: 't-1109', date: '2026-11-08', merchant: 'Noodle House', category: 'dining', amount: 52.30, note: 'Family dinner out' },
    { id: 't-1110', date: '2026-11-09', merchant: 'Riverside Pharmacy', category: 'health', amount: 41.25, note: 'Cold medicine' },
    { id: 't-1111', date: '2026-11-10', merchant: 'StreamBox', category: 'subscriptions', amount: 15.99, note: 'Monthly plan' },
    { id: 't-1112', date: '2026-11-11', merchant: 'Greenbasket Market', category: 'groceries', amount: 96.80, note: 'Weekly shop' },
    { id: 't-1113', date: '2026-11-12', merchant: 'School Lunch Program', category: 'kids', amount: 86.00, note: 'Milo + June, November' },
    { id: 't-1114', date: '2026-11-13', merchant: 'Fuel Stop 12', category: 'transport', amount: 47.85, note: 'Petrol' },
    { id: 't-1115', date: '2026-11-14', merchant: 'Pizza Corner', category: 'dining', amount: 41.60, note: 'Friday pizza' },
    { id: 't-1116', date: '2026-11-15', merchant: 'Greenbasket Market', category: 'groceries', amount: 109.45, note: 'Weekly shop' },
    { id: 't-1117', date: '2026-11-16', merchant: 'Harbor Dental', category: 'health', amount: 65.00, note: 'Theo cleaning' },
    { id: 't-1118', date: '2026-11-17', merchant: 'City Water Works', category: 'utilities', amount: 58.40, note: 'Water bill' },
    { id: 't-1119', date: '2026-11-18', merchant: 'Corner Bookshop', category: 'kids', amount: 28.75, note: 'Milo reading books' },
    { id: 't-1120', date: '2026-11-19', merchant: 'Greenbasket Market', category: 'groceries', amount: 104.20, note: 'Weekly shop' },
    { id: 't-1121', date: '2026-11-20', merchant: 'Town Cinema', category: 'fun', amount: 44.00, note: 'Movie night x4' },
    { id: 't-1122', date: '2026-11-21', merchant: 'Greenbasket Market', category: 'groceries', amount: 116.62, note: 'Weekly shop + baking' },
    { id: 't-1123', date: '2026-11-22', merchant: 'Noodle House', category: 'dining', amount: 48.90, note: 'Sunday lunch out' },
    { id: 't-1124', date: '2026-11-23', merchant: 'Fuel Stop 12', category: 'transport', amount: 49.50, note: 'Petrol' },
    { id: 't-1125', date: '2026-11-24', merchant: 'Music Lessons Co.', category: 'kids', amount: 73.45, note: 'June piano, 4 lessons' },
    { id: 't-1126', date: '2026-11-25', merchant: 'Riverside Pharmacy', category: 'health', amount: 80.25, note: 'Prescription refill' },
  ],
};

// Savings goals (shared across months; contributions add to `saved`).
export const GOALS = [
  { id: 'g-emergency', name: 'Emergency fund', target: 8000, saved: 5240, note: 'Three months of essentials, for the unexpected.' },
  { id: 'g-holiday', name: 'Summer holiday', target: 2400, saved: 1150, note: 'A week at the coast next July — train, cottage, ice cream.' },
  { id: 'g-washer', name: 'New washing machine', target: 900, saved: 620, note: 'The old one leaks. Replace before it floods the kitchen.' },
];

// Bills the household expects before the month ends.
export const UPCOMING_BILLS = [
  { date: '2026-11-28', name: 'Internet — Northline Broadband', amount: 65.00 },
  { date: '2026-11-29', name: 'Phone — Northline Mobile (2 lines)', amount: 78.00 },
  { date: '2026-11-30', name: 'Home insurance — Harbor Mutual', amount: 92.50 },
];

// --- derived helpers (pure functions over the rows above) ---
export function monthIncome(month) {
  return (INCOME[month] || []).reduce((s, r) => s + r.amount, 0);
}
export function monthSpent(month, txns) {
  const rows = txns || TRANSACTIONS[month] || [];
  return rows.reduce((s, r) => s + r.amount, 0);
}
export function spentByCategory(month, txns) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const r of txns || TRANSACTIONS[month] || []) {
    if (out[r.category] !== undefined) out[r.category] += r.amount;
  }
  return out;
}
export function monthSummary(month, txns) {
  const income = monthIncome(month);
  const spent = monthSpent(month, txns);
  const byCat = spentByCategory(month, txns);
  const budgetTotal = Object.values(BUDGETS[month] || {}).reduce((s, v) => s + v, 0);
  return { income, spent, left: income - spent, byCat, budgetTotal };
}
export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function pct(n) {
  return Math.round(n * 100) + '%';
}
