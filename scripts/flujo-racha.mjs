// Prueba las reglas de racha, escudo, logros y el primer día real. Capturas en docs/revisiones/racha/.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:3100';
const out = 'docs/revisiones/racha';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const errores = [];
const nueva = async () => {
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errores.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  return p;
};
const iso = (dias) => { const d = new Date(Date.now() - dias * 86_400_000); return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10); };
const shot = async (p, n, full = false) => { await p.waitForTimeout(1300); await p.screenshot({ path: `${out}/${n}.png`, fullPage: full }); console.log('captura', n); };
const editar = (p, fn) => p.evaluate(`(() => { const k='ns_app_v2'; const d=JSON.parse(localStorage.getItem(k)); (${fn.toString()})(d); localStorage.setItem(k, JSON.stringify(d)); })()`);

// 1) DEMO: racha clara en Hoy + ayuda en Logros
let p = await nueva();
await p.goto(`${base}/app`, { waitUntil: 'networkidle' });
await shot(p, '01-hoy-racha');
await p.getByRole('link', { name: 'Logros', exact: true }).click(); await p.waitForURL('**/logros');
await shot(p, '02-logros', true);
await p.getByRole('button', { name: /Cómo funciona/ }).click();
await shot(p, '03-ayuda-puntos');
await p.keyboard.press('Escape').catch(() => {});

// 2) Celebración: racha de 2 → 3 al registrar hoy
await p.goto(`${base}/app`, { waitUntil: 'networkidle' });
await editar(p, (d) => { d.racha = 2; d.mejorRacha = 2; d.ultimoRegistro = (() => { const x = new Date(Date.now() - 86400000); return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10); })(); d.comidasHoy = []; d.kcalSemana[6] = 0; d.logros = d.logros.filter((x) => x !== 'racha_3'); d.xp = 295; });
await p.reload({ waitUntil: 'networkidle' });
const txt = await p.getByText(/días seguidos|día seguido/).first().innerText();
console.log('Hoy muestra:', txt.replace(/\n/g, ' '));
await shot(p, '04-hoy-racha-2');
await p.getByRole('link', { name: 'Registrar una comida' }).click(); await p.waitForURL('**/registrar');
await p.getByRole('button', { name: /foto de ejemplo/ }).click();
await p.getByText('Con el Chequeo').waitFor({ timeout: 15000 });
await p.getByRole('button', { name: /1 cucharada/ }).click();
await p.getByRole('button', { name: 'Guardar en mi día' }).click();
await p.getByText('Guardado en tu día').waitFor();
await shot(p, '05-celebracion-hitos');
const hitos = await p.getByRole('list', { name: 'Lo que lograste' }).innerText().catch(() => '(sin hitos)');
console.log('Hitos:', hitos.replace(/\n+/g, ' | '));

// 3) Escudo: falta 1 día → protege; faltan 2 → pausa
for (const [faltan, esperado] of [[1, 'escudo'], [2, 'pausa']]) {
  p = await nueva();
  await p.goto(`${base}/app`, { waitUntil: 'networkidle' });
  await editar(p, (d) => { d.escudos = 1; });
  await p.evaluate(`(() => { const k='ns_app_v2'; const d=JSON.parse(localStorage.getItem(k)); const f=${faltan}; const x=(n)=>{const t=new Date(Date.now()-n*86400000);return new Date(t.getTime()-t.getTimezoneOffset()*60000).toISOString().slice(0,10)}; d.fecha=x(f+1); d.ultimoRegistro=x(f+1); localStorage.setItem(k, JSON.stringify(d)); })()`);
  await p.reload({ waitUntil: 'networkidle' });
  const aviso = await p.getByRole('status').first().innerText().catch(() => '(sin aviso)');
  console.log(`faltan ${faltan} día(s) →`, aviso.replace(/\n/g, ' '), '| esperado:', esperado);
  if (faltan === 1) await shot(p, '06-escudo-protege');
  if (faltan === 2) await shot(p, '07-racha-pausa');
}

// 4) Primer día REAL: sin datos de Mateo
p = await nueva();
await p.goto(`${base}/app`, { waitUntil: 'networkidle' });
await p.evaluate(`(() => { localStorage.removeItem('ns_app_v2'); localStorage.setItem('ns_onb_v1', JSON.stringify({ perfil: { nombre: 'Laura', dolor: 'aceite', objetivo: 'definir', sexo: 'mujer', edad: 31, estatura: 165, peso: 68, meta: 62, dias: 4 }, resultado: { plato: 'Ensalada fresca', kcalBase: 440, proteina: 38, carbos: 41, grasas: 14, extraAceite: 120, demo: true }, xp: 25 })); })()`);
await p.reload({ waitUntil: 'networkidle' });
await shot(p, '08-primer-dia-real');
const real = await p.getByText(/Vista previa con datos de ejemplo/).count();
console.log('primer día real: banner de ejemplo =', real, '(debe ser 0)');
console.log('racha mostrada:', (await p.getByText(/día seguido|días seguidos/).first().innerText()).replace(/\n/g, ' '));
await p.getByRole('link', { name: 'Progreso', exact: true }).click(); await p.waitForURL('**/progreso');
await shot(p, '09-progreso-primer-dia', true);
await p.getByLabel(/Registrar mi peso/).fill('67,5');
await p.getByRole('button', { name: 'Guardar' }).click();
await p.waitForTimeout(600);
console.log('peso registrado → texto:', (await p.getByText(/Peso actual/).first().innerText()).replace(/\n/g, ' '));
await p.getByRole('link', { name: 'Logros', exact: true }).click(); await p.waitForURL('**/logros');
await shot(p, '10-logros-primer-dia', true);
console.log('errores de consola:', errores.length ? errores.slice(0, 4) : 'ninguno');
await b.close();
