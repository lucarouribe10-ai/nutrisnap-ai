// Uso: node scripts/screenshot.mjs <url> <salida.png> [ancho=375]
// Recorre la página para disparar las animaciones de entrada y toma captura completa.
import { chromium } from '@playwright/test';
const [url, out, w = '375'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 812 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(160); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: true });
const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ out, altura: h, desbordeHorizontal: ov }));
await browser.close();
