// =============================================
// NETLIFY FUNCTION: admin-api.js
// Proxy sicuro per le operazioni admin su Supabase
// La service_role key NON è mai esposta al frontend
// =============================================

const SUPABASE_URL = 'https://mnvzkozuufhgquexhgqb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnprb3p1dWZoZ3F1ZXhoZ3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc2ODc3NywiZXhwIjoyMDk4MzQ0Nzc3fQ.dx3Vdyg8DbRreUUq-5sZGt-xiNzOUtK5P_hBim1Mux0';
const ADMIN_PASSWORD = 'capannine2024';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...options.headers
    }
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.queryStringParameters?.path || '';
  const body = event.body ? JSON.parse(event.body) : {};

  // ===== LOGIN ADMIN =====
  if (path === 'login') {
    const { username, password } = body;
    if (username === 'admin' && password === ADMIN_PASSWORD) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, token: Buffer.from(`${username}:${Date.now()}`).toString('base64') })
      };
    }
    return { statusCode: 401, headers, body: JSON.stringify({ ok: false, error: 'Credenziali non valide' }) };
  }

  // ===== VERIFICA TOKEN =====
  const authHeader = event.headers?.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Non autorizzato' }) };
  }

  // ===== GET ORDINI =====
  if (event.httpMethod === 'GET' && path === 'orders') {
    const status = event.queryStringParameters?.status;
    let query = '/orders?order=created_at.desc';
    if (status) query += `&status=eq.${status}`;
    const result = await supabaseFetch(query, { method: 'GET', prefer: '' });
    return { statusCode: result.status, headers, body: JSON.stringify(result.body) };
  }

  // ===== UPDATE STATO ORDINE =====
  if (event.httpMethod === 'PATCH' && path === 'orders') {
    const { id, status } = body;
    if (!id || !status) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'id e status richiesti' }) };
    }
    const result = await supabaseFetch(`/orders?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      prefer: 'return=representation'
    });
    return { statusCode: result.status, headers, body: JSON.stringify(result.body) };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint non trovato' }) };
};
