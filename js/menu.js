// =============================================
// MENU.JS - Lido Le Capannine (con Supabase)
// =============================================
let cart = [];
let currentCategory = 'all';
let currentLang = localStorage.getItem('lang') || 'it';
let locationId = 'umbrella-1';
let menuCategories = [];
let menuProducts = [];
let isLoading = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  locationId = params.get('location') || 'umbrella-1';
  const catParam = params.get('cat');
  if (catParam) currentCategory = catParam;

  updateLocationLabel();
  updateCartBadge();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = currentLang === 'it' ? 'Cerca nel menu...' : 'Search menu...';
  }

  // Carica dati da Supabase
  await loadMenuData();
});

async function loadMenuData() {
  // STEP 1: Carica SUBITO i dati locali — il menu è visibile istantaneamente
  if (typeof MENU_DATA !== 'undefined') {
    menuCategories = MENU_DATA.categories;
    menuProducts = MENU_DATA.products.map(p => ({
      ...p,
      category_id: p.category,
      description_it: p.desc_it,
      description_en: p.desc_en
    }));
    renderCategories();
    renderProducts();
  }
  showLoadingState(false);

  // STEP 2: Prova ad aggiornare da Supabase in background (senza bloccare il menu)
  try {
    const fetchWithTimeout = Promise.race([
      Promise.all([loadCategories(), loadProducts()]),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
    ]);
    const [cats, prods] = await fetchWithTimeout;
    // Aggiorna solo se Supabase ha restituito dati validi
    if (cats && cats.length > 0 && prods && prods.length > 0) {
      menuCategories = cats;
      menuProducts = prods;
      renderCategories();
      renderProducts();
    }
  } catch (e) {
    // Supabase non disponibile — i dati locali sono già mostrati, nessun problema
    console.warn('Supabase non disponibile, uso dati locali:', e.message);
  }
}

function showLoadingState(loading) {
  isLoading = loading;
  const list = document.getElementById('menuList');
  if (!list) return;
  if (loading) {
    list.innerHTML = `<div style="text-align:center;padding:60px 0;color:#888;">
      <div style="font-size:32px;margin-bottom:12px;">⏳</div>
      <div>${currentLang === 'it' ? 'Caricamento menu...' : 'Loading menu...'}</div>
    </div>`;
  }
}

function updateLocationLabel() {
  const label = document.getElementById('locationLabel');
  if (!label) return;
  const locName = locationId.replace('umbrella-', currentLang === 'it' ? 'Ombrellone ' : 'Umbrella ')
                            .replace('table-', currentLang === 'it' ? 'Tavolo ' : 'Table ');
  label.textContent = locName;
}

// ===== CATEGORIES =====
function renderCategories() {
  const bar = document.getElementById('categoriesBar');
  if (!bar) return;
  const allLabel = currentLang === 'it' ? 'Tutti' : 'All';
  let html = `<button class="cat-btn ${currentCategory === 'all' ? 'active' : ''}" onclick="selectCategory('all')">${allLabel}</button>`;
  menuCategories.forEach(cat => {
    const name = currentLang === 'it' ? cat.name_it : cat.name_en;
    html += `<button class="cat-btn ${currentCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')">${cat.icon || ''} ${name}</button>`;
  });
  bar.innerHTML = html;
  // Notifica la sidebar desktop
  document.dispatchEvent(new CustomEvent('categoriesRendered'));
}

function selectCategory(catId) {
  currentCategory = catId;
  renderCategories();
  renderProducts();
  const si = document.getElementById('searchInput');
  if (si) si.value = '';
}

// ===== PRODUCTS =====
function renderProducts(searchTerm = '') {
  const list = document.getElementById('menuList');
  if (!list || isLoading) return;

  let products = [...menuProducts];

  if (currentCategory !== 'all') {
    products = products.filter(p => (p.category_id || p.category) === currentCategory);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter(p => {
      const name = currentLang === 'it' ? p.name_it : p.name_en;
      const desc = currentLang === 'it' ? (p.description_it || p.desc_it || '') : (p.description_en || p.desc_en || '');
      return name.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
    });
  }

  if (products.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:40px 0;color:#888;">${currentLang === 'it' ? 'Nessun prodotto trovato' : 'No products found'}</div>`;
    return;
  }

  let html = '';
  if (currentCategory === 'all') {
    menuCategories.forEach(cat => {
      const catProducts = products.filter(p => (p.category_id || p.category) === cat.id);
      if (catProducts.length === 0) return;
      const catName = currentLang === 'it' ? cat.name_it : cat.name_en;
      html += `<div class="category-label">${cat.icon || ''} ${catName}</div>`;
      catProducts.forEach(p => { html += renderProductCard(p); });
    });
  } else {
    products.forEach(p => { html += renderProductCard(p); });
  }

  list.innerHTML = html;
}

