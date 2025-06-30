import { getQueryParam, formatDateForInput } from './helpers.js';
import { fetchCustomers, fetchProducts, fetchVehicles, fetchSales, saveMaster, saveLine, deleteLine } from './api.js';
import { showSuccess,showError, populateDropdown, toggleOrderInfo, handleEnter } from './ui.js';

// Global değişkenler
let customers = [], products = [], vehicles = [], kalemListesi = [], editingIndex = null;
let masterId = 0; 
const BASE = 'http://localhost:5186/api/v1';

// Seçim fonksiyonları
export function selectCustomer(customer) {
    debugger;
  const input = document.getElementById('customerSelection');
  input.value = `${customer.customercode} - ${customer.customername}`;
  input.dataset.code = customer.customercode;
  input.dataset.name = customer.customername;
  document.getElementById('customerDropdown').style.display = 'none';
}

export function selectProduct(product) {
  const input = document.getElementById('productSelection');
  input.value = `${product.code} - ${product.name}`;
  input.dataset.code = product.code;
  input.dataset.name = product.name;
  document.getElementById('productDropdown').style.display = 'none';
}

export function selectVehicle(vehicle) {
  const input = document.getElementById('vehicleSelection');
  input.value = `${vehicle.vehiclePlate} - ${vehicle.chassisNumber}`;
  input.dataset.plate = vehicle.vehiclePlate;
  input.dataset.chassis = vehicle.chassisNumber;
  document.getElementById('vehicleDropdown').style.display = 'none';
}

// Global modal açma fonksiyonlarını pencereye ekle
window.openNewCustomerModal = function() {
  const modalEl = document.getElementById('newCustomerModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

window.openNewVehicleModal = function() {
  const modalEl = document.getElementById('newVehicleModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

// Uygulama başlangıcı
async function initApp() {
  debugger;
  const flowId = getQueryParam('flowId');

  // Tarih seçiciler
  flatpickr('#siparisTarihi', {
    enableTime: true,
    dateFormat: 'Y-m-d',
    defaultDate: new Date(),
    locale: flatpickr.l10ns.tr
  });
  flatpickr('#teslimTarihi', {
    enableTime: true,
    dateFormat: 'Y-m-d',
    defaultDate: new Date(),
    locale: flatpickr.l10ns.tr
  });

  // Lookup verileri (yalnızca data’yı çekiyoruz; dropdown’u henüz doldurmuyoruz)
  customers = await fetchCustomers();
  products  = await fetchProducts();
  vehicles  = await fetchVehicles();

  // Eğer flowId varsa formu doldur, yoksa yeni kayıt moduna al
  if (flowId) {
    try {
        debugger;
      const result = await fetchSales(flowId);
      if (result.data.id > 0) {
        document.getElementById('masId').value = result.data.id;
        document.querySelector("button[onclick='kaydetMas()']").textContent = 'Güncelle';
        populateFormWithSalesData(result.data);
        await fetchSiparisTra();
        document.getElementById('productSelectionCard').style.display    = 'block';
        document.getElementById('siparisiOlusturButton').classList.remove('d-none');
      }
    } catch {
      handleNewRecord();
    }
  } else {
    handleNewRecord();
  }

  // Buton ve klavye event’leri
  document.getElementById('toggleOrderInfo').onclick   = toggleOrderInfo;
  document.getElementById('productQuantity').onkeypress = e => handleEnter(e, addProduct);

  // --- Rehberleri yalnızca focus/input’ta doldurup açıyoruz ---

  // Müşteri rehberi
  const custInput = document.getElementById('customerSelection');
  custInput.addEventListener('focus', () => {
    populateDropdown(customers, 'customerDropdown',
      c => `${c.customercode} - ${c.customername}`, selectCustomer);
    document.getElementById('customerDropdown').style.display = 'block';
  });
  custInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    const filtered = customers.filter(c =>
      (c.customercode || '').toLowerCase().includes(term) ||
      (c.customername || '').toLowerCase().includes(term)
    );
    populateDropdown(filtered, 'customerDropdown',
      c => `${c.customercode} - ${c.customername}`, selectCustomer);
    document.getElementById('customerDropdown').style.display =
      filtered.length ? 'block' : 'none';
  });

  // Araç rehberi
  const vehInput = document.getElementById('vehicleSelection');
  vehInput.addEventListener('focus', () => {
    populateDropdown(vehicles, 'vehicleDropdown',
      v => `${v.vehiclePlate} - ${v.chassisNumber}`, selectVehicle);
    document.getElementById('vehicleDropdown').style.display = 'block';
  });
  vehInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    const filtered = vehicles.filter(v =>
      (v.vehiclePlate || '').toLowerCase().includes(term) ||
      (v.chassisNumber || '').toLowerCase().includes(term)
    );
    populateDropdown(filtered, 'vehicleDropdown',
      v => `${v.vehiclePlate} - ${v.chassisNumber}`, selectVehicle);
    document.getElementById('vehicleDropdown').style.display =
      filtered.length ? 'block' : 'none';
  });

  // Ürün rehberi
  const prodInput = document.getElementById('productSelection');
  prodInput.addEventListener('focus', () => {
    populateDropdown(products, 'productDropdown',
      p => `${p.code} - ${p.name}`, selectProduct);
    document.getElementById('productDropdown').style.display = 'block';
  });
  prodInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    const filtered = products.filter(p =>
      (p.code || '').toLowerCase().includes(term) ||
      (p.name || '').toLowerCase().includes(term)
    );
    populateDropdown(filtered, 'productDropdown',
      p => `${p.stockCode} - ${p.stockName}`, selectProduct);
    document.getElementById('productDropdown').style.display =
      filtered.length ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
  // Türleri liste halinde tutun
  ['customer', 'vehicle', 'product'].forEach(type => {
    const inputId    = `${type}Selection`;
    const dropdownId = `${type}Dropdown`;
    const inputEl    = document.getElementById(inputId);
    const ddEl       = document.getElementById(dropdownId);

    if (!inputEl || !ddEl) return;

    // Eğer tıklanan öğe ne input ne de dropdown içindeyse, gizle
    if (!inputEl.contains(e.target) && !ddEl.contains(e.target)) {
      ddEl.style.display = 'none';
    }
  });
});
}

