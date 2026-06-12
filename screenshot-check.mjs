import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:3001';
const OUT = '/tmp/sanghi-screenshots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(60000);

// Pre-warm both routes
console.log('Loading homepage...');
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

// 1. Hero / above fold
await page.screenshot({ path: `${OUT}/01-hero.png` });
console.log('01-hero saved');

// 2. Our Full Range section
await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('Full Range'));
  el?.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/02-our-full-range.png` });
console.log('02-our-full-range saved');

// 3. 500+ Parts section (flat, no iPad animation)
await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('500+'));
  el?.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/03-500-parts.png` });
console.log('03-500-parts saved');

// 4. Featured Products (The Standard of Quality)
await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('Standard'));
  el?.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/04-featured-products.png` });
console.log('04-featured-products saved');

// 5. Products page
console.log('Loading /products...');
await page.goto(`${BASE}/products`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
await page.screenshot({ path: `${OUT}/05-products-page.png` });
console.log('05-products-page saved');

await browser.close();
console.log('All screenshots saved to', OUT);
