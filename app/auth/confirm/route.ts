import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { destinoSeguro } from '@/lib/supabase/destino';

// El enlace del correo llega aquí: se canjea el token de un solo uso por una sesión y se entra a la app.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const destino = destinoSeguro(searchParams.get('next'));

  if (token_hash && type === 'email') {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({ type: 'email', token_hash });
      if (!error) return NextResponse.redirect(new URL(destino, origin));
    } catch {
      // cae al aviso de enlace inválido
    }
  }
  return NextResponse.redirect(new URL('/entrar?error=enlace', origin));
}
