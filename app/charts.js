// Hearth Ledger — hand-rolled SVG charts. No libraries: the whole first load
// stays a few kilobytes, and every chart is drawn from the same data the
// tables show, so chart and table can never disagree.
import { money } from './data.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

// Horizontal bars: one row per category, spent vs its budget line.
export function budgetBars(rows, width = 640) {
  const rowH = 34;
  const height = rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => Math.max(r.spent, r.budget)), 1);
  const labelW = 118;
  const barW = width - labelW - 150;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Spending against budget by category" width="100%">`;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const spentW = Math.max(2, (r.spent / max) * barW);
    const budgetX = labelW + (r.budget / max) * barW;
    const over = r.spent > r.budget;
    out += `<text x="0" y="${y + 15}" font-size="13" fill="#22302a">${esc(r.label)}</text>`;
    out += `<rect x="${labelW}" y="${y + 2}" width="${spentW}" height="16" rx="4" fill="${over ? '#b3402a' : r.color}"/>`;
    out += `<line x1="${budgetX}" y1="${y}" x2="${budgetX}" y2="${y + 20}" stroke="#22302a" stroke-width="2"/>`;
    out += `<text x="${labelW + barW + 10}" y="${y + 15}" font-size="13" fill="#22302a">${money(r.spent)} / ${money(r.budget)}</text>`;
  });
  out += '</svg>';
  return out;
}

// Donut: share of spending by category.
export function donut(rows, size = 260) {
  const total = rows.reduce((s, r) => s + r.spent, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 8;
  const rInner = rOuter * 0.58;
  let angle = -Math.PI / 2;
  let paths = '';
  for (const row of rows) {
    if (row.spent <= 0) continue;
    const frac = row.spent / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + rOuter * Math.cos(a0);
    const y0 = cy + rOuter * Math.sin(a0);
    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const x2 = cx + rInner * Math.cos(a1);
    const y2 = cy + rInner * Math.sin(a1);
    const x3 = cx + rInner * Math.cos(a0);
    const y3 = cy + rInner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z" fill="${row.color}"><title>${esc(row.label)}: ${money(row.spent)}</title></path>`;
  }
  const legend = rows
    .filter((r) => r.spent > 0)
    .map((r) => `<li><span class="swatch" style="background:${r.color}"></span>${esc(r.label)} — ${money(r.spent)} (${Math.round((r.spent / total) * 100)}%)</li>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Share of spending by category" width="${size}" height="${size}">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="#5c6b62">Total spent</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="19" font-weight="700" fill="#22302a">${money(total)}</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Grouped bars: income vs spending across months.
export function monthlyBars(months, width = 640) {
  const barW = 26;
  const gap = 14;
  const groupW = barW * 2 + gap;
  const step = groupW + 34;
  const height = 240;
  const top = 24;
  const bottom = height - 30;
  const max = Math.max(...months.flatMap((m) => [m.income, m.spent]), 1);
  const scale = (v) => (v / max) * (bottom - top);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income against spending by month" width="100%">`;
  out += `<line x1="0" y1="${bottom}" x2="${width}" y2="${bottom}" stroke="#22302a" stroke-width="1"/>`;
  months.forEach((m, i) => {
    const x = 30 + i * step;
    const ih = scale(m.income);
    const sh = scale(m.spent);
    out += `<rect x="${x}" y="${bottom - ih}" width="${barW}" height="${ih}" rx="3" fill="#2e7d5b"><title>${esc(m.label)} income ${money(m.income)}</title></rect>`;
    out += `<rect x="${x + barW + gap}" y="${bottom - sh}" width="${barW}" height="${sh}" rx="3" fill="#c96f4a"><title>${esc(m.label)} spending ${money(m.spent)}</title></rect>`;
    out += `<text x="${x + barW}" y="${bottom + 18}" text-anchor="middle" font-size="13" fill="#22302a">${esc(m.label)}</text>`;
  });
  out += `<g font-size="13" fill="#22302a"><rect x="${width - 210}" y="0" width="12" height="12" fill="#2e7d5b"/><text x="${width - 194}" y="11">Income</text><rect x="${width - 120}" y="0" width="12" height="12" fill="#c96f4a"/><text x="${width - 104}" y="11">Spending</text></g>`;
  out += '</svg>';
  return out;
}
