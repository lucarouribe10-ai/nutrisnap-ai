import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// La app interna y el panel exigen sesión (el panel además exige ser administradora). Landing, onboarding, planes, /entrar, legales y /auth/* son públicos.
export const config = { matcher: ['/app', '/app/:path*', '/admin', '/admin/:path*'] };
