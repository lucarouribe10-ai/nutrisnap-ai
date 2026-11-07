// Uso: node scripts/screenshot-secciones.mjs <url> <carpeta-salida> [ancho=375]
// Una captura por sección de la landing (hijos directos del contenedor raíz) a ese ancho.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [url, outDir, w = '375'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 812 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.setViewportSize({ width: Number(w), height: h });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1800);
const n = await page.evaluate(() => document.querySelector('body > div.min-h-dvh')?.children.length ?? 0);
for (let i = 0; i < n; i++) {
  const el = page.locator('body > div.min-h-dvh').first().locator(':scope > *').nth(i);
  const box = await el.boundingBox();
  if (!box || box.height < 20) continue;
  const label = await el.evaluate((e) => (e.getAttribute('aria-label') || e.id || e.tagName).toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '-').slice(0, 30));
  await el.screenshot({ path: `${outDir}/${String(i + 1).padStart(2, '0')}-${label}.png` });
  console.log(String(i + 1).padStart(2, '0'), label, Math.round(box.height));
}
await browser.close();
