// Uso: node scripts/screenshot.mjs <url> <salida.png> [ancho=375]
// Captura la página COMPLETA a ese ancho: agranda el viewport a la altura total (evita los
// artefactos de fullPage con secciones sticky/animadas) y espera a que terminen las animaciones.
import { chromium } from '@playwright/test';
const [url, out, w = '375'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: 812 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.setViewportSize({ width: Number(w), height: h });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1800);
await page.screenshot({ path: out });
const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ out, altura: h, desbordeHorizontal: ov }));
await browser.close();