// Hem DOMContentLoaded ile hem de hemen çağır
window.addEventListener('DOMContentLoaded', initApp);


// Yeni kayıt durumu
function handleNewRecord() {
  document.getElementById('productSelectionCard').style.display = 'none';
  document.getElementById('siparisiOlusturButton').classList.add('d-none');
}

// Form verilerini doldur
function populateFormWithSalesData(data) {
  debugger;
    // Master ID’yi al ve formu güncelle
document.getElementById('masId').value = data.id || '';
  masterId = data.id || 0; 

  // 1) CustomerCode’i al ve rehberde eşleşen isim için ara
  const custCode = data.customerCode || '';
  const matched = customers.find(c => c.customercode === custCode);
  const custName = matched ? (matched.customername || '') : '';

  // Eksik değişken tanımları eklendi
  const orderInput = document.getElementById('orderCodeHeader');
  const plasiyerInput = document.getElementById('plasiyerInput');

  if (orderInput.readOnly) {
    orderInput.placeholder = data.orderNumber || '';
  } else {
    orderInput.value = data.orderNumber || '';
  }

  plasiyerInput.value = data.salesManCode || '';

  // 2) Customer input’unu hem value hem dataset ile güncelle
  const custInput = document.getElementById('customerSelection');
  custInput.dataset.code = custCode;
  custInput.value = custCode ? `${custCode} - ${custName}` : '';

  // 3) Vehicle input’u hem value hem dataset ile güncelle
  const plate = data.licensePlate || '';
  const vehInput = document.getElementById('vehicleSelection');
  vehInput.dataset.plate = plate;
  vehInput.value = plate;

  // 4) Diğer alanlar

  document.getElementById('siparisTarihi').value     = data.orderDate    ? formatDateForInput(data.orderDate) : '';
  document.getElementById('teslimTarihi').value      = data.deliveryDate ? formatDateForInput(data.deliveryDate) : '';
  document.getElementById('aciklama1').value         = data.description  || '';
  document.getElementById('aciklama2').value         = data.description2 || '';

  // 5) MasId ve buton metni
  document.getElementById('masId').value = data.id || '';
  const saveBtn = document.querySelector("button[onclick='kaydetMas()']");
  if (saveBtn) saveBtn.textContent = 'Güncelle';

  // 6) Sipariş kodu placeholder
  document.getElementById('orderCodeHeader').placeholder = data.orderNumber || '';
}

