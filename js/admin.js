// ===== AUTH =====
const ADMIN_CREDENTIALS = { username: 'admin', password: 'capannine2024' };

function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');

  if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem('adminAuth', '1');
    err.style.display = 'none';
    showDashboard();
  } else {
    err.style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('adminAuth');
  document.getElementById('dashboardPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
}

function togglePwd() {
  const input = document.getElementById('loginPass');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== DASHBOARD =====
function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'block';
  renderStats();
  renderOrders();
  renderProducts();
  // Auto-refresh every 10 seconds
  setInterval(() => {
    if (sessionStorage.getItem('adminAuth')) {
      renderStats();
      renderOrders();
    }
  }, 10000);
}

function renderStats() {
  const orders = getOrders();
  const pending = orders.filter(o => o.status === 'pending').length;
  const confirmed = orders.filter(o => o.status === 'confirmed').length;
  const total = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${orders.length}</div>
      <div class="stat-label">Ordini totali</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:#856404;">${pending}</div>
      <div class="stat-label">In attesa</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">€${total.toFixed(0)}</div>
      <div class="stat-label">Incasso</div>
    </div>`;
}

// ===== ORDERS =====
function getOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function renderOrders() {
  const orders = getOrders();
  const list = document.getElementById('ordersList');
  if (!list) return;

  if (orders.length === 0) {
    list.innerHTML = '<div class="no-orders">Nessun ordine ricevuto ancora.<br/>Gli ordini appariranno qui non appena i clienti ordinano.</div>';
    return;
  }

  list.innerHTML = orders.map(order => {
    const time = new Date(order.time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const date = new Date(order.time).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    const statusClass = order.status === 'pending' ? 'status-pending' : order.status === 'confirmed' ? 'status-confirmed' : 'status-done';
    const statusLabel = order.status === 'pending' ? '⏳ In attesa' : order.status === 'confirmed' ? '✅ Confermato' : '🏁 Completato';
    const itemsList = order.items.map(i => `${i.qty}× ${i.name}`).join(', ');

    return `
      <div class="order-card" id="order-${order.id}">
        <div class="order-card-header">
          <div class="order-location">📍 ${order.locationName || order.location}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="order-status-badge ${statusClass}">${statusLabel}</span>
            <div class="order-time">${date} ${time}</div>
          </div>
        </div>
        <div class="order-items-list">${itemsList}</div>
        ${order.notes ? `<div style="font-size:12px;color:#888;margin-bottom:6px;">📝 ${order.notes}</div>` : ''}
        <div class="order-total-line">Totale: €${(order.total || 0).toFixed(2)}</div>
        <div class="order-actions">
          ${order.status === 'pending' ? `<button class="order-action-btn btn-confirm" onclick="updateOrderStatus(${order.id}, 'confirmed')">✅ Conferma</button>` : ''}
          ${order.status !== 'done' ? `<button class="order-action-btn btn-done" onclick="updateOrderStatus(${order.id}, 'done')">🏁 Completato</button>` : ''}
          <button class="order-action-btn" style="background:#fee2e2;color:#991b1b;" onclick="deleteOrder(${order.id})">🗑️ Elimina</button>
        </div>
      </div>`;
  }).join('');
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
    renderStats();
    renderOrders();
    showToast(status === 'confirmed' ? 'Ordine confermato' : 'Ordine completato', 'success');
  }
}

function deleteOrder(orderId) {
  const orders = getOrders().filter(o => o.id !== orderId);
  saveOrders(orders);
  renderStats();
  renderOrders();
}

function clearOrders() {
  if (!confirm('Eliminare tutti gli ordini?')) return;
  localStorage.removeItem('orders');
  renderStats();
  renderOrders();
}

// ===== PRODUCTS =====
function renderProducts() {
  const list = document.getElementById('productsList');
  if (!list) return;

  let html = '';
  MENU_DATA.categories.forEach(cat => {
    const catProducts = MENU_DATA.products.filter(p => p.category === cat.id);
    if (catProducts.length === 0) return;
    html += `<div class="category-label" style="margin-top:16px;">${cat.name_it}</div>`;
    catProducts.forEach(p => {
      html += `
        <div class="product-card" style="margin-bottom:8px;">
          <img class="product-img" src="${p.image}" alt="${p.name_it}" />
          <div class="product-info">
            <div class="product-name">${p.name_it}</div>
            <div class="product-desc">${p.desc_it}</div>
            <div class="product-price">€${p.price.toFixed(2)}</div>
          </div>
        </div>`;
    });
  });
  list.innerHTML = html;
}

// ===== TABS =====
function showTab(tab) {
  document.getElementById('tabOrdersContent').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('tabProductsContent').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('tabOrders').classList.toggle('active', tab === 'orders');
  document.getElementById('tabProducts').classList.toggle('active', tab === 'products');
}

// ===== TOAST =====
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== AUTO-LOGIN CHECK =====
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('adminAuth')) {
    showDashboard();
  }
});
