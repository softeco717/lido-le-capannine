// ===== STATE =====
let cart = [];
let currentCategory = 'all';
let currentLang = localStorage.getItem('lang') || 'it';
let locationId = 'umbrella-1';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  locationId = params.get('location') || 'umbrella-1';
  const catParam = params.get('cat');
  if (catParam) currentCategory = catParam;

  updateLocationLabel();
  renderCategories();
  renderProducts();
  updateCartBadge();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = currentLang === 'it' ? 'Cerca nel menu...' : 'Search menu...';
  }
});

function updateLocationLabel() {
  const label = document.getElementById('locationLabel');
  if (label) label.textContent = getLocationName(locationId, currentLang);
}

// ===== CATEGORIES =====
function renderCategories() {
  const bar = document.getElementById('categoriesBar');
  if (!bar) return;
  const allLabel = currentLang === 'it' ? 'Tutti' : 'All';
  let html = `<button class="cat-btn ${currentCategory === 'all' ? 'active' : ''}" onclick="selectCategory('all')">${allLabel}</button>`;
  MENU_DATA.categories.forEach(cat => {
    const name = currentLang === 'it' ? cat.name_it : cat.name_en;
    html += `<button class="cat-btn ${currentCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')">${name}</button>`;
  });
  bar.innerHTML = html;
}

function selectCategory(catId) {
  currentCategory = catId;
  renderCategories();
  renderProducts();
  document.getElementById('searchInput').value = '';
}

// ===== PRODUCTS =====
function renderProducts(searchTerm = '') {
  const list = document.getElementById('menuList');
  if (!list) return;

  let products = MENU_DATA.products;
  if (currentCategory !== 'all') {
    products = products.filter(p => p.category === currentCategory);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter(p => {
      const name = currentLang === 'it' ? p.name_it : p.name_en;
      const desc = currentLang === 'it' ? p.desc_it : p.desc_en;
      return name.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
    });
  }

  if (products.length === 0) {
    list.innerHTML = `<div class="no-orders" style="padding:40px 0;text-align:center;color:#888;">${currentLang === 'it' ? 'Nessun prodotto trovato' : 'No products found'}</div>`;
    return;
  }

  // Group by category
  let html = '';
  if (currentCategory === 'all') {
    MENU_DATA.categories.forEach(cat => {
      const catProducts = products.filter(p => p.category === cat.id);
      if (catProducts.length === 0) return;
      const catName = currentLang === 'it' ? cat.name_it : cat.name_en;
      html += `<div class="category-label">${catName}</div>`;
      catProducts.forEach(p => { html += renderProductCard(p); });
    });
  } else {
    products.forEach(p => { html += renderProductCard(p); });
  }

  list.innerHTML = html;
}

function renderProductCard(product) {
  const name = currentLang === 'it' ? product.name_it : product.name_en;
  const desc = currentLang === 'it' ? product.desc_it : product.desc_en;
  const qty = getCartQty(product.id);
  const priceStr = '€' + product.price.toFixed(2);

  if (qty > 0) {
    return `
      <div class="product-card" id="card-${product.id}">
        <img class="product-img" src="${product.image}" alt="${name}" loading="lazy" />
        <div class="product-info">
          <div class="product-name">${name}</div>
          <div class="product-desc">${desc}</div>
          <div class="product-price">${priceStr}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="removeFromCart(${product.id})">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addToCart(${product.id})">+</button>
        </div>
      </div>`;
  }
  return `
    <div class="product-card" id="card-${product.id}">
      <img class="product-img" src="${product.image}" alt="${name}" loading="lazy" />
      <div class="product-info">
        <div class="product-name">${name}</div>
        <div class="product-desc">${desc}</div>
        <div class="product-price">${priceStr}</div>
      </div>
      <button class="add-btn" onclick="addToCart(${product.id})">+</button>
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
  const product = MENU_DATA.products.find(p => p.id === productId);
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
  const product = MENU_DATA.products.find(p => p.id === productId);
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
    const subtotal = item.product.price * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div class="qty-control">
          <button class="qty-btn" style="width:24px;height:24px;font-size:14px;" onclick="cartRemove(${item.id})">−</button>
          <span class="qty-num" style="font-size:14px;">${item.qty}</span>
          <button class="qty-btn" style="width:24px;height:24px;font-size:14px;" onclick="cartAdd(${item.id})">+</button>
        </div>
        <div class="cart-item-name">${name}</div>
        <div class="cart-item-price">€${subtotal.toFixed(2)}</div>
      </div>`;
  });

  const totalLabel = currentLang === 'it' ? 'Totale' : 'Total';
  const notesLabel = currentLang === 'it' ? 'Note per il personale' : 'Notes for staff';
  const notesPlaceholder = currentLang === 'it' ? 'Es: senza glutine, allergie...' : 'E.g.: gluten-free, allergies...';
  const proceedLabel = currentLang === 'it' ? 'Procedi all\'ordine →' : 'Proceed to order →';
  const confirmLabel = currentLang === 'it' ? 'Conferma ordine' : 'Confirm order';
  const sendLabel = currentLang === 'it' ? 'Invia ordine' : 'Send order';

  html += `
    <div class="cart-total">
      <span>${totalLabel}</span>
      <span>€${total.toFixed(2)}</span>
    </div>
    <div class="notes-label">${notesLabel}</div>
    <textarea class="notes-input" id="orderNotes" placeholder="${notesPlaceholder}"></textarea>
    <button class="btn-order" onclick="submitOrder()">${sendLabel}</button>`;

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

function submitOrder() {
  if (cart.length === 0) return;
  const notes = document.getElementById('orderNotes')?.value || '';
  const locationName = getLocationName(locationId, currentLang);

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = {
    id: Date.now(),
    location: locationId,
    locationName,
    items: cart.map(i => ({
      id: i.id,
      name: currentLang === 'it' ? i.product.name_it : i.product.name_en,
      qty: i.qty,
      price: i.product.price,
      subtotal: i.product.price * i.qty
    })),
    total: cart.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    notes,
    status: 'pending',
    time: new Date().toISOString()
  };
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Reset cart
  cart = [];
  updateCartBadge();
  renderProducts();

  // Show success
  document.getElementById('cartContent').style.display = 'none';
  document.getElementById('orderSuccess').classList.add('show');
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
  // Update data-it/data-en elements
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
  setTimeout(() => toast.classList.remove('show'), 2000);
}
