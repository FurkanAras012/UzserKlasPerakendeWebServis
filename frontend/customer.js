import { getQueryParam } from './helpers.js';
import { showError, showSuccess } from './ui.js';
import { fetchCustomers } from './api.js';
import { API_CONFIG } from './config.js';

// Müşteri seçim fonksiyonu
export function selectCustomer(customer) {
  const input = document.getElementById('customerSelection');
  input.value = `${customer.customercode} - ${customer.customername}`;
  input.dataset.code = customer.customercode;
  input.dataset.name = customer.customername;
  document.getElementById('customerDropdown').style.display = 'none';
}

// Yeni müşteri modal açma
export function openNewCustomerModal() {
  const modalEl = document.getElementById('newCustomerModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Ödeme tipi anahtarları
export const paymentTypeKeys = {
  "Nakit": 0,
  "Kredi Kartı": 1
};

// Yeni müşteri kaydetme
export async function saveNewCustomer() {
  const customerName = document.getElementById("newCustomerName").value.trim();
  const customerCode = document.getElementById("newCustomerCode").value.trim();
  const vknTc = document.getElementById("vknTc").value.trim();
  const taxOffice = document.getElementById("vergiDairesi").value.trim();
  const address = document.getElementById("adres").value.trim();
  const telephone = document.getElementById("telefon").value.trim();
  const paymentTypeStr = document.getElementById("odemeTipi").value;
  const email = document.getElementById("eposta").value.trim();
  const userId = getQueryParam("userId") || "unknownUser";

  // Zorunlu alan kontrolü
  if (!customerName || !customerCode || !vknTc) {
    showError("Lütfen zorunlu alanları doldurunuz!");
    return;
  }

  // Ödeme tipini dönüştür
  const paymentTypeKey = paymentTypeKeys[paymentTypeStr] !== undefined ? paymentTypeKeys[paymentTypeStr] : 0;

  // URL'den flowId alınır
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
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

    // Cari lookup listesini yenilemek için fetchCustomers() çağırılıyor
    await fetchCustomers();

    // Müşteri seçim alanını güncelle
    const input = document.getElementById("customerSelection");
    input.value = `${customerData.customerCode} - ${customerData.customerName}`;
    input.dataset.code = customerData.customerCode;
    input.dataset.name = customerData.customerName;

    // Modal'ı kapat
    const modal = bootstrap.Modal.getInstance(document.getElementById('newCustomerModal'));
    modal.hide();
  } catch (error) {
    console.error("❌ Cari eklenemedi:", error);
    showError("Cari eklenemedi. Lütfen tekrar deneyiniz.");
  }
}
