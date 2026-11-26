// Interaction smoke test: exercises every control of the site in a real
// browser and prints PASS/FAIL per check. Run: node playtest.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((r) => server.listen(8124, '127.0.0.1', r));

const results = [];
function check(name, ok) { results.push([name, ok]); console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); }

const browser = await chromium.launch({
  executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://127.0.0.1:8124/#/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
check('dashboard renders income', (await page.textContent('#app')).includes('$6,850.00'));
check('dashboard renders spent', (await page.textContent('#app')).includes('$4,581.56'));
check('no page errors on dashboard', errors.length === 0);

// Month switcher
await page.selectOption('#month-select', '2026-10');
await page.waitForTimeout(300);
check('month switch to October', (await page.textContent('#app')).includes('October 2026'));
await page.selectOption('#month-select', '2026-11');
await page.waitForTimeout(300);

// Transactions: add, filter, delete
await page.goto('http://127.0.0.1:8124/#/transactions', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const before = await page.textContent('#app');
check('26 transactions listed', before.includes('26 rows'));
await page.fill('input[name="merchant"]', 'Test Corner Shop');
await page.fill('input[name="amount"]', '12.34');
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
check('add transaction works', (await page.textContent('#app')).includes('Test Corner Shop'));
check('add shows 27 rows', (await page.textContent('#app')).includes('27 rows'));
await page.selectOption('#txn-filter', 'groceries');
await page.waitForTimeout(200);
const visible = await page.$$eval('#txn-body tr', (rows) => rows.filter((r) => r.style.display !== 'none').length);
check('category filter shows only groceries (6)', visible === 6);
await page.selectOption('#txn-filter', '');
await page.fill('#txn-search', 'noodle');
await page.waitForTimeout(200);
const visible2 = await page.$$eval('#txn-body tr', (rows) => rows.filter((r) => r.style.display !== 'none').length);
check('search finds 2 noodle rows', visible2 === 2);
await page.fill('#txn-search', '');
const delBtn = await page.$('button[data-action="delete-txn"]');
await delBtn.click();
await page.waitForTimeout(300);
check('delete removes newest row (26 rows again)', (await page.textContent('#app')).includes('26 rows'));

// Budgets: edit
await page.goto('http://127.0.0.1:8124/#/budgets', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const firstForm = await page.$('form.budget-edit');
await firstForm.$eval('input[name="budget"]', (el) => { el.value = '2000'; });
await firstForm.$eval('button[type="submit"]', (el) => el.click());
await page.waitForTimeout(300);
check('budget edit updates display', (await page.textContent('#app')).includes('of $2,000.00'));
// restore via reset
await page.click('#reset-demo');
await page.waitForTimeout(300);
check('reset restores $1,850 housing budget', (await page.textContent('#app')).includes('of $1,850.00'));

// Goals: contribute
await page.goto('http://127.0.0.1:8124/#/goals', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
check('goals show emergency $5,240', (await page.textContent('#app')).includes('$5,240.00'));
await page.click('button[data-action="add-goal"][data-amount="50"]');
await page.waitForTimeout(300);
check('goal +$50 updates to $5,290', (await page.textContent('#app')).includes('$5,290.00'));
await page.click('#reset-demo');

// Reports: charts + CSV
await page.goto('http://127.0.0.1:8124/#/reports', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const reportsText = await page.textContent('#app');
check('reports show donut + trend', reportsText.includes('Where November') && reportsText.includes('Income vs spending'));
check('reports show top merchants', reportsText.includes('Maple Court Apartments'));
const download = page.waitForEvent('download');
await page.click('button[data-action="export-csv"]');
const dl = await download;
check('CSV export downloads', dl.suggestedFilename().includes('2026-11'));

check('no page errors overall', errors.length === 0);
await browser.close();
server.close();
const failed = results.filter((r) => !r[1]).length;
console.log(failed === 0 ? 'ALL PASS' : failed + ' FAILURES');
process.exit(failed === 0 ? 0 : 1);
