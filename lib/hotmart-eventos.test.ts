import test from 'node:test';
import assert from 'node:assert/strict';
import { accesoVigente, iguales, interpretarEvento, renuevaEl } from './hotmart-eventos.ts';

const base = (event: string, extra: Record<string, unknown> = {}) => ({
  id: 'evt-1', creation_date: 1700000000000, event,
  data: { product: { id: 9016066 }, buyer: { email: 'Cliente@Correo.com' }, purchase: { transaction: 'HP123', offer: { code: 'nqzy8nwo' }, price: { value: 9.99, currency_value: 'usd' } }, ...extra },
});

test('compra aprobada con valor > 0 → activo; correo en minúsculas; valor en centavos', () => {
  const e = interpretarEvento(base('PURCHASE_APPROVED'));
  assert.equal(e.estado, 'activo'); assert.equal(e.email, 'cliente@correo.com'); assert.equal(e.valorMinor, 999); assert.equal(e.moneda, 'USD'); assert.equal(e.productoId, '9016066'); assert.equal(e.oferta, 'nqzy8nwo');
});
test('compra con valor 0 → prueba', () => {
  const p = base('PURCHASE_APPROVED'); (p.data.purchase.price as { value: number }).value = 0;
  assert.equal(interpretarEvento(p).estado, 'prueba');
});
test('reembolso y contracargo cortan; cancelación no corta de golpe', () => {
  assert.equal(interpretarEvento(base('PURCHASE_REFUNDED')).estado, 'reembolsado');
  const c = interpretarEvento(base('PURCHASE_CHARGEBACK')); assert.equal(c.estado, 'reembolsado'); assert.equal(c.baja, 'contracargo');
  const x = interpretarEvento(base('SUBSCRIPTION_CANCELLATION')); assert.equal(x.estado, 'cancelado');
  assert.deepEqual(renuevaEl(x, 'mensual', 1000), { renueva: null, pruebaHasta: null });
});
test('evento desconocido es informativo; basura no revienta', () => {
  assert.equal(interpretarEvento(base('ALGO_NUEVO')).estado, null);
  const e = interpretarEvento(null); assert.equal(e.estado, null); assert.equal(e.email, null);
  assert.equal(interpretarEvento({ event: 5, data: 'x' }).estado, null);
});
test('id del evento estable; sin id se arma de forma determinista', () => {
  assert.equal(interpretarEvento(base('PURCHASE_APPROVED')).eventoId, 'evt-1');
  const p = base('PURCHASE_APPROVED') as Record<string, unknown>; delete p.id;
  assert.equal(interpretarEvento(p).eventoId, interpretarEvento(p).eventoId);
});
test('prueba: 7 días + gracia; activo mensual sin fecha: ~30 días + gracia', () => {
  const dia = 86_400_000;
  const pr = renuevaEl({ ...interpretarEvento(base('PURCHASE_APPROVED')), estado: 'prueba' }, 'anual', 0);
  assert.equal(pr.pruebaHasta, 7 * dia); assert.equal(pr.renueva, 10 * dia);
  const ac = renuevaEl(interpretarEvento(base('PURCHASE_APPROVED')), 'mensual', 0);
  assert.equal(ac.renueva, 33 * dia);
  const atrasado = renuevaEl(interpretarEvento(base('PURCHASE_DELAYED')), 'mensual', 0);
  assert.equal(atrasado.renueva, 3 * dia);
});
test('reglas de acceso', () => {
  const futuro = new Date(Date.now() + 86_400_000).toISOString(); const pasado = new Date(Date.now() - 86_400_000).toISOString();
  assert.equal(accesoVigente(null), false);
  assert.equal(accesoVigente({ plan: 'mensual', estado: 'activo', renueva_el: futuro }), true);
  assert.equal(accesoVigente({ plan: 'mensual', estado: 'activo', renueva_el: pasado }), false);
  assert.equal(accesoVigente({ plan: 'anual', estado: 'prueba', renueva_el: futuro }), true);
  assert.equal(accesoVigente({ plan: 'mensual', estado: 'cancelado', renueva_el: futuro }), true);
  assert.equal(accesoVigente({ plan: 'mensual', estado: 'cancelado', renueva_el: pasado }), false);
  assert.equal(accesoVigente({ plan: 'mensual', estado: 'reembolsado', renueva_el: futuro }), false);
  assert.equal(accesoVigente({ plan: 'free', estado: 'ninguno', renueva_el: null }), false);
  assert.equal(accesoVigente({ plan: 'free', estado: 'activo', renueva_el: null }), false);
  assert.equal(accesoVigente({ plan: 'cortesia', estado: 'activo', renueva_el: futuro }), true);
});
test('comparación del hottok en tiempo constante', () => {
  assert.equal(iguales('abc', 'abc'), true); assert.equal(iguales('abc', 'abd'), false); assert.equal(iguales('abc', 'abcd'), false); assert.equal(iguales('', 'x'), false);
});
