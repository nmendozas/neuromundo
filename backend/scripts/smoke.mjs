/**
 * Prueba de humo (smoke test) de la API NeuroMundo.
 * Requiere la API corriendo:  node dist/index.js  (o npm run dev)
 * Ejecutar:                    node scripts/smoke.mjs
 */
const BASE = process.env.SMOKE_BASE || 'http://localhost:4000';

let token = '';
let failures = 0;
let quoteId = 0;
let number = '';

async function req(method, path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* 204 o cuerpo no JSON */
  }
  return { status: res.status, json, res };
}

function check(name, ok, extra = '', detail = null) {
  if (ok) {
    console.log(`  ✅ ${name} ${extra}`);
  } else {
    failures++;
    console.error(`  ❌ ${name} ${extra}`);
    if (detail) console.error('     → respuesta:', JSON.stringify(detail)?.slice(0, 300));
  }
}

async function run() {
  const uid = Date.now().toString().slice(-6);
  const ref = `TEST-${uid}`;
  const health = await req('GET', '/healthz');
  check('GET /healthz → 200', health.status === 200 && health.json.status === 'ok');

  const login = await req('POST', '/api/auth/login', { username: 'admin', password: 'Admin123!' });
  check('POST /auth/login → 200 + token', login.status === 200 && !!login.json.token);
  token = login.json.token;
  check('Token recibido', token.length > 20);

  const unauth = await req('GET', '/api/items');
  check('GET /api/items público → lista', unauth.status === 200 && Array.isArray(unauth.json));

  const me = await req('GET', '/api/auth/me', null, true);
  check('GET /auth/me → admin', me.status === 200 && me.json.user.username === 'admin');

  // ─── Ítems ───
  const item = await req('POST', '/api/items', {
    reference: ref, name: 'Placa de osteosíntesis', category: 'Ortopedia',
    description: 'Prueba', unit: 'unidad', cost_price: 100000, sale_price: 150000, emoji: '🦴',
  }, true);
  check('POST /api/items → 201', item.status === 201 && item.json.reference === ref, '', item.json);
  const itemId = item.json?.id;

  const dup = await req('POST', '/api/items', { reference: ref, name: 'X', category: 'X' }, true);
  check('POST duplicado → 409', dup.status === 409);

  const upd = await req('PUT', `/api/items/${itemId}`, { sale_price: 175000 }, true);
  check('PUT /api/items/:id → 200', upd.status === 200 && upd.json.sale_price === 175000, '', upd.json);

  // ─── CMS ───
  const content = await req('GET', '/api/content');
  check('GET /api/content → historia editable', content.status === 200 && !!content.json.content.history_text);
  const updContent = await req('PUT', '/api/content', { content: { mission_text: 'Misión editada en prueba.' } }, true);
  check('PUT /api/content → 200', updContent.status === 200);
  const content2 = await req('GET', '/api/content');
  check('Contenido persistido', content2.json.content.mission_text === 'Misión editada en prueba.');

  // ─── Parámetros ───
  const params = await req('GET', '/api/parameters', null, true);
  check('GET /api/parameters → 200', params.status === 200 && params.json.parameters['company.name'] === 'NeuroMundo S.A.S');

  // ─── Cotización ───
  const quote = await req('POST', '/api/quotes', {
    client_name: 'Clínica Andes',
    client_email: 'compras@clinicaandes.co',
    client_phone: '3100000000',
    items: [
      { item_id: itemId, reference: ref, name: 'Placa de osteosíntesis', quantity: 5, unit_price: 150000 },
      { reference: 'UCI-9999', name: 'Circuito ventilación', quantity: 2, unit_price: 38000 },
    ],
    discount: 10,
    notes: 'Entrega a 15 días',
  }, true);
  check('POST /api/quotes → 201', quote.status === 201 && !!quote.json?.quote?.number && quote.json.quote.number.startsWith('NM-'), '', quote.json);
  quoteId = quote.json?.quote?.id;
  number = quote.json?.quote?.number;
  const expectedTotal = Math.round((750000 + 76000) * 0.9 * 1.19);
  check('Totales correctos (10% desc + 19% IVA)', Math.round(quote.json?.quote?.total) === expectedTotal, `total=${quote.json?.quote?.total} esperado=${expectedTotal}`);

  // PDF
  const pdfRes = await fetch(`${BASE}/api/quotes/${quoteId}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
  const pdfBuf = Buffer.from(await pdfRes.arrayBuffer());
  check('GET /api/quotes/:id/pdf → PDF válido', pdfRes.status === 200 && pdfRes.headers.get('content-type')?.includes('application/pdf') && pdfBuf.slice(0, 4).toString('latin1') === '%PDF', `${pdfBuf.length} bytes`);

  // Excel
  const xlRes = await fetch(`${BASE}/api/quotes/${quoteId}/excel`, { headers: { Authorization: `Bearer ${token}` } });
  check('GET /api/quotes/:id/excel → 200', xlRes.status === 200 && xlRes.headers.get('content-type')?.includes('spreadsheetml'));

  // Enviar sin SMTP → 400
  const send = await req('POST', `/api/quotes/${quoteId}/send`, { to: 'cliente@test.co' }, true);
  check('POST /send sin SMTP → 400', send.status === 400);

  // Estado
  const st = await req('PATCH', `/api/quotes/${quoteId}/status`, { status: 'aceptada' }, true);
  check('PATCH status → 200', st.status === 200);

  // ─── Contacto público ───
  const msg = await req('POST', '/api/contact', { name: 'María', email: 'maria@test.co', phone: '3000000000', service: 'Ortopedia', message: 'Quiero cotización' });
  check('POST /api/contact → 201', msg.status === 201 && msg.json.ok === true);

  const msgs = await req('GET', '/api/contact/messages', null, true);
  check('GET /contact/messages → lista', msgs.status === 200 && Array.isArray(msgs.json) && msgs.json.length >= 1);

  // ─── Stats ───
  const stats = await req('GET', '/api/stats', null, true);
  check('GET /api/stats → 200', stats.status === 200 && stats.json.items >= 1 && stats.json.quotes >= 1);

  // ─── Exportar / Plantilla ───
  const exp = await fetch(`${BASE}/api/items/export`, { headers: { Authorization: `Bearer ${token}` } });
  check('GET /api/items/export → Excel', exp.status === 200 && exp.headers.get('content-type')?.includes('spreadsheetml'));
  const tmpl = await fetch(`${BASE}/api/items/template`, { headers: { Authorization: `Bearer ${token}` } });
  check('GET /api/items/template → Excel', tmpl.status === 200 && tmpl.headers.get('content-type')?.includes('spreadsheetml'));

  // ─── Import CSV ───
  const csv = Buffer.from(`referencia,nombre,categoria,descripcion,unidad,costo,venta,emoji\nCSV-${uid},Insumo CSV,Ortopedia,Desc,unidad,1000,2000,🩺\n,Insumo sin ref,Ortopedia,Desc,unidad,1000,2000,🩺\n`);
  const form = new FormData();
  form.append('file', new Blob([csv], { type: 'text/csv' }), 'import.csv');
  const imp = await fetch(`${BASE}/api/items/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const impJson = await imp.json();
  check('POST /api/items/import → 1 importado + 1 error', imp.status === 200 && impJson.imported === 1 && impJson.errors.length === 1, JSON.stringify(impJson.errors?.[0] ?? ''), impJson);

  // ─── Logout ───
  const logout = await req('POST', '/api/auth/logout', null, true);
  check('POST /auth/logout → 204', logout.status === 204);
  const me2 = await req('GET', '/api/auth/me', null, true);
  check('Sesión revocada → 401', me2.status === 401);

  console.log('');
  if (failures === 0) {
    console.log(`🎉 SMOKE TEST OK — cotización ${number} creada, PDF/Excel generados`);
  } else {
    console.error(`💥 ${failures} prueba(s) fallaron`);
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error('💥 Error fatal en smoke test:', err);
  process.exit(1);
});

