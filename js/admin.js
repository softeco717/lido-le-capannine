// =============================================
// ADMIN.JS - Lido Le Capannine
// Polling automatico ogni 10 secondi
// =============================================
const SUPABASE_URL   = 'https://mnvzkozuufhgquexhgqb.supabase.co';
const SERVICE_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnprb3p1dWZoZ3F1ZXhoZ3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjc2ODc3NywiZXhwIjoyMDk4MzQ0Nzc3fQ.dx3Vdyg8DbRreUUq-5sZGt-xiNzOUtK5P_hBim1Mux0';
const ADMIN_PASSWORD = 'capannine2024';

let adminOrders = [];
let pollingInterval = null;
let knownOrderIds = new Set();
let notificationPermission = false;

// ===== SUPABASE HELPER (service_role) =====
async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': opts.prefer || 'return=representation',
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ===== LOGIN =====
async function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err  = document.getElementById('loginError');
  const btn  = document.getElementById('loginBtn');

  if (!user || !pass) { err.style.display = 'block'; err.textContent = 'Inserisci username e password'; return; }
  if (btn) { btn.disabled = true; btn.textContent = 'Accesso...'; }
  err.style.display = 'none';

  if (user === 'admin' && pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuth', '1');
    showDashboard();
  } else {
    err.style.display = 'block';
    err.textContent = 'Credenziali non valide';
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Accedi'; }
}

function doLogout() {
  sessionStorage.removeItem('adminAuth');
  stopPolling();
  document.getElementById('dashboardPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
}

function togglePwd() {
  const i = document.getElementById('loginPass');
  i.type = i.type === 'password' ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginPass')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('loginUser')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  if (sessionStorage.getItem('adminAuth')) showDashboard();
});

// ===== DASHBOARD =====
async function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'block';
  requestNotificationPermission();
  await refreshOrders();
  startPolling();
}

// ===== CARICA ORDINI =====
async function loadOrdersFromDB() {
  return await sbFetch('/orders?order=created_at.desc', { prefer: '' });
}

async function refreshOrders() {
  try {
    const orders = await loadOrdersFromDB();
    adminOrders = orders || [];
    knownOrderIds = new Set(adminOrders.map(o => o.id));
    renderStats();
    renderOrders();
    setDot(true);
  } catch (e) {
    setDot(false);
  }
}

// ===== POLLING ogni 10 secondi =====
function startPolling() {
  stopPolling();
  setDot(true);
  pollingInterval = setInterval(async () => {
    try {
      const fresh = await loadOrdersFromDB();
      if (!fresh) return;
      // Notifica nuovi ordini
      fresh.filter(o => !knownOrderIds.has(o.id)).forEach(o => {
        const loc = (o.location_id || '').replace('umbrella-', 'Ombrellone ').replace('table-', 'Tavolo ');
        playNotificationSound();
        sendNotification('🔔 Nuovo ordine!', `${loc} — €${Number(o.total).toFixed(2)}`);
        flashCard(o.id);
      });
      adminOrders = fresh;
      knownOrderIds = new Set(fresh.map(o => o.id));
      renderStats();
      renderOrders();
      setDot(true);
    } catch (e) { setDot(false); }
  }, 10000);
}

function stopPolling() {
  if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
}

function setDot(active) {
  const dot = document.getElementById('realtimeDot');
  if (!dot) return;
  dot.style.background = active ? '#28a745' : '#dc3545';
  dot.title = active ? '● Aggiornamento automatico ogni 10s' : '● Connessione persa';
}

function flashCard(id) {
  setTimeout(() => {
    const card = document.getElementById('order-' + id);
    if (card) {
      card.style.border = '2px solid #e8a000';
      card.style.boxShadow = '0 0 20px rgba(232,160,0,0.4)';
      setTimeout(() => { card.style.border = ''; card.style.boxShadow = ''; }, 3000);
    }
  }, 200);
}

