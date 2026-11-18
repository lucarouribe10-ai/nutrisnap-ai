import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresca la sesión y protege /app/*. Falla CERRADO: sin sesión válida (o sin configuración) → /entrar.
 * Verifica el token con getClaims() (firma comprobada), no leyendo la cookie "a ciegas".
 */
export async function updateSession(request: NextRequest) {
  // Solo para probar en tu computador; JAMÁS se respeta en producción.
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH === '1') {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const aEntrar = () => {
    // El panel no revela que existe: sin sesión responde 404 (no manda a iniciar sesión).
    if (request.nextUrl.pathname.startsWith('/admin')) console.warn('[admin] 404 desde el proxy: sin sesión válida (cookie ausente o vencida)');
    if (request.nextUrl.pathname.startsWith('/admin')) return NextResponse.rewrite(new URL('/no-existe', request.url), { status: 404 });
    const destino = request.nextUrl.clone();
    destino.pathname = '/entrar';
    destino.search = '';
    destino.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(destino);
  };
  if (!url || !key) return aEntrar();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return aEntrar();
  return response;
}
