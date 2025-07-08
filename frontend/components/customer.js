import { getQueryParam } from '../services/helpers.js';
import { showError, showSuccess } from './ui.js';
import { fetchCustomers } from '../services/api.js';
import { API_CONFIG } from '../config.js';

// İmza kutucuklarını güncelleme fonksiyonu
export function updateSignatureBoxes() {
  // Müşteri adını al
  const customerInput = document.getElementById('customerSelection');
  const customerName = customerInput.dataset.name || '';
  
  // Plasiyer adını al
  const plasiyerInput = document.getElementById('plasiyerInput');
  const plasiyerName = plasiyerInput.value || '';
  
  // İmza kutucuklarını güncelle
  const customerSignatureElement = document.getElementById('customerSignatureName');
  const plasiyerSignatureElement = document.getElementById('plasiyerSignatureName');
  
  if (customerSignatureElement) {
    customerSignatureElement.textContent = customerName || '________________________';
  }
  
  if (plasiyerSignatureElement) {
    plasiyerSignatureElement.textContent = plasiyerName || '________________________';
  }
}

// Müşteri seçim fonksiyonu
export function selectCustomer(customer) {
  const input = document.getElementById('customerSelection');
  input.value = customer.customercode ? `${customer.customercode} - ${customer.customername}` : customer.customername;
  input.dataset.code = customer.customercode;
  input.dataset.name = customer.customername;
  // Araç seçimiyle uyumlu şekilde tüm stil özelliklerini de sıfırla
  const dd = document.getElementById('customerDropdown');
  if (dd) {
    dd.style.display = 'none';
    dd.style.visibility = 'hidden';
    dd.style.opacity = '0';
    dd.style.pointerEvents = 'none';
  }
  // İmza kutucuklarını güncelle
  updateSignatureBoxes();
}

