// Compara tratamientos de color sobre la app REAL (inyecta CSS): actual / bordes / pálido / combinado.
import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3000';
const BORDE = `
[class*="bg-[var(--lima)]"], [class*="var(--tint)"], [class*="216_240_174"] { background: var(--surface) !important; border: 2px solid #C6E88F !important; box-shadow: none !important; backdrop-filter: none !important; }
[class*="bg-[var(--durazno)]"] { background: var(--surface) !important; border: 2px solid #FFD3A3 !important; }
[class*="bg-[var(--cielo)]"] { background: var(--surface) !important; border: 2px solid #BCE0F2 !important; }
[style*="var(--lima)"] { background: var(--surface) !important; border: 2px solid #C6E88F !important; }
[style*="var(--durazno)"] { background: var(--surface) !important; border: 2px solid #FFD3A3 !important; }
[style*="var(--cielo)"] { background: var(--surface) !important; border: 2px solid #BCE0F2 !important; }`;
const PALIDO = `:root{--lima:#EEF7DE;--lima-2:#D9EDB4;--tint:#EEF7DE;--tint-deep:#E2F1C4;--durazno:#FFF1E2;--cielo:#E8F4FA}
[class*="216_240_174"]{background:rgb(238 247 222/.94) !important}`;
const COMBINADO = BORDE + `
section[aria-label="Tu día"], section[aria-label="Tu peso"] { background: #D8F0AE !important; border: none !important; }`;
const variantes = { actual: '', bordes: BORDE, palido: PALIDO, combinado: COMBINADO };
const paginas = { hoy: '/app', progreso: '/app/progreso' };
const browser = await chromium.launch();
for (const [vn, css] of Object.entries(variantes)) {
  for (const [pn, ruta] of Object.entries(paginas)) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 760 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto(base + ruta, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' + css });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `docs/revisiones/estilo-v3/colores/${pn}-${vn}.png` });
    await ctx.close();
  }
}
await browser.close();
console.log('ok');
