// Sipariş raporu gridini doldurur ve detay butonları ekler
// API endpoint ve kolonlar backend'den dinamik olarak alınacak

const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : '../config.js';
const ORDERS_ENDPOINT = '/orders/report'; // Bunu backend'den alacağınız endpoint ile değiştirin

// Grid başlıklarını ve verileri doldur
async function loadOrdersGrid() {
  try {
    // Kolon ve veri çek
    const response = await fetch(`${API_URL}${ORDERS_ENDPOINT}`);
    const result = await response.json();
    if (!result.success || !Array.isArray(result.data)) {
      document.getElementById('ordersGridBody').innerHTML = '<tr><td colspan="99">Kayıt bulunamadı.</td></tr>';
      return;
    }
    const orders = result.data;
    if (orders.length === 0) {
      document.getElementById('ordersGridBody').innerHTML = '<tr><td colspan="99">Kayıt bulunamadı.</td></tr>';
      return;
    }
    // Kolon başlıklarını dinamik oluştur
    const columns = Object.keys(orders[0]);
    const headerRow = document.getElementById('ordersGridHeader');
    headerRow.innerHTML = '';
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    // Detay butonu başlığı
    const thDetail = document.createElement('th');
    thDetail.textContent = 'Detay';
    headerRow.appendChild(thDetail);
    // Satırları doldur
    const body = document.getElementById('ordersGridBody');
    body.innerHTML = '';
    orders.forEach(order => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = order[col];
        tr.appendChild(td);
      });
      // Detay butonu
      const tdDetail = document.createElement('td');
      const btn = document.createElement('button');
      btn.textContent = 'Detay';
      btn.className = 'btn btn-outline-primary btn-sm';
      btn.onclick = () => {
        // flowId parametresi ile index.html'e yönlendir
        if (order.flowId) {
          window.location.href = `../index.html?flowId=${order.flowId}&readonly=1`;
        }
      };
      tdDetail.appendChild(btn);
      tr.appendChild(tdDetail);
      body.appendChild(tr);
    });
  } catch (err) {
    document.getElementById('ordersGridBody').innerHTML = '<tr><td colspan="99">Hata oluştu.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', loadOrdersGrid);