// Satırları yükle ve tabloyu güncelle
async function fetchSiparisTra() {
  try {
    const flowId = getQueryParam("flowId");
    if (!flowId) throw new Error("Flow ID bulunamadı.");

    const res = await fetch(`http://localhost:5186/api/v1/sales/line/listlines/${flowId}`);
    if (!res.ok) throw new Error("SiparişTra API'sinden veri alınamadı.");

    const result = await res.json();
    const currencyMap = { 1:"TRY", 2:"EUR", 3:"USD" };

    // önce temizle
    kalemListesi = result.data.map(item => {
      // 1) lookup product by code
      const prod = products.find(p => p.stockCode === item.stockCode) || {};
      // 2) determine name: prefer lookup, else fallback to item
      const name =
        prod.stockName
        ?? prod.stockname           // in case you used lowercase earlier
        ?? item.stockName          // maybe API sent it here
        ?? item.name               // or here
        ?? "Bilinmeyen Ürün";

      return {
        id:          item.id,
        stockcode:   item.stockCode,
        stockname:   name,
        quantity:    item.amount,                   // API uses `amount`
        price:       item.price,
        currency:    currencyMap[item.currencyId]  
                      ?? "Bilinmiyor Döviz",
        discount:    item.discountRate  ?? 0,       // API uses `discountRate`
        //description: item.description    || ""
      };
    });

    populateProductTable();
  } catch (err) {
    console.error("❌ SiparişTra yüklenemedi", err);
  }
}

// Üst bilgiyi kaydet
export async function kaydetMas() {
  // Master ID (0 ise yeni kayıt)
  const masId = parseInt(document.getElementById('masId').value) || 0;

  // Diğer gerekli veriler
  const userId       = getQueryParam('userId')      || 'unknownUser';
  const flowId       = parseInt(getQueryParam('flowId')) || 0;
  const customerCode = document.getElementById('customerSelection').dataset.code || '';
  const licensePlate = document.getElementById('vehicleSelection').dataset.plate || '';
  const orderDate    = document.getElementById('siparisTarihi').value || null;
  const deliveryDate = document.getElementById('teslimTarihi').value || null;
  const description  = document.getElementById('aciklama1').value   || '';
  const description2 = document.getElementById('aciklama2').value  || '';
  const discountRate = parseFloat(document.getElementById('iskontoOrani').value) || 0;
  const orderNumber   = document.getElementById('orderCodeHeader').value|| document.getElementById('orderCodeHeader').placeholder;
  const salesManCode  = document.getElementById('plasiyerInput').value;

  // Master nesnesi
  const master = {
    id:            masId,
    userId:        userId,
    wfState:       0,
    flowId:        flowId,
    customerCode:  customerCode,
    licensePlate:  licensePlate,
    orderDate:     orderDate,
    deliveryDate:  deliveryDate,
    description:   description,
    description2:  description2,
    discountRate:  discountRate,
    orderNumber:   orderNumber,
    salesManCode:  salesManCode
  };

  try {
    // API çağrısı
    const res = await saveMaster(master);
    
    console.log('saveMaster response:', res); // Debug için

    // Dönen ID değerini masterId'ye ata
    if (res && res.data && res.data.id) {
      masterId = res.data.id;
      document.getElementById('masId').value = masterId;
      console.log('masterId set to:', masterId); // Debug için
    } else {
      console.error('API response yapısı beklenmeyen:', res);
    }

    // Satırları yeniden yükle
    await fetchSiparisTra();
    

    // UI güncelle
    document.getElementById('siparisiOlusturButton').classList.remove('d-none');
    document.getElementById('productSelectionCard').style.display = 'block';
    
    // showSuccess zaten api.js'de gösteriliyor, tekrar göstermek gereksiz
  } catch (e) {
    console.error('Üst bilgi kaydedilemedi', e);
    showError('Üst bilgi kaydedilemedi. Lütfen tekrar deneyiniz.');
  }
}