// ===== AGGIORNA STATO =====
async function changeStatus(orderId, newStatus) {
  try {
    await sbFetch(`/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
      prefer: 'return=minimal'
    });
    const idx = adminOrders.findIndex(o => o.id === orderId);
    if (idx !== -1) { adminOrders[idx].status = newStatus; renderStats(); renderOrders(); }
  } catch (e) {
    showToast('Errore aggiornamento stato. Riprova.', 'error');
  }
}

// ===== NOTIFICHE =====
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(p => { notificationPermission = p === 'granted'; });
  } else { notificationPermission = Notification?.permission === 'granted'; }
}

function sendNotification(title, body) {
  if (notificationPermission) new Notification(title, { body, icon: 'images/lido-logo-circle.png' });
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

// ===== STATS =====
function renderStats() {
  const pending   = adminOrders.filter(o => o.status === 'pending').length;
  const preparing = adminOrders.filter(o => o.status === 'preparing').length;
  const ready     = adminOrders.filter(o => o.status === 'ready').length;
  const today     = adminOrders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const income    = today.reduce((s, o) => s + Number(o.total || 0), 0);
  const el = document.getElementById('adminStats');
  if (!el) return;
  el.innerHTML = `
    <div class="stat-card"><div class="stat-num">${adminOrders.length}</div><div class="stat-label">Ordini totali</div></div>
    <div class="stat-card"><div class="stat-num" style="color:#856404">${pending}</div><div class="stat-label">In attesa</div></div>
    <div class="stat-card"><div class="stat-num" style="color:#0c5460">${preparing}</div><div class="stat-label">In preparazione</div></div>
    <div class="stat-card"><div class="stat-num" style="color:#155724">${ready}</div><div class="stat-label">Pronti</div></div>
    <div class="stat-card"><div class="stat-num">€${income.toFixed(0)}</div><div class="stat-label">Incasso oggi (${today.length})</div></div>`;
}

// ===== RENDER ORDINI =====
function renderOrders(filter = null) {
  const list = document.getElementById('ordersList');
  if (!list) return;
  let orders = filter ? adminOrders.filter(o => o.status === filter) : adminOrders;
  if (orders.length === 0) { list.innerHTML = `<div class="no-orders">Nessun ordine. In attesa...</div>`; return; }
  const sorted = [...orders].sort((a, b) => {
    const ord = { pending: 0, preparing: 1, ready: 2, delivered: 3, cancelled: 4 };
    const d = (ord[a.status] ?? 5) - (ord[b.status] ?? 5);
    return d !== 0 ? d : new Date(b.created_at) - new Date(a.created_at);
  });
  list.innerHTML = sorted.map(renderOrderCard).join('');
}

function renderOrderCard(order) {
  const statusMap = {
    pending:   { label: '⏳ In attesa',        cls: 'status-pending' },
    preparing: { label: '👨‍🍳 In preparazione',  cls: 'status-preparing' },
    ready:     { label: '✅ Pronto',            cls: 'status-ready' },
    delivered: { label: '🚀 Consegnato',        cls: 'status-delivered' },
    cancelled: { label: '❌ Annullato',         cls: 'status-cancelled' }
  };
  const s    = statusMap[order.status] || statusMap.pending;
  const time = new Date(order.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(order.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
  const items = (Array.isArray(order.items) ? order.items : []).map(i =>
    `<div class="order-item-row"><span>${i.qty}x ${i.name_it || i.name}</span><span>€${Number(i.subtotal || i.price * i.qty).toFixed(2)}</span></div>`
  ).join('');
  const loc = (order.location_id || '').replace('umbrella-', 'Ombrellone ').replace('table-', 'Tavolo ');
  const nextBtn = {
    pending:   `<button class="btn-status btn-preparing" onclick="changeStatus('${order.id}','preparing')">👨‍🍳 Inizia preparazione</button>`,
    preparing: `<button class="btn-status btn-ready"     onclick="changeStatus('${order.id}','ready')">✅ Pronto</button>`,
    ready:     `<button class="btn-status btn-delivered" onclick="changeStatus('${order.id}','delivered')">🚀 Consegnato</button>`,
    delivered: '', cancelled: ''
  }[order.status] || '';
  const cancelBtn = !['delivered','cancelled'].includes(order.status)
    ? `<button class="btn-status btn-cancel" onclick="changeStatus('${order.id}','cancelled')">❌ Annulla</button>` : '';
  return `
    <div class="order-card ${s.cls}" id="order-${order.id}">
      <div class="order-header">
        <div><strong>${loc}</strong><span class="order-time">${date} ${time}</span></div>
        <span class="order-status ${s.cls}">${s.label}</span>
      </div>
      <div class="order-items">${items}</div>
      ${order.notes ? `<div class="order-notes">📝 ${order.notes}</div>` : ''}
      <div class="order-total">Totale: <strong>€${Number(order.total).toFixed(2)}</strong></div>
      <div class="order-actions">${nextBtn}${cancelBtn}</div>
    </div>`;
}

// ===== FILTRI =====
function filterOrders(status) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderOrders(status === 'all' ? null : status);
}

// ===== TABS =====
function showTab(tab) {
  document.getElementById('tabOrdersContent').style.display  = tab === 'orders'   ? '' : 'none';
  document.getElementById('tabProductsContent').style.display = tab === 'products' ? '' : 'none';
  document.getElementById('tabOrders').classList.toggle('active',   tab === 'orders');
  document.getElementById('tabProducts').classList.toggle('active', tab === 'products');
}

// ===== REFRESH MANUALE =====
async function manualRefresh() {
  const btn = document.getElementById('refreshBtn');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  await refreshOrders();
  if (btn) { btn.textContent = '🔄 Aggiorna'; btn.disabled = false; }
}

// ===== TOAST =====
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = 'toast ' + type; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
