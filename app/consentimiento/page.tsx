import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { VERSION_LEGAL } from '@/lib/legal';
import { Consentimiento } from '@/components/onboarding/Consentimiento';

export const metadata = { title: 'Tu autorización — NutriSnap AI', robots: { index: false } };

async function Contenido() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect('/entrar?next=/app');
  const { data: c } = await supabase.from('consentimientos').select('id').eq('version', VERSION_LEGAL).maybeSingle();
  if (c) redirect('/app');
  return <Consentimiento />;
}

export default function Page() {
  return <Suspense fallback={<main className="min-h-dvh bg-[var(--bg)]" />}><Contenido /></Suspense>;
}
