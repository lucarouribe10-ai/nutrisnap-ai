import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Solo la app interna exige sesión. Landing, onboarding, planes, /entrar, legales y /auth/* son públicos.
export const config = { matcher: ['/app', '/app/:path*'] };
