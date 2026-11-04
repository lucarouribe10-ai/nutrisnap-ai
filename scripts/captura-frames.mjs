// Toma los frames de teléfono de las vistas previas HTML (docs/revisiones) para el carrusel de la landing.
import { chromium } from '@playwright/test';
import path from 'node:path';
const root = path.resolve('docs/revisiones');
const jobs = [
  ['vista-previa-app.html', 1, 'primer-resultado'],
  ['vista-previa-app.html', 3, 'hoy'],
  ['vista-previa-app.html', 4, 'logros'],
  ['direcciones-abc-combinacion.html', 1, 'chequeo'],
  ['direcciones-abc-combinacion.html', 2, 'escaner'],
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2 });
let cur = '';
for (const [file, idx, name] of jobs) {
  if (file !== cur) { await page.goto('file://' + path.join(root, file), { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); cur = file; }
  const el = page.locator('.telefono').nth(idx);
  await el.scrollIntoViewIfNeeded();
  const bb = await el.boundingBox();
  const sy = await page.evaluate(() => window.scrollY);
  // Se recorta el bisel del teléfono: el carrusel de la landing pone su propio marco.
  const clip = { x: bb.x + 12, y: bb.y + sy + 12, width: bb.width - 24, height: bb.height - 24 };
  await page.screenshot({ path: `public/app-preview/${name}.png`, clip, fullPage: true });
  console.log('ok', name);
}
await browser.close();
