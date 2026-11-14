// Prueba la IA real con las fotos de la carpeta pruebas-fotos/ y muestra una tabla simple.
// Uso: node scripts/probar-fotos.mjs [url-base]   (por defecto http://localhost:3000)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
const base = process.argv[2] ?? 'http://localhost:3000';
const dir = path.resolve('pruebas-fotos');
const usarNotas = process.argv.includes('--notas');
const fotos = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f)).sort();
if (!fotos.length) { console.log('No hay fotos en pruebas-fotos/. Copia 3 o 4 y vuelve a correr.'); process.exit(0); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ns-'));
const filas = [];
for (const f of fotos) {
  const src = path.join(dir, f);
  const out = path.join(tmp, 'x.jpg');
  // Se reduce a 1024 px de lado largo (como haría la app) para no pasar el límite de tamaño.
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '75', '--resampleHeightWidthMax', '1024', src, '--out', out], { stdio: 'ignore' });
  const b64 = fs.readFileSync(out).toString('base64');
  const t0 = Date.now();
  const r = await fetch(`${base}/api/analizar`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imagen: `data:image/jpeg;base64,${b64}`, nota: usarNotas && fs.existsSync(src.replace(/\.[^.]+$/, '.txt')) ? fs.readFileSync(src.replace(/\.[^.]+$/, '.txt'), 'utf8') : undefined }) });
  const j = await r.json().catch(() => ({}));
  const seg = ((Date.now() - t0) / 1000).toFixed(1);
  filas.push(r.ok ? { foto: f, plato: j.plato, kcal: j.kcal, aceite: j.pregunta_aceite?.texto, prot: j.proteina_g, carbos: j.carbos_g, grasas: j.grasas_g, real: j.demo === false ? 'sí' : 'NO (demo)', seg } : { foto: f, plato: `ERROR ${r.status} ${j.error ?? ''}`, seg });
  await new Promise((res) => setTimeout(res, 1500));
}
console.table(filas);
