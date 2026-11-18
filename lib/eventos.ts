// Contrato de eventos del funnel (36/60). Se guardan en la sesión del navegador y se envían al servidor (event_log).
// Con ?qa=1 solo se muestran en consola: las sesiones QA quedan marcadas y NO se envían. En localhost tampoco se envían.
type Props = Record<string, string | number | boolean | undefined>;

export function sesionAnonima(): string {
  try {
    let id = sessionStorage.getItem('ns_sid');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('ns_sid', id);
    }
    return id;
  } catch {
    return 'sin-sesion';
  }
}

export function track(evento: string, props: Props = {}) {
  try {
    const qa = new URLSearchParams(location.search).get('qa') === '1' || sessionStorage.getItem('ns_qa') === '1';
    if (qa) sessionStorage.setItem('ns_qa', '1');
    const item = { evento, ...props, sid: sesionAnonima(), qa, t: Date.now() };
    const cola = JSON.parse(sessionStorage.getItem('ns_eventos') ?? '[]');
    cola.push(item);
    sessionStorage.setItem('ns_eventos', JSON.stringify(cola.slice(-100)));
    if (qa) console.debug('[evento]', item);
    else enviar(evento, props, item.sid);
  } catch {
    /* sin almacenamiento: no rompe el flujo */
  }
}

function enviar(tipo: string, props: Props, sid: string) {
  try {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    const limpias = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined));
    const cuerpo = JSON.stringify({ tipo, sid, props: limpias });
    if (navigator.sendBeacon?.('/api/evento', new Blob([cuerpo], { type: 'application/json' }))) return;
    void fetch('/api/evento', { method: 'POST', body: cuerpo, headers: { 'content-type': 'application/json' }, keepalive: true });
  } catch {
    /* la medición nunca rompe la app */
  }
}