// Yeni müşteri modal açma
export function openNewCustomerModal() {
  // Formu temizle
  document.getElementById('newCustomerName').value = '';
  document.getElementById('newCustomerCode').value = '';
  document.getElementById('vknTc').value = '';
  document.getElementById('vergiDairesi').value = '';
  document.getElementById('adres').value = '';
  document.getElementById('telefon').value = '';
  document.getElementById('city').value = '';
  document.getElementById('odemeTipi').value = '';
  document.getElementById('eposta').value = '';
  
  const modalEl = document.getElementById('newCustomerModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Müşteri detaylarını görüntüleme modalını açma
export async function openCustomerDetailModal(customer) {
  console.log('🔍 openCustomerDetailModal çağrıldı, customer:', customer);
  
  try {
    // FlowId'yi al
    const flowId = getQueryParam('flowId');
    console.log('📋 FlowId:', flowId);
    
    let response, result;
    
    // Önce flowId ile müşteri kaydını getirmeye çalış
    if (flowId) {
      response = await fetch(`${API_CONFIG.BASE_URL}/customers/by-flowid/${flowId}`);
      result = await response.json();
      console.log('🌐 FlowId ile API response:', result);
    }
    
    // Eğer flowId ile bulunamazsa, müşteri kodu ile dene
    if (!result || !result.success || !result.data) {
      const customerCode = customer.customercode;
      console.log('📋 Customer code ile deneniyor:', customerCode);
      
      if (customerCode) {
        response = await fetch(`${API_CONFIG.BASE_URL}/customers/by-code/${customerCode}`);
        result = await response.json();
        console.log('🌐 CustomerCode ile API response:', result);
      }
    }
    
    if (!result || !result.success || !result.data) {
      console.log('⚠️ Müşteri bizim veritabanında yok, Tiger ERP bilgilerini göster');
      // Eğer bizim veritabanında müşteri yoksa Tiger ERP'den alınan bilgileri göster
      showCustomerFromLookup(customer);
      return;
    }
    
    const customerData = result.data;
    console.log('✅ Müşteri verisi alındı:', customerData);
    
    // Readonly form alanlarını doldur
    document.getElementById('viewCustomerName').value = customerData.customerName || '';
    document.getElementById('viewCustomerCode').value = customerData.customerCode || '';
    document.getElementById('viewVknTc').value = customerData.vknTc || '';
    document.getElementById('viewVergiDairesi').value = customerData.taxOffice || '';
    document.getElementById('viewAdres').value = customerData.address || '';
    document.getElementById('viewTelefon').value = customerData.telephone || '';
    document.getElementById('viewEposta').value = customerData.email || '';
    
    // Şehir adını göster (cityId'den şehir adını getir)
    if (customerData.cityId && window.cities) {
      const city = window.cities.find(c => c.logicalref === customerData.cityId);
      document.getElementById('viewCity').value = city ? city.name : '';
    } else {
      document.getElementById('viewCity').value = '';
    }
    
    // Ödeme tipini göster
    const paymentTypes = { 0: 'Nakit', 1: 'Kredi Kartı' };
    document.getElementById('viewOdemeTipi').value = paymentTypes[customerData.paymentType] || '';
    
    console.log('📝 Modal alanları dolduruldu');
    
    // Modal'ı aç
    const modalEl = document.getElementById('customerDetailModal');
    if (modalEl) {
      console.log('🎭 Modal açılıyor...');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } else {
      console.error('❌ customerDetailModal element bulunamadı!');
    }
  } catch (error) {
    console.error('❌ Müşteri detayları getirilemedi:', error);
    // Hata durumunda Tiger ERP'den alınan bilgileri göster
    showCustomerFromLookup(customer);
  }
}

// Tiger ERP'den alınan müşteri bilgilerini göster
function showCustomerFromLookup(customer) {
  console.log('🐅 showCustomerFromLookup çağrıldı, customer:', customer);
  
  // Readonly form alanlarını doldur
  document.getElementById('viewCustomerName').value = customer.customername || '';
  document.getElementById('viewCustomerCode').value = customer.customercode || '';
  document.getElementById('viewVknTc').value = customer.vkntc || '';
  document.getElementById('viewVergiDairesi').value = customer.taxoffice || '';
  document.getElementById('viewAdres').value = customer.address || '';
  document.getElementById('viewTelefon').value = customer.telephone || '';
  document.getElementById('viewEposta').value = customer.email || '';
  document.getElementById('viewCity').value = '';
  document.getElementById('viewOdemeTipi').value = '';
  
  console.log('📝 Tiger ERP bilgileri modal alanlarına dolduruldu');
  
  // Modal'ı aç
  const modalEl = document.getElementById('customerDetailModal');
  if (modalEl) {
    console.log('🎭 Tiger ERP modal açılıyor...');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  } else {
    console.error('❌ customerDetailModal element bulunamadı (Tiger ERP)!');
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
  // cityId için artık logicalref değil, city CODE kullanılacak
  const citySelect = document.getElementById("city");
  let cityId = "";
  if (citySelect) {
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    cityId = selectedOption && selectedOption.dataset.code ? selectedOption.dataset.code : "";
  }
  const userId = getQueryParam("userId") || "unknownUser";

  // Zorunlu alan kontrolü
  if (!customerName || !vknTc) {
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
    flowId: flowId,
    cityId: cityId ? cityId : ""
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
    input.value = `${customerData.customerName}`;
    input.dataset.code = customerData.customerCode || '';
    input.dataset.name = customerData.customerName;

    // Başarı mesajı göster
    showSuccess("Müşteri başarıyla eklendi!");

    // Modal'ı kapat
    const modal = bootstrap.Modal.getInstance(document.getElementById('newCustomerModal'));
    modal.hide();
  } catch (error) {
    console.error("❌ Cari eklenemedi:", error);
    showError("Cari eklenemedi. Lütfen tekrar deneyiniz.");
  }
}

// Şehir dropdown'ını doldur
export function loadCitiesDropdown(cities) {
  console.log('loadCitiesDropdown çağrıldı, cities:', cities);
  const citySelect = document.getElementById('city');
  console.log('citySelect element:', citySelect);
  
  if (citySelect && cities) {
    console.log('Cities array length:', cities.length);
    // Mevcut seçenekleri temizle (ilk seçenek hariç)
    citySelect.innerHTML = '<option value="">Şehir seçiniz...</option>';
    
    // Şehirleri alfabetik olarak sırala
    const sortedCities = cities.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    console.log('Sorted cities:', sortedCities);
    
    // Şehirleri dropdown'a ekle
    sortedCities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.logicalref;
      option.textContent = city.name;
      option.dataset.code = city.code;
      option.dataset.country = city.country;
      citySelect.appendChild(option);
    });
    
    console.log('Cities dropdown dolduruldu, toplam seçenek:', citySelect.options.length);
  } else {
    console.log('citySelect element bulunamadı veya cities verisi yok');
  }
}
