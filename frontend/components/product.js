import { getQueryParam } from '../services/helpers.js';
import { showError, showSuccess } from './ui.js';
import { saveLine, deleteLine } from '../services/api.js';
import { API_CONFIG } from '../config.js';

// Global değişkenler
export let kalemListesi = [];
export let editingIndex = null;
export let masterId = 0;

// masterId getter/setter
export function setMasterId(id) {
  masterId = id;
}

export function getMasterId() {
  return masterId;
}

// Ürün seçim fonksiyonu
export function selectProduct(product) {
  const input = document.getElementById('productSelection');
  // Product objesi için doğru field'ları kullan
  const productCode = product.stockCode || product.code || '';
  const productName = product.stockName || product.name || '';
  
  input.value = `${productCode} - ${productName}`;
  input.dataset.code = productCode;
  input.dataset.name = productName;
  
  // Araç ve müşteri seçimiyle uyumlu şekilde dropdown'ı kapat
  const dd = document.getElementById('productDropdown');
  if (dd) {
    dd.style.display = 'none';
    dd.style.visibility = 'hidden';
    dd.style.opacity = '0';
    dd.style.pointerEvents = 'none';
  }
}

// Döviz türü dizinleri
export const currencyKeys = {
  "TRY": 0,

};

function getCurrencyKey(currency) {
  return currencyKeys[currency] || 0;
}

// Kalem ekleme
export async function addProduct() {
  console.log('addProduct çağrıldı, masterId:', masterId);
  
  // Üst bilgi kontrolü
  if (!masterId || masterId === 0) {
    console.log('masterId kontrolü başarısız:', masterId);
    return showError('Lütfen önce üst bilgiyi kaydedin!');
  }

  // Form değerlerini oku
  const prodInput = document.getElementById('productSelection');
  const qtyInput = document.getElementById('productQuantity');
  const priceInput = document.getElementById('productPrice');
  const discountInput = document.getElementById('productDiscount');
  const currencyInput = document.getElementById('currencyType');

  const code = prodInput.dataset.code;
  const name = prodInput.dataset.name;
  const qty = parseFloat(qtyInput.value);
  const price = parseFloat(priceInput.value);
  const discount = parseFloat(discountInput.value) || 0;
  const currency = 0; // Sabit TRY

  // Validasyon
  if (!code || code.trim() === '') return showError("Ürün kodu zorunludur!");
  if (!qty || isNaN(qty) || qty <= 0) return showError("Miktar zorunludur ve 0'dan büyük olmalıdır!");
  if (!price || isNaN(price) || price <= 0) return showError("Fiyat zorunludur ve 0'dan büyük olmalıdır!");
  
  // MasterId kontrolü
  if (!masterId || masterId === 0) {
    return showError('Lütfen önce üst bilgiyi kaydedin!');
  }

  console.log('🔗 addProduct - masterId:', masterId);

  // Line objesini hazırla
  const lineData = {
    id: 0,
    masterId: masterId,
    userId: getQueryParam('userId') || 'unknownUser',
    flowId: parseInt(getQueryParam('flowId')) || 0,
    stockCode: code,
    amount: qty,
    price: price,
    discountRate: discount,
    currencyId: currency,
  };

  console.log('🔗 Line data:', lineData);

  try {
    const created = await saveLine(lineData);

    // Sadece bu satırı listeye ekle
    kalemListesi.push({
      id: created.id,
      stockcode: created.stockCode,
      stockname: created.stockName || name,
      quantity: created.amount,
      price: created.price,
      currency: 'TRY', // Sabit TRY
      discount: created.discountRate,
    });

    // Tabloyu güncelle, formu temizle ve başarı mesajı göster
    populateProductTable();
    resetProductForm();
    showSuccess('Satır başarıyla eklendi');
  } catch {
    // Hata mesajı saveLine içinde gösterildi
  }
}

// Tabloyu doldur
export function populateProductTable() {
  const table = document.getElementById('productTable');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  // Global products verilerini kullan
  const products = window.productsData || [];

  kalemListesi.forEach((kalem, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${kalem.stockcode}</td>
      <td>${kalem.stockname}</td>
      <td>${parseFloat(kalem.price).toFixed(2)}</td>
      <td>${kalem.currency}</td>
      <td class="text-center">${kalem.quantity}</td>
      <td class="text-center">${kalem.discount}</td>
      
      <td class="text-center">
        <button class="btn btn-danger btn-sm" onclick="removeProductHandler(${kalem.id}, ${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    // Çift tıklayınca editProduct çağrısı
    tr.ondblclick = () => editProduct(index);

    tbody.appendChild(tr);
  });

  // Tabloyu göster/gizle
  table.style.display = kalemListesi.length ? 'table' : 'none';
  
  // Summary güncellemesi
  updateSummary();
}

