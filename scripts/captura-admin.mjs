// Captura las 4 pestañas del panel (Resumen, Salud, Uso, Costo de IA) con datos de EJEMPLO, a 375 y 1440 px.
// Uso: con el servidor sin login corriendo (preview "nutrisnap-sin-login"): node scripts/captura-admin.mjs [url-base]
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3000';
const browser = await chromium.launch();
for (const [w, h, nombre] of [[375, 812, '375'], [1440, 900, '1440']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(() => { const st = document.createElement('style'); st.textContent = 'nextjs-portal{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  for (const v of ['resumen', 'salud', 'uso', 'ia']) {
    for (const e of ['vacio', 'lleno']) {
      await p.goto(`${base}/dev/admin?v=${v}&e=${e}`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(2200);
      const f = `docs/revisiones/admin-${v}-${e}-${nombre}.png`;
      await p.screenshot({ path: f, fullPage: true });
      console.log('ok', f);
    }
  }
  await ctx.close();
}
await browser.close();
