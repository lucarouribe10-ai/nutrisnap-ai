// Contrato de eventos del funnel (36/60). Sin backend aún: se guardan en la sesión del navegador
// y se muestran en consola con ?qa=1 (las sesiones QA quedan marcadas y se excluyen de métricas).
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
  } catch {
    /* sin almacenamiento: no rompe el flujo */
  }
}
