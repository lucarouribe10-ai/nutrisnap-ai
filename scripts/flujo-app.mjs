// Recorre la app interna a 375px (y mide desborde a 360px): Hoy, Progreso, Logros, Perfil y el registro de una comida.
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3100';
const out = 'docs/revisiones/app';
const b = await chromium.launch();
const errores = [];
async function nueva(w) {
  const p = await b.newPage({ viewport: { width: w, height: 812 }, deviceScaleFactor: 2 });
  p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  p.on('pageerror', (e) => errores.push(String(e)));
  return p;
}
const p = await nueva(375);
const shot = async (n, full = false) => { await p.waitForTimeout(1400); await p.screenshot({ path: `${out}/${n}.png`, fullPage: full }); console.log('captura', n); };
await p.goto(`${base}/app?qa=1`, { waitUntil: 'networkidle' });
await shot('01-hoy');
// control y libertad: abrir detalle, eliminar y deshacer
await p.getByRole('button', { name: /Batido de proteína/ }).click();
await shot('01b-detalle-comida');
await p.getByRole('button', { name: 'Eliminar' }).click();
await p.getByText(/Eliminaste/).waitFor();
const sinBatido = await p.getByRole('button', { name: /Batido de proteína/ }).count();
await p.getByRole('button', { name: 'Deshacer' }).click();
await p.getByRole('button', { name: /Batido de proteína/ }).waitFor();
console.log('eliminar→deshacer OK (tras eliminar había', sinBatido, 'filas del batido)');
const kcalAntes = await p.getByText(/de .* kcal/).first().innerText();
await p.getByRole('link', { name: 'Progreso' }).click(); await p.waitForURL('**/progreso'); await shot('02-progreso', true);
await p.getByRole('link', { name: 'Logros' }).click(); await p.waitForURL('**/logros'); await shot('03-logros', true);
await p.getByRole('link', { name: 'Perfil' }).click(); await p.waitForURL('**/perfil'); await shot('04-perfil', true);
await p.getByRole('link', { name: 'Registrar una comida' }).click(); await p.waitForURL('**/registrar'); await shot('05-registrar');
await p.getByRole('button', { name: /foto de ejemplo/ }).click();
await p.getByText('Con el Chequeo').waitFor({ timeout: 15000 });
await p.getByRole('button', { name: /1 cucharada/ }).click();
await shot('06-registrar-resultado', true);
await p.getByRole('button', { name: 'Guardar en mi día' }).click();
await p.getByText('Guardado en tu día').waitFor();
await shot('07-guardado');
await p.getByRole('button', { name: 'Volver a Hoy' }).click(); await p.waitForURL('**/app');
await shot('08-hoy-actualizado', true);
const kcalDespues = await p.getByText(/de .* kcal/).first().innerText();
console.log('kcal antes/después:', kcalAntes.replace(/\n/g, ' '), '→', kcalDespues.replace(/\n/g, ' '));
// desborde horizontal a 375 y 360
for (const w of [375, 360]) {
  const q = await nueva(w);
  for (const r of ['/app', '/app/progreso', '/app/logros', '/app/perfil', '/app/registrar']) {
    await q.goto(base + r, { waitUntil: 'networkidle' });
    const ov = await q.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ov > 0) console.log('DESBORDE', w, r, ov);
  }
  await q.close();
}
console.log('errores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
await b.close();
