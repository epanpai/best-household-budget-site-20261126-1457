// Take the entry's screenshots with Playwright + the cached Chromium build.
// Serves app/ on localhost, opens each route at the given viewport, waits for
// the module scripts to render, and saves a JPEG (quality 82 keeps each shot
// well under the 256 KiB cap). Run: node shots.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const outDir = resolve(fileURLToPath(new URL('./screenshots', import.meta.url)));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(8123, '127.0.0.1', r));

const shots = [
  { file: '1-dashboard.jpg', path: '#/', width: 1280, height: 800 },
  { file: '2-transactions.jpg', path: '#/transactions', width: 1280, height: 800 },
  { file: '3-budgets.jpg', path: '#/budgets', width: 1280, height: 800 },
  { file: '4-dashboard-phone.jpg', path: '#/', width: 390, height: 844 },
];

const browser = await chromium.launch({
  executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://127.0.0.1:8123/' + shot.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, shot.file), type: 'jpeg', quality: 82 });
  console.log(shot.file, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'ok');
  await page.close();
}
await browser.close();
server.close();
console.log('done');
