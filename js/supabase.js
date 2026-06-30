// =============================================
// SUPABASE CLIENT - Lido Le Capannine
// =============================================
const SUPABASE_URL = 'https://mnvzkozuufhgquexhgqb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udnprb3p1dWZoZ3F1ZXhoZ3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3Njg3NzcsImV4cCI6MjA5ODM0NDc3N30.QZXEzc9XIdXxHCGax-BNMmXaYLtHjU1_RBqojgaLIxg';

// Client Supabase leggero (senza dipendenze npm)
// Usa SOLO la chiave anon pubblica — le operazioni admin passano per Netlify Function
const supabase = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,

  // Fetch helper
  async _fetch(path, options = {}) {
    const res = await fetch(`${this.url}/rest/v1${path}`, {
      ...options,
      headers: {
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        'Prefer': options.prefer || 'return=representation',
        ...options.headers
      }
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase error ${res.status}: ${err}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  // SELECT
  async select(table, params = {}) {
    let query = `/${table}?`;
    if (params.select) query += `select=${params.select}&`;
    if (params.filter) query += `${params.filter}&`;
    if (params.order) query += `order=${params.order}&`;
    if (params.eq) {
      for (const [k, v] of Object.entries(params.eq)) {
        query += `${k}=eq.${v}&`;
      }
    }
    return this._fetch(query.replace(/&$/, ''), { method: 'GET', prefer: '' });
  },

  // INSERT
  async insert(table, data) {
    return this._fetch(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
      prefer: 'return=representation'
    });
  },

  // UPDATE
  async update(table, data, filter) {
    let query = `/${table}?`;
    for (const [k, v] of Object.entries(filter)) {
      query += `${k}=eq.${v}&`;
    }
    return this._fetch(query.replace(/&$/, ''), {
      method: 'PATCH',
      body: JSON.stringify(data),
      prefer: 'return=representation'
    });
  },

  // DELETE
  async delete(table, filter) {
    let query = `/${table}?`;
    for (const [k, v] of Object.entries(filter)) {
      query += `${k}=eq.${v}&`;
    }
    return this._fetch(query.replace(/&$/, ''), {
      method: 'DELETE',
      prefer: 'return=representation'
    });
  },

  // REALTIME via WebSocket
  channel(name) {
    const wsUrl = `${this.url.replace('https://', 'wss://')}/realtime/v1/websocket?apikey=${this.key}&vsn=1.0.0`;
    let ws = null;
    let callbacks = {};
    let heartbeatInterval = null;
    let ref = 1;

    const channel = {
      _table: null,
      _event: '*',

      on(event, config, callback) {
        if (typeof config === 'function') {
          callback = config;
          config = {};
        }
        this._table = config.table || null;
        this._event = event;
        callbacks[event] = callback;
        return this;
      },

      subscribe(statusCallback) {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          // Join channel
          ws.send(JSON.stringify({
            topic: `realtime:${name}`,
            event: 'phx_join',
            payload: {
              config: {
                broadcast: { self: false },
                presence: { key: '' },
                postgres_changes: [{
                  event: channel._event === 'postgres_changes' ? '*' : '*',
                  schema: 'public',
                  table: channel._table || 'orders'
                }]
              }
            },
            ref: String(ref++)
          }));

          // Heartbeat ogni 30 secondi
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                topic: 'phoenix',
                event: 'heartbeat',
                payload: {},
                ref: String(ref++)
              }));
            }
          }, 30000);

          if (statusCallback) statusCallback('SUBSCRIBED');
        };

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.event === 'postgres_changes' && callbacks['postgres_changes']) {
              callbacks['postgres_changes'](msg.payload);
            }
          } catch (err) {}
        };

        ws.onerror = () => {
          if (statusCallback) statusCallback('CHANNEL_ERROR');
        };

        ws.onclose = () => {
          clearInterval(heartbeatInterval);
          if (statusCallback) statusCallback('CLOSED');
        };

        return this;
      },

      unsubscribe() {
        if (ws) ws.close();
        clearInterval(heartbeatInterval);
      }
    };

    return channel;
  }
};

// =============================================
// API FUNCTIONS
// =============================================

// Carica categorie
async function loadCategories() {
  try {
    const data = await supabase.select('categories', {
      filter: 'active=eq.true',
      order: 'sort_order.asc'
    });
    return data || [];
  } catch (e) {
    console.error('Errore caricamento categorie:', e);
    return [];
  }
}

// Carica prodotti
async function loadProducts(categoryId = null) {
  try {
    const params = {
      filter: 'active=eq.true',
      order: 'sort_order.asc'
    };
    if (categoryId) {
      params.filter += `&category_id=eq.${categoryId}`;
    }
    const data = await supabase.select('products', params);
    return data || [];
  } catch (e) {
    console.error('Errore caricamento prodotti:', e);
    return [];
  }
}

// Carica locations
async function loadLocations() {
  try {
    const data = await supabase.select('locations', {
      filter: 'active=eq.true',
      order: 'type.asc,id.asc'
    });
    return data || [];
  } catch (e) {
    console.error('Errore caricamento locations:', e);
    return [];
  }
}

// Crea ordine
async function createOrder(orderData) {
  try {
    const result = await supabase.insert('orders', {
      location_id: orderData.locationId,
      items: orderData.items,
      total: orderData.total,
      notes: orderData.notes || null,
      customer_name: orderData.customerName || null,
      status: 'pending'
    });
    return result ? result[0] : null;
  } catch (e) {
    console.error('Errore creazione ordine:', e);
    throw e;
  }
}

// Carica tutti gli ordini (admin)
async function loadOrders(statusFilter = null) {
  try {
    const params = {
      order: 'created_at.desc'
    };
    if (statusFilter) {
      params.filter = `status=eq.${statusFilter}`;
    }
    const data = await supabase.select('orders', params);
    return data || [];
  } catch (e) {
    console.error('Errore caricamento ordini:', e);
    return [];
  }
}

// Aggiorna stato ordine (admin)
async function updateOrderStatus(orderId, newStatus) {
  try {
    const result = await supabase.update('orders', { status: newStatus }, { id: orderId });
    return result ? result[0] : null;
  } catch (e) {
    console.error('Errore aggiornamento ordine:', e);
    throw e;
  }
}

// Verifica login admin
async function verifyAdmin(username, password) {
  try {
    const data = await supabase.select('admin_users', {
      filter: `username=eq.${username}&password_hash=eq.${password}`
    });
    return data && data.length > 0;
  } catch (e) {
    console.error('Errore verifica admin:', e);
    return false;
  }
}

// Sottoscrizione realtime agli ordini
function subscribeToOrders(callback) {
  return supabase
    .channel('orders-realtime')
    .on('postgres_changes', { table: 'orders' }, (payload) => {
      callback(payload);
    })
    .subscribe((status) => {
      console.log('Realtime status:', status);
    });
}