// Satır sil
export async function removeProductHandler(id, idx) {
  const userId = getQueryParam('userId');
  const res = await Swal.fire({ title: 'Emin misiniz?', showCancelButton: true });
  if (!res.isConfirmed) return;
  try {
    await deleteLine(id, userId);
    kalemListesi.splice(idx, 1);
    populateProductTable();
  } catch {
    showError('Silinemedi');
  }
}

// Satır düzenle
export function editProduct(idx) {
  const kalem = kalemListesi[idx];
  
  // Form alanlarını doldur
  document.getElementById('productSelection').value = `${kalem.stockcode} - ${kalem.stockname}`;
  document.getElementById('productSelection').dataset.code = kalem.stockcode;
  document.getElementById('productSelection').dataset.name = kalem.stockname;
  document.getElementById('productQuantity').value = kalem.quantity;
  document.getElementById('productPrice').value = kalem.price;
  document.getElementById('currencyType').value = 'TRY'; // Sabit TRY
  document.getElementById('productDiscount').value = kalem.discount;
  
  // Butonu güncelleme moduna çevir
  const addButton = document.querySelector("button[onclick='addProduct()']");
  if (addButton) {
    addButton.textContent = "Güncelle";
    addButton.setAttribute("onclick", `updateProduct(${idx})`);
  }
  
  editingIndex = idx;
}

// Satır güncelle
export async function updateProduct(idx) {
  const kalem = kalemListesi[idx];
  
  // Form değerlerini oku
  const code = document.getElementById('productSelection').dataset.code;
  const name = document.getElementById('productSelection').dataset.name;
  const qty = parseFloat(document.getElementById('productQuantity').value);
  const price = parseFloat(document.getElementById('productPrice').value);
  const currency = 'TRY'; // Sabit TRY
  const discount = parseFloat(document.getElementById('productDiscount').value) || 0;

  // Validasyon
  if (!code || qty <= 0 || price <= 0) {
    return showError('Geçerli ürün, miktar ve fiyat girin.');
  }
  
  // MasterId kontrolü
  if (!masterId || masterId === 0) {
    return showError('MasterId bulunamadı! Lütfen sayfayı yenileyin.');
  }

  console.log('🔗 updateProduct - masterId:', masterId);

  // API'ye güncellenmiş satır verisini gönder
  const lineData = {
    id: kalem.id,
    masterId: masterId,
    userId: getQueryParam('userId') || 'unknownUser',
    flowId: parseInt(getQueryParam('flowId')) || 0,
    stockCode: code,
    amount: qty,
    price: price,
    discountRate: discount,
    currencyId: 0 // Sabit TRY (code: 0)
  };

  try {
    const updated = await saveLine(lineData);

    // Local listeyi güncelle
    kalem.stockcode = code;
    kalem.stockname = name;
    kalem.quantity = qty;
    kalem.price = price;
    kalem.currency = 'TRY'; // Sabit TRY
    kalem.discount = discount;

    // Tabloyu güncelle ve formu temizle
    populateProductTable();
    resetProductForm();
    
    // Güncelleme başarılı mesajı
    showSuccess('Satır başarıyla güncellendi');
  } catch (error) {
    console.error('Satır güncelleme hatası:', error);
    showError('Satır güncellenemedi.');
  }
}

// Formu temizle
export function resetProductForm() {
  document.getElementById('productSelection').value = '';
  document.getElementById('productSelection').dataset.code = '';
  document.getElementById('productSelection').dataset.name = '';
  document.getElementById('productQuantity').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('currencyType').value = 'TRY';
  document.getElementById('productDiscount').value = 0;
  
  // Butonu ekleme moduna çevir
  const addButton = document.querySelector("button[onclick^='updateProduct'], button[onclick='addProduct()']");
  if (addButton) {
    addButton.textContent = 'Ekle';
    addButton.setAttribute('onclick', 'addProduct()');
  }
  
  editingIndex = null;
}

