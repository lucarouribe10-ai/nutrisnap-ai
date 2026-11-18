'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { adminOrNull } from '@/lib/admin/guard';
import { createAdminClient, adminDisponible } from '@/lib/supabase/admin';

export type Resultado = { ok: boolean; mensaje: string } | null;

const DIA = 86_400_000;
const NO_AUTORIZADO: Resultado = { ok: false, mensaje: 'No tienes permiso para hacer esto.' };

const Alta = z.object({
  email: z.string().trim().toLowerCase().email('Escribe un correo válido.').max(254),
  nombre: z.string().trim().min(1, 'Escribe el nombre.').max(40, 'El nombre es muy largo (máximo 40).'),
  dias: z.coerce.number().int().min(1, 'Los días deben ser entre 1 y 365.').max(365, 'Los días deben ser entre 1 y 365.'),
  motivo: z.string().trim().max(200, 'El motivo es muy largo (máximo 200).').optional(),
});

async function auditar(adm: ReturnType<typeof createAdminClient>, adminId: string, accion: string, objetivo: string, detalle: Record<string, unknown>) {
  const { error } = await adm.from('admin_audit').insert({ admin_id: adminId, accion, objetivo, detalle });
  if (error) console.error('[admin] no se pudo registrar la acción:', error.code);
}

/** Alta manual: crea la cuenta (o usa la que ya existe) y le da acceso de cortesía. Todo queda en el registro de acciones. */
export async function altaManual(_prev: Resultado, formData: FormData): Promise<Resultado> {
  const quien = await adminOrNull();
  if (!quien) return NO_AUTORIZADO;
  if (!adminDisponible()) return { ok: false, mensaje: 'Falta configurar la clave secreta del servidor.' };
  const p = Alta.safeParse({ email: formData.get('email'), nombre: formData.get('nombre'), dias: formData.get('dias'), motivo: formData.get('motivo') || undefined });
  if (!p.success) return { ok: false, mensaje: p.error.issues[0]?.message ?? 'Revisa los datos.' };
  const { email, nombre, dias, motivo } = p.data;

  const adm = createAdminClient();
  let id: string | null = null;
  let nueva = true;
  const crear = await adm.auth.admin.createUser({ email, email_confirm: true, user_metadata: { nombre } });
  if (crear.data?.user) {
    id = crear.data.user.id;
  } else {
    const ya = /already|exists|registered/i.test(crear.error?.message ?? '') || crear.error?.code === 'email_exists';
    if (!ya) {
      console.error('[admin] alta manual falló:', crear.error?.code ?? crear.error?.message);
      return { ok: false, mensaje: 'No se pudo crear la cuenta. Intenta de nuevo.' };
    }
    nueva = false;
    const lista = await adm.auth.admin.listUsers({ page: 1, perPage: 200 });
    id = lista.data?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    if (!id) return { ok: false, mensaje: 'Ese correo ya existe pero no pude encontrarlo. Búscalo en la lista.' };
  }

  const hasta = new Date(Date.now() + dias * DIA).toISOString();
  const perfil = await adm.from('profiles').upsert({ id, nombre, ...(nueva ? { creado_via: 'admin' } : {}) }, { onConflict: 'id' });
  const acceso = await adm.from('entitlements').upsert({ user_id: id, plan: 'cortesia', estado: 'activo', renueva_el: hasta, motivo: motivo ?? 'Alta manual', otorgado_por: quien.id }, { onConflict: 'user_id' });
  if (perfil.error || acceso.error) {
    console.error('[admin] alta manual: no se pudo guardar perfil/acceso:', perfil.error?.code, acceso.error?.code);
    return { ok: false, mensaje: 'La cuenta se creó pero no se pudo dar el acceso. Revísala en la lista.' };
  }
  await auditar(adm, quien.id, nueva ? 'alta_manual' : 'dar_acceso', email, { dias, motivo: motivo ?? null, nueva });
  revalidatePath('/admin/usuarios');
  revalidatePath('/admin');
  return { ok: true, mensaje: `${nueva ? 'Cuenta creada' : 'La cuenta ya existía'} para ${email}, con acceso por ${dias} días. Para entrar, la persona pide su código en la página de acceso.` };
}

const Cambio = z.object({ id: z.string().uuid(), accion: z.enum(['dar', 'extender', 'quitar']), dias: z.coerce.number().int().min(1).max(365).default(30) });

/** Da, extiende o quita el acceso de una persona. */
export async function cambiarAcceso(_prev: Resultado, formData: FormData): Promise<Resultado> {
  const quien = await adminOrNull();
  if (!quien) return NO_AUTORIZADO;
  if (!adminDisponible()) return { ok: false, mensaje: 'Falta configurar la clave secreta del servidor.' };
  const p = Cambio.safeParse({ id: formData.get('id'), accion: formData.get('accion'), dias: formData.get('dias') || 30 });
  if (!p.success) return { ok: false, mensaje: 'Datos no válidos.' };
  const { id, accion, dias } = p.data;

  const adm = createAdminClient();
  const actual = await adm.from('entitlements').select('renueva_el').eq('user_id', id).maybeSingle();
  const ahora = Date.now();
  let fila: Record<string, unknown>;
  if (accion === 'quitar') {
    fila = { user_id: id, estado: 'cancelado', renueva_el: new Date(ahora).toISOString(), motivo: 'Acceso quitado por la administradora', otorgado_por: quien.id };
  } else {
    const base = accion === 'extender' && actual.data?.renueva_el ? Math.max(ahora, new Date(actual.data.renueva_el).getTime()) : ahora;
    fila = { user_id: id, plan: 'cortesia', estado: 'activo', renueva_el: new Date(base + dias * DIA).toISOString(), motivo: accion === 'extender' ? 'Acceso extendido manualmente' : 'Acceso dado manualmente', otorgado_por: quien.id };
  }
  const { error } = await adm.from('entitlements').upsert(fila, { onConflict: 'user_id' });
  if (error) {
    console.error('[admin] cambiar acceso falló:', error.code);
    return { ok: false, mensaje: 'No se pudo guardar el cambio. Intenta de nuevo.' };
  }
  await auditar(adm, quien.id, accion === 'quitar' ? 'quitar_acceso' : accion === 'extender' ? 'extender_acceso' : 'dar_acceso', id, { dias: accion === 'quitar' ? null : dias });
  revalidatePath('/admin/usuarios');
  revalidatePath('/admin');
  return { ok: true, mensaje: accion === 'quitar' ? 'Acceso quitado.' : `Acceso listo por ${dias} días más.` };
}
