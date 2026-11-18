'use client';

import { useEffect } from 'react';
import { reportarError } from '@/lib/errores';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportarError(error.message, 'global');
  }, [error]);
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', background: '#F5F7F2', color: '#15191A', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Algo no salió como esperábamos</h1>
        <p style={{ maxWidth: 320, color: '#525E57' }}>Tus datos están a salvo. Intenta de nuevo.</p>
        <button type="button" onClick={reset} style={{ marginTop: 16, height: 52, width: 280, borderRadius: 999, border: 0, background: '#15191A', color: '#F5F7F2', fontSize: 17, fontWeight: 600 }}>Intentar de nuevo</button>
      </body>
    </html>
  );
}