// Kalem ekleme
async function addProduct() {
  console.log('addProduct çağrıldı, masterId:', masterId); // Debug için
  
  // 1) Üst bilgi kontrolü
  if (!masterId || masterId === 0) {
    console.log('masterId kontrolü başarısız:', masterId);
    return showError('Lütfen önce üst bilgiyi kaydedin!');
  }

  // 2) Form değerlerini oku
  const prodInput     = document.getElementById('productSelection');
  const qtyInput      = document.getElementById('productQuantity');
  const priceInput    = document.getElementById('productPrice');
  const discountInput = document.getElementById('productDiscount');
  const currencyInput = document.getElementById('currencyType');
  //const description   = document.getElementById('description')?.value.trim() || '';

  const code     = prodInput.dataset.code;
  const name     = prodInput.dataset.name;
  const qty      = parseFloat(qtyInput.value);
  const price    = parseFloat(priceInput.value);
  const discount = parseFloat(discountInput.value) || 0;
  const currency = getCurrencyKey(currencyInput.value);

  // 3) Validasyon
  if (!code || !name)       return showError('Lütfen geçerli bir ürün seçin!');
  if (qty <= 0 || price <= 0) return showError('Miktar ve fiyat 0’dan büyük olmalı!');

  // 4) Line objesini hazırla
  const lineData = {
    id:            0,
    masterId:      masterId,
    userId:        getQueryParam('userId') || 'unknownUser',
    flowId:        parseInt(getQueryParam('flowId')) || 0,
    stockCode:     code,
    amount:        qty,
    price:         price,
    discountRate:  discount,
    currencyId:    currency,
    //description:   description
  };

  try {
    // 5) Kaydet ve dönen data’yı al
    debugger;
    const created = await saveLine(lineData);

    // 6) Sadece bu satırı listeye ekle
    kalemListesi.push({
      id:          created.id,
      stockcode:   created.stockCode,
      stockname:   created.stockName || name,
      quantity:    created.amount,
      price:       created.price,
      currency:    currencyInput.value,
      discount:    created.discountRate,
     // description: created.description || ''
    });

    // 7) Tabloyu güncelle, formu temizle ve başarı mesajı göster
    populateProductTable();
    resetProductForm();
    showSuccess('Satır başarıyla eklendi');
  } catch {
    // Hata mesajı saveLine içinde gösterildi
  }
}
   


// Tabloyu doldur
function populateProductTable() {
  const table = document.getElementById('productTable');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = ''; // önceki satırları temizle

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
}