// Satırları yükle ve tabloyu güncelle
export async function fetchSiparisTra(productsParam = null) {
  try {
    // Global products verilerini kullan, parametre varsa onu kullan
    const products = productsParam || window.productsData || [];
    
    console.log('fetchSiparisTra - products from:', productsParam ? 'parameter' : 'global window');
    console.log('fetchSiparisTra - products count:', products.length);
    
    // masterId kullan, flowId değil
    if (!masterId || masterId === 0) {
      console.log("masterId mevcut değil, kalemler yüklenemiyor:", masterId);
      kalemListesi = [];
      populateProductTable();
      return;
    }

    console.log('fetchSiparisTra - masterId:', masterId);

    const res = await fetch(`${API_CONFIG.BASE_URL}/sales/line/listlines/${masterId}`);
    if (!res.ok) throw new Error("SiparişTra API'sinden veri alınamadı.");

    const result = await res.json();
    const currencyMap = { 0:"TRY", 1:"TRY", 2:"EUR", 3:"USD" }; // 0 ve 1 için TRY

    console.log('fetchSiparisTra - products array:', products);
    console.log('fetchSiparisTra - result.data:', result.data);

    kalemListesi = result.data.map(item => {
      console.log('Processing item:', item);
      console.log('Available products for matching:', products.slice(0, 3)); // İlk 3 ürünü göster
      
      // Önce basit matching'i dene
      let prod = products.find(p => p.stockCode === item.stockCode);
      
      // Eğer bulamazsa alternatif field name'leri dene
      if (!prod) {
        prod = products.find(p => {
          const pCode = p.code || p.Code || '';
          return pCode.toLowerCase() === item.stockCode.toLowerCase();
        });
      }

      console.log(`Stock code: ${item.stockCode}, Found product:`, prod);

      // Ürün ismini al
      let name = "Bilinmeyen Ürün";
      if (prod) {
        name = prod.stockName || prod.name || prod.Name || prod.stockname || "Bilinmeyen Ürün";
      } else {
        // Fallback: item'dan al
        name = item.stockName || item.name || "Bilinmeyen Ürün";
      }

      console.log(`Final name for ${item.stockCode}:`, name);

      return {
        id: item.id,
        stockcode: item.stockCode,
        stockname: name,
        quantity: item.amount,
        price: item.price,
        currency: "TRY", // Sabit TRY
        discount: item.discountRate ?? 0,
      };
    });

    console.log('Final kalemListesi:', kalemListesi);
    populateProductTable();
  } catch (err) {
    console.error("❌ SiparişTra yüklenemedi", err);
  }
}

// Summary hesaplama fonksiyonları
export function updateSummary() {
  let subTotal = 0;
  let totalDiscountAmount = 0;
  let totalItems = 0;
  let totalQuantity = 0;

  // Kalem bazında iskonto hesaplama
  kalemListesi.forEach(item => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const discount = parseFloat(item.discount) || 0;
    
    const lineSubTotal = price * quantity;
    const lineDiscountAmount = lineSubTotal * (discount / 100);
    
    subTotal += lineSubTotal;
    totalDiscountAmount += lineDiscountAmount;
    totalItems++;
    totalQuantity += quantity;
  });

  // Genel iskonto hesaplama (sipariş üst bilgisi)
  const generalDiscountElement = document.getElementById('iskontoOrani');
  const generalDiscountRate = parseFloat(generalDiscountElement?.value) || 0;
  
  // Genel iskonto, kalem bazında iskonto uygulandıktan sonraki ara toplam üzerinden hesaplanır
  const subTotalAfterLineDiscounts = subTotal - totalDiscountAmount;
  const generalDiscountAmount = subTotalAfterLineDiscounts * (generalDiscountRate / 100);
  
  // Toplam iskonto tutarı: kalem bazında iskonto + genel iskonto
  const totalDiscountAmountWithGeneral = totalDiscountAmount + generalDiscountAmount;
  
  // Genel toplam: ara toplam - toplam iskonto tutarı
  const grandTotal = subTotal - totalDiscountAmountWithGeneral;

  // DOM güncellemeleri
  document.getElementById('subTotal').textContent = `${subTotal.toFixed(2)} TRY`;
  document.getElementById('discountAmount').textContent = `${totalDiscountAmountWithGeneral.toFixed(2)} TRY`;
  document.getElementById('grandTotal').textContent = `${grandTotal.toFixed(2)} TRY`;
  document.getElementById('totalItems').textContent = totalItems.toString();
  document.getElementById('totalQuantity').textContent = totalQuantity.toString();

  // Summary alanını göster/gizle
  const summarySection = document.getElementById('summarySection');
  if (kalemListesi.length > 0) {
    summarySection.style.display = 'block';
  } else {
    summarySection.style.display = 'none';
  }
}
