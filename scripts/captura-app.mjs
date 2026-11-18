// Captura las pantallas REALES de la app (modo demo) para el carrusel «Así se ve por dentro» de la landing.
// Uso: con el servidor sin login corriendo (preview "nutrisnap-sin-login"): node scripts/captura-app.mjs [url-base]
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3000';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.addInitScript(() => { const st = document.createElement('style'); st.textContent = 'nextjs-portal{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
const out = (n) => `public/app-preview/${n}.jpg`;
const shot = async (n) => { await p.waitForTimeout(1500); await p.screenshot({ path: out(n), type: 'jpeg', quality: 88 }); console.log('ok', n); };

await p.goto(`${base}/app`, { waitUntil: 'networkidle' });
await shot('hoy');
await p.goto(`${base}/app/logros`, { waitUntil: 'networkidle' });
await shot('logros');
await p.goto(`${base}/app/progreso`, { waitUntil: 'networkidle' });
await shot('progreso');
await p.goto(`${base}/app/registrar`, { waitUntil: 'networkidle' });
await p.getByRole('button', { name: /ejemplo/i }).first().click();
await p.waitForSelector('text=Chequeo de Grasas Ocultas');
await p.getByRole('button', { name: /1 cucharada/i }).first().click();
await shot('primer-resultado');
await p.getByRole('group', { name: /Cantidad de aceite/i }).scrollIntoViewIfNeeded();
await p.evaluate(() => window.scrollBy(0, 260));
await shot('chequeo');
await browser.close();