// Satır sil
async function removeProductHandler(id, idx) {
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
function editProduct(idx) {
  const kalem = kalemListesi[idx];
  
  // Form alanlarını doldur
  document.getElementById('productSelection').value = `${kalem.stockcode} - ${kalem.stockname}`;
  document.getElementById('productSelection').dataset.code = kalem.stockcode;
  document.getElementById('productSelection').dataset.name = kalem.stockname;
  document.getElementById('productQuantity').value = kalem.quantity;
  document.getElementById('productPrice').value = kalem.price;
  document.getElementById('currencyType').value = kalem.currency;
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
async function updateProduct(idx) {
  const kalem = kalemListesi[idx];
  
  // Form değerlerini oku
  const code = document.getElementById('productSelection').dataset.code;
  const name = document.getElementById('productSelection').dataset.name;
  const qty = parseFloat(document.getElementById('productQuantity').value);
  const price = parseFloat(document.getElementById('productPrice').value);
  const currency = document.getElementById('currencyType').value;
  const discount = parseFloat(document.getElementById('productDiscount').value) || 0;

  // Validasyon
  if (!code || qty <= 0 || price <= 0) {
    return showError('Geçerli ürün, miktar ve fiyat girin.');
  }

  // API'ye güncellenmiş satır verisini gönder
  const lineData = {
    id: kalem.id, // Mevcut satırın ID'si
    masterId: masterId,
    userId: getQueryParam('userId') || 'unknownUser',
    flowId: parseInt(getQueryParam('flowId')) || 0,
    stockCode: code,
    amount: qty,
    price: price,
    discountRate: discount,
    currencyId: getCurrencyKey(currency)
  };

  try {
    // API çağrısı (saveLine fonksiyonu ID'si 0 değilse güncelleme yapacak)
    const updated = await saveLine(lineData);

    // Local listeyi güncelle
    kalem.stockcode = code;
    kalem.stockname = name;
    kalem.quantity = qty;
    kalem.price = price;
    kalem.currency = currency;
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

// Miktar güncelle
function updateQuantity(input, idx) {
  const val = parseFloat(input.value);
  if (val > 0) kalemListesi[idx].quantity = val;
  else input.value = kalemListesi[idx].quantity;
}

// İskonto güncelle
function updateDiscount(input, idx) {
  const val = parseFloat(input.value);
  if (val >= 0 && val <= 100) kalemListesi[idx].discount = val;
  else input.value = kalemListesi[idx].discount;
}

// Formu temizle
function resetProductForm() {
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

// Proforma oluştur
export function generateProforma() {
  const doc = new jspdf.jsPDF();
  doc.setFillColor(161,196,253);
  doc.rect(0,0,210,30,'F');
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.setTextColor(255,255,255);
  doc.text('Proforma Faturası',105,15,{align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(12);
}


export async function saveNewVehicle() {
  const vehicleData = {
    id: 0, // Yeni araç için ID 0 gönderiliyor
    createUser: "currentUser", // Kullanıcı bilgisi eklenmeli

    updateUser: "currentUser", // Kullanıcı bilgisi eklenmeli
    wfState: 0, // Varsayılan workflow durumu
    vehiclePlate: document.getElementById("newVehiclePlate").value.trim(),
    chassisNumber: document.getElementById("newVehicleChassis").value.trim(),
    engineNumber: document.getElementById("newVehicleEngine").value.trim(),
    brand: document.getElementById("newVehicleBrand").value.trim(),
    model: document.getElementById("newVehicleModel").value.trim(),
    modelYear: document.getElementById("newVehicleYear").value.trim(),
    fuelType: document.getElementById("newVehicleFuelType").value.trim(),
    enginePower: document.getElementById("newVehiclePower").value.trim(),
    kilometer: document.getElementById("newVehicleKm").value.trim(),
    tireTreadDepth: document.getElementById("newVehicleTireDepth").value.trim(),
    batteryStatus: document.getElementById("newVehicleBatteryStatus").value.trim(),
  };

  if (!vehicleData.vehiclePlate || !vehicleData.chassisNumber || !vehicleData.engineNumber || !vehicleData.brand || !vehicleData.model) {
    showError("Lütfen zorunlu alanları doldurunuz!");
    return;
  }

  try {
    const response = await fetch('http://localhost:5186/api/v1/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });

    const result = await response.json();
    if (!result.success) {
      if (result.errorCode === "BUSINESS") {
        showError(result.errorDetail || "İş mantığı hatası oluştu.");
      } else {
        throw new Error('Araç eklenemedi.');
      }
      return;
    }

    console.log("✅ Araç başarıyla eklendi:", result);

    // Lookup listesini yenilemek için fetchVehicles() çağırılıyor
    await fetchVehicles();

    // Input alanını güncelle
    const input = document.getElementById("vehicleSelection");
    input.value = `${vehicleData.vehiclePlate} - ${vehicleData.chassisNumber}`;
    input.dataset.plate = vehicleData.vehiclePlate;
    input.dataset.chassis = vehicleData.chassisNumber;

    // Modal'ı kapat
    const modal = bootstrap.Modal.getInstance(document.getElementById('newVehicleModal'));
    modal.hide();
  } catch (error) {
    console.error("❌ Araç eklenemedi:", error);
    showError("Araç eklenemedi. Lütfen tekrar deneyiniz.");
  }
}

 export async function saveNewCustomer() {
  const customerName = document.getElementById("newCustomerName").value.trim();
  const customerCode = document.getElementById("newCustomerCode").value.trim();
  const vknTc = document.getElementById("vknTc").value.trim();
  const taxOffice = document.getElementById("vergiDairesi").value.trim();
  const address = document.getElementById("adres").value.trim();
  const telephone = document.getElementById("telefon").value.trim();
  const paymentTypeStr = document.getElementById("odemeTipi").value;
  const email = document.getElementById("eposta").value.trim();
  const userId=getQueryParam("userId") || "unknownUser"; // URL'den userId alınır

  // Zorunlu alan kontrolü
  if (!customerName || !customerCode || !vknTc) {
    showError("Lütfen zorunlu alanları doldurunuz!");
    return;
  }

  // Ödeme tipini dönüştür (paymentTypeKeys global obje tanımlı olmalı)
  const paymentTypeKey = paymentTypeKeys[paymentTypeStr] !== undefined ? paymentTypeKeys[paymentTypeStr] : 0;

  // URL'den flowId alınır (ilgili query parametresi yoksa 0 alınır)
  const flowId = parseInt(getQueryParam("flowId")) || 0;

  const customerData = {
    id: 0,
    createDate: new Date().toISOString(),
    createUser: userId,
    updateDate: new Date().toISOString(),
    updateUser: userId,
    wfState: 0,
    customerCode: customerCode,
    customerName: customerName,
    vknTc: vknTc,
    taxOffice: taxOffice,
    address: address,
    telephone: telephone,
    paymentType: paymentTypeKey,
    email: email,
    flowId: flowId
  };

  try {
    const response = await fetch('http://localhost:5186/api/v1/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    const result = await response.json();

    if (!result.success) {
      if (result.errorCode === "BUSINESS") {
        showError(result.errorDetail || "İş mantığı hatası oluştu.");
      } else {
        throw new Error('Cari eklenemedi.');
      }
      return;
    }

    console.log("✅ Cari başarıyla eklendi:", result);

    // Cari lookup listesini yenilemek için fetchCustomers() çağrılıyor
    await fetchCustomers();

    // Müşteri seçim alanını güncelle
    const input = document.getElementById("customerSelection");
    input.value = `${customerData.customerCode} - ${customerData.customerName}`;
    input.dataset.code = customerData.customerCode;
    input.dataset.name = customerData.customerame;

    // Modal'ı kapat
    const modal = bootstrap.Modal.getInstance(document.getElementById('newCustomerModal'));
    modal.hide();
  } catch (error) {
    console.error("❌ Cari eklenemedi:", error);
    showError("Cari eklenemedi. Lütfen tekrar deneyiniz.");
  }
}

export const paymentTypeKeys = {
  "Nakit": 0,
  "Kredi Kartı": 1
};

// Döviz türü dizinleri (Satır eklerken/okurken kullanılıyor)
export const currencyKeys = {
  "TRY": 1,
  "EUR": 2,
  "USD": 3
};

function getCurrencyKey(currency) {
  return currencyKeys[currency] || 0; // Eğer eşleşme yoksa varsayılan olarak 0 döner
}

async function createOrder() {
  try {
    // Mevcut kayıt/gönderme işlemleriniz
    // const master = {
    //   // ... üst bilgi objeniz
    // };
    // await saveMaster(master);

    // Sipariş satırları varsa onları da kaydet
    // await Promise.all(kalemListesi.map(line => saveLine(line)));

    // 🎉 Başarı toast’ı
    showSuccess('Sipariş başarıyla oluşturuldu');

    // İsterseniz formu resetleyebilir veya başka bir sayfaya yönlendirebilirsiniz
    // resetAllForms();
    // window.location.href = '/orders';
  } catch (e) {
    console.error('siparisiOlustur hata:', e);
    showError('Sipariş oluşturulamadı, lütfen tekrar deneyiniz.');
  }
}

window.createOrder = createOrder;
window.openNewCustomerModal = openNewCustomerModal;
window.openNewVehicleModal  = openNewVehicleModal;
window.saveNewCustomer= saveNewCustomer;
window.saveNewVehicle = saveNewVehicle;

// Sipariş üst bilgi ve kalem işlemleri
window.kaydetMas            = kaydetMas;
window.addProduct           = addProduct;
window.removeProductHandler = removeProductHandler;
window.editProduct          = editProduct;
window.updateProduct        = updateProduct;
window.resetProductForm     = resetProductForm;

// Proforma ve sipariş oluşturma
window.generateProforma     = generateProforma;
//window.siparisOlustur      = siparisOlustur;  
window.fetchCustomers    = fetchCustomers;
window.fetchProducts     = fetchProducts;
window.fetchVehicles     = fetchVehicles;
window.fetchSiparisTra   = fetchSiparisTra; 