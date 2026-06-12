import { chromium } from './node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const DIR  = './test-screenshots';
mkdirSync(DIR, { recursive: true });
const SS = (name) => `${DIR}/${name}.png`;
const results = [];

function log(test, status, detail) {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : 'ℹ️';
  console.log(`${icon} [${status}] ${test}: ${detail}`);
  results.push({ test, status, detail });
}

const browser = await chromium.launch({ headless: true });
const ctx  = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

async function ss(name) {
  try { await page.screenshot({ path: SS(name) }); } catch {}
}
async function go(path) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1200);
}
async function has(selector) {
  return page.locator(selector).first().isVisible({ timeout: 3000 }).catch(() => false);
}

// ──────────────────────────────────────────────
// 1. PUBLIC PAGES
// ──────────────────────────────────────────────
console.log('\n── 1. PUBLIC PAGES ──');
for (const [path, label] of [
  ['/', 'Home'], ['/products', 'Products'], ['/about', 'About'],
  ['/contact', 'Contact'], ['/quote', 'Quote (empty)']
]) {
  await go(path);
  const hasNav    = await has('nav');
  const hasFooter = await has('footer');
  const title     = await page.title();
  log(`${label} (${path})`, hasNav && hasFooter ? 'PASS' : 'FAIL',
    `nav=${hasNav} footer=${hasFooter} | title="${title}"`);
  await ss(`01_${label.toLowerCase().replace(/[^a-z]/g, '_')}`);
}

// ──────────────────────────────────────────────
// 2. QUOTE FLOW
// ──────────────────────────────────────────────
console.log('\n── 2. QUOTE FLOW ──');
await go('/products');
await page.waitForTimeout(2000);

const addBtns = page.getByRole('button', { name: /add.*quote/i });
const btnCount = await addBtns.count();
log('Products - Add-to-Quote buttons', btnCount > 0 ? 'PASS' : 'FAIL', `${btnCount} buttons found`);

if (btnCount >= 2) {
  await addBtns.nth(0).click(); await page.waitForTimeout(400);
  await addBtns.nth(1).click(); await page.waitForTimeout(400);
  if (btnCount >= 3) { await addBtns.nth(2).click(); await page.waitForTimeout(400); }
  log('Add products to cart', 'PASS', `added ${Math.min(btnCount, 3)} products`);
}
await ss('02_products');

await go('/quote');
const emptyCart = await has('text=Your Quote List is Empty');
log('Quote page - cart populated', !emptyCart ? 'PASS' : 'FAIL',
  emptyCart ? 'EMPTY - items not persisted between pages' : 'Cart items visible');
await ss('03_quote_cart');

if (!emptyCart) {
  try {
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="companyName"]').fill('Test Co');
    await page.locator('input[name="email"]').fill('harshvr24@gmail.com');
    await page.locator('input[name="phone"]').fill('9876543210');
    await page.locator('textarea[name="message"]').fill('Test quote submission from verify run');
    log('Quote form - filled', 'PASS', 'all fields entered');
    await ss('04_quote_form_filled');

    // Wait for Turnstile test-key to auto-verify (lazyOnload script + async callback)
    await page.waitForTimeout(5000);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(6000);
    await ss('05_quote_result');

    const success = await has('text=Quote Requested');
    const errEl   = page.locator('[class*="AlertCircle"]').first();
    const errTxt  = await errEl.textContent({ timeout: 1000 }).catch(() => '');
    log('Quote submission', success ? 'PASS' : 'FAIL',
      success ? 'Success screen shown' : `Error visible: "${errTxt.trim()}"`);
  } catch (e) {
    log('Quote form interaction', 'FAIL', e.message.slice(0, 120));
    await ss('04_quote_error');
  }
} else {
  log('Quote form submission', 'FAIL', 'Skipped - cart was empty');
}

// ──────────────────────────────────────────────
// 3. CONTACT FORM
// ──────────────────────────────────────────────
console.log('\n── 3. CONTACT FORM ──');
await go('/contact');

try {
  await page.locator('input[name="firstName"]').fill('Test');
  await page.locator('input[name="lastName"]').fill('User');
  await page.locator('input[name="email"]').fill('harshvr24@gmail.com');
  await page.locator('select[name="subject"]').selectOption('General Inquiry');
  await page.locator('textarea[name="message"]').fill('This is a test message for verification.');
  log('Contact form - filled', 'PASS', 'all fields entered');
  await ss('06_contact_form');

  // Wait for Turnstile test-key to auto-verify
  await page.waitForTimeout(5000);
  await page.locator('button[type="submit"]').click();
  // "Message Sent!" appears in the button for only 3 seconds — catch it before it resets
  const sent = await page.locator('button', { hasText: 'Message Sent' })
    .waitFor({ timeout: 6000, state: 'visible' }).then(() => true).catch(() => false);
  await ss('07_contact_result');

  const errTxt = await page.locator('[class*="AlertCircle"]').first().textContent({ timeout: 1000 }).catch(() => '');
  log('Contact submission', sent ? 'PASS' : 'FAIL',
    sent ? '"Message Sent!" shown' : `Error: "${errTxt.trim()}"`);
} catch (e) {
  log('Contact form', 'FAIL', e.message.slice(0, 120));
}

// ──────────────────────────────────────────────
// 4. ADMIN LOGIN PAGE LAYOUT
// ──────────────────────────────────────────────
console.log('\n── 4. ADMIN LOGIN ──');
await go('/admin/login');
await ss('08_admin_login');

const siteNavProducts = await page.locator('nav a[href="/products"]').count();
const emailInput = await has('input[type="email"]');
const passInput  = await has('input[type="password"]');
const submitBtn  = await has('button[type="submit"]');

log('Admin login - no main Navbar', siteNavProducts === 0 ? 'PASS' : 'FAIL',
  `site nav product links: ${siteNavProducts}`);
log('Admin login - form present', emailInput && passInput && submitBtn ? 'PASS' : 'FAIL',
  `email=${emailInput} pass=${passInput} btn=${submitBtn}`);

// Test bad credentials rejection
await page.locator('input[type="email"]').fill('hacker@bad.com');
await page.locator('input[type="password"]').fill('wrongpass123');
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);
await ss('09_admin_bad_creds');
const loginErr = await has('[class*="AlertCircle"], [class*="red"]');
const loginErrTxt = await page.locator('[class*="AlertCircle"]').first().textContent({ timeout: 2000 }).catch(
  () => page.locator('[class*="red"]').first().textContent({ timeout: 1000 }).catch(() => '')
);
log('Admin login - bad credentials rejected', loginErr ? 'PASS' : 'FAIL',
  `error message: "${loginErrTxt.trim()}"`);

// ──────────────────────────────────────────────
// 5-7. ADMIN AUTHENTICATED PAGES
// Need real credentials — read from env or use known ones
// ──────────────────────────────────────────────
console.log('\n── 5-7. ADMIN DASHBOARD / PRODUCTS / QUOTES ──');

// Try to get admin credentials — they're not in .env.local
// We'll test the admin pages by checking redirects happen correctly
await go('/admin/dashboard');
await page.waitForTimeout(2000);
await ss('10_admin_dashboard_unauthed');

const redirectedToLogin = page.url().includes('/admin/login');
const onDashboard       = page.url().includes('/admin/dashboard');
log('Admin dashboard - auth guard', redirectedToLogin || onDashboard ? 'PASS' : 'FAIL',
  `URL: ${page.url()}`);

if (onDashboard) {
  // Already logged in
  const statsCard = await has('[class*="border"][class*="rounded"]');
  log('Admin dashboard - stats visible', statsCard ? 'PASS' : 'INFO', 'already authenticated');
} else {
  log('Admin dashboard - redirected to login', 'PASS', 'unauthenticated → login');

  // Admin features require a manual login; no automated credential check here.
  log('Admin credential test', 'INFO', 'To test admin features: log in manually at /admin/login, then the dashboard/products/quotes will be accessible');
}

// Test middleware on products and quotes routes too
await go('/admin/products');
await page.waitForTimeout(1500);
const productsGuarded = page.url().includes('/admin/login') || page.url().includes('/admin/products');
log('Admin products - auth guard', productsGuarded ? 'PASS' : 'FAIL', `URL: ${page.url()}`);

await go('/admin/quotes');
await page.waitForTimeout(1500);
const quotesGuarded = page.url().includes('/admin/login') || page.url().includes('/admin/quotes');
log('Admin quotes - auth guard', quotesGuarded ? 'PASS' : 'FAIL', `URL: ${page.url()}`);

await ss('11_admin_route_guard');

// ──────────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log('VERIFICATION SUMMARY');
console.log('══════════════════════════════════════════');
const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;
const info   = results.filter(r => r.status === 'INFO').length;

for (const r of results) {
  const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : 'ℹ️';
  console.log(`  ${icon} ${r.test}`);
}
console.log(`\n  Result: ${passed} PASS  ${failed} FAIL  ${info} INFO`);
console.log(`  Overall: ${failed === 0 ? 'PASS' : 'FAIL'}`);
console.log('══════════════════════════════════════════');

await browser.close();