function renderProductCard(product) {
  const name = currentLang === 'it' ? product.name_it : product.name_en;
  const desc = currentLang === 'it' ? (product.description_it || product.desc_it || '') : (product.description_en || product.desc_en || '');
  const qty = getCartQty(product.id);
  const priceStr = '€' + Number(product.price).toFixed(2);
  const imgSrc = product.image || `images/${(product.category_id || product.category)}.webp`;

  const tagsHtml = (product.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  if (qty > 0) {
    return `
      <div class="product-card" id="card-${product.id}">
        <img class="product-img" src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.style.display='none'" />
        <div class="product-info">
          <div class="product-name">${name}</div>
          <div class="product-desc">${desc}</div>
          ${tagsHtml ? `<div class="product-tags">${tagsHtml}</div>` : ''}
          <div class="product-price">${priceStr}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="removeFromCart('${product.id}')">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addToCart('${product.id}')">+</button>
        </div>
      </div>`;
  }
  return `
    <div class="product-card" id="card-${product.id}">
      <img class="product-img" src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.style.display='none'" />
      <div class="product-info">
        <div class="product-name">${name}</div>
        <div class="product-desc">${desc}</div>
        ${tagsHtml ? `<div class="product-tags">${tagsHtml}</div>` : ''}
        <div class="product-price">${priceStr}</div>
      </div>
      <button class="add-btn" onclick="addToCart('${product.id}')">+</button>
    </div>`;
}

function filterProducts() {
  const term = document.getElementById('searchInput').value;
  renderProducts(term);
}

// ===== CART =====
function getCartQty(productId) {
  const item = cart.find(i => i.id === productId);
  return item ? item.qty : 0;
}

function addToCart(productId) {
  const product = menuProducts.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: productId, qty: 1, product });
  }
  updateCartBadge();
  refreshProductCard(productId);
  showToast(currentLang === 'it' ? 'Aggiunto al carrello' : 'Added to cart', 'success');
}

function removeFromCart(productId) {
  const existing = cart.find(i => i.id === productId);
  if (!existing) return;
  existing.qty--;
  if (existing.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCartBadge();
  refreshProductCard(productId);
}

function refreshProductCard(productId) {
  const product = menuProducts.find(p => p.id === productId);
  if (!product) return;
  const card = document.getElementById('card-' + productId);
  if (!card) return;
  card.outerHTML = renderProductCard(product);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

// ===== CART MODAL =====
function openCart() {
  document.getElementById('cartModal').classList.add('open');
  document.getElementById('orderSuccess').classList.remove('show');
  document.getElementById('cartContent').style.display = '';
  renderCartContent();
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('open');
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cartModal')) closeCart();
}

function renderCartContent() {
  const content = document.getElementById('cartContent');
  if (!content) return;

  if (cart.length === 0) {
    content.innerHTML = `<div class="empty-cart">${currentLang === 'it' ? '🛒 Il carrello è vuoto' : '🛒 Your cart is empty'}</div>`;
    return;
  }

  let total = 0;
  let html = '';
  cart.forEach(item => {
    const name = currentLang === 'it' ? item.product.name_it : item.product.name_en;
    const subtotal = Number(item.product.price) * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div class="qty-control">
          <button class="qty-btn" style="width:24px;height:24px;font-size:14px;" onclick="cartRemove('${item.id}')">−</button>
          <span class="qty-num" style="font-size:14px;">${item.qty}</span>
          <button class="qty-btn" style="width:24px;height:24px;font-size:14px;" onclick="cartAdd('${item.id}')">+</button>
        </div>
        <div class="cart-item-name">${name}</div>
        <div class="cart-item-price">€${subtotal.toFixed(2)}</div>
      </div>`;
  });

  const totalLabel = currentLang === 'it' ? 'Totale' : 'Total';
  const notesPlaceholder = currentLang === 'it' ? 'Es: senza glutine, allergie...' : 'E.g.: gluten-free, allergies...';
  const sendLabel = currentLang === 'it' ? 'Invia ordine' : 'Send order';
  const notesLabel = currentLang === 'it' ? 'Note per il personale' : 'Notes for staff';

  html += `
    <div class="cart-total">
      <span>${totalLabel}</span>
      <span>€${total.toFixed(2)}</span>
    </div>
    <div class="notes-label">${notesLabel}</div>
    <textarea class="notes-input" id="orderNotes" placeholder="${notesPlaceholder}"></textarea>
    <button class="btn-order" id="submitBtn" onclick="submitOrder()">${sendLabel}</button>`;

  content.innerHTML = html;
}

function cartAdd(productId) {
  addToCart(productId);
  renderCartContent();
}

function cartRemove(productId) {
  removeFromCart(productId);
  renderCartContent();
}

// ===== SUBMIT ORDER (con Supabase) =====
async function submitOrder() {
  if (cart.length === 0) return;

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'it' ? 'Invio in corso...' : 'Sending...';
  }

  const notes = document.getElementById('orderNotes')?.value || '';
  const total = cart.reduce((sum, i) => sum + Number(i.product.price) * i.qty, 0);

  const orderItems = cart.map(i => ({
    id: i.id,
    name_it: i.product.name_it,
    name_en: i.product.name_en,
    qty: i.qty,
    price: Number(i.product.price),
    subtotal: Number(i.product.price) * i.qty
  }));

  try {
    // Invia ordine a Supabase
    const order = await createOrder({
      locationId: locationId,
      items: orderItems,
      total: total,
      notes: notes
    });

    // Salva anche in localStorage come backup
    const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localOrders.unshift({
      id: order?.id || Date.now(),
      supabase_id: order?.id,
      location: locationId,
      items: orderItems,
      total,
      notes,
      status: 'pending',
      time: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(localOrders.slice(0, 50)));

    // Reset carrello
    cart = [];
    updateCartBadge();
    renderProducts();

    // Mostra successo
    document.getElementById('cartContent').style.display = 'none';
    document.getElementById('orderSuccess').classList.add('show');

  } catch (e) {
    console.error('Errore invio ordine:', e);
    showToast(currentLang === 'it' ? 'Errore invio ordine. Riprova.' : 'Order error. Try again.', 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = currentLang === 'it' ? 'Invia ordine' : 'Send order';
    }
  }
}

// ===== LANG =====
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
  });
  updateLocationLabel();
  renderCategories();
  renderProducts();
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = lang === 'it' ? 'Cerca nel menu...' : 'Search menu...';
  }
  document.querySelectorAll('[data-it]').forEach(el => {
    el.textContent = lang === 'it' ? el.getAttribute('data-it') : el.getAttribute('data-en');
  });
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
