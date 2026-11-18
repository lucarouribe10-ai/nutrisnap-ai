import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Cerrar sesión: solo por POST (un enlace GET podría dispararse desde otra página).
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // sin configuración: no hay sesión que cerrar
  }
  return NextResponse.redirect(new URL('/', request.nextUrl.origin), { status: 303 });
}
