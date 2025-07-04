import { getQueryParam } from './helpers.js';
import { fetchCustomers, fetchProducts, fetchVehicles, fetchSalesByFlowId, getUserMappingByFlowUserId, fetchTigerUsers, fetchCities } from './api.js';
import { toggleOrderInfo, handleEnter } from './ui.js';
import { setupDropdowns } from './dropdown.js';
import { kaydetMas, loadExistingSales, handleNewRecord, generateProforma, createOrder } from './sales.js';
import { addProduct, resetProductForm, removeProductHandler, editProduct, updateProduct } from './product.js';
import { openNewCustomerModal, saveNewCustomer, loadCitiesDropdown, openCustomerDetailModal } from './customer.js';
import { openNewVehicleModal, saveNewVehicle, openVehicleDetailModal } from './vehicle.js';

// Global değişkenler
let customers = [], products = [], vehicles = [], tigerUsers = [], cities = [];

// Loading yönetimi
function showLoading(message = 'Veriler Yükleniyor...') {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    
    // Mesajı güncelle
    const messageElement = overlay.querySelector('h5');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    // 300ms sonra display none yap (transition süresi)
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
}

// Plasiyer yükleme fonksiyonu
async function loadPlasiyer(userId) {
  try {
    console.log('UserId ile plasiyer getiriliyor:', userId);
    const userMapping = await getUserMappingByFlowUserId(userId);
    
    if (userMapping && userMapping.tigerUserName) {
      const plasiyerInput = document.getElementById('plasiyerInput');
      plasiyerInput.value = userMapping.tigerUserName;
      // Plasiyer ID'sini data attribute olarak sakla
      plasiyerInput.dataset.plasiyerId = userMapping.tigerUserId;
      console.log('Plasiyer yüklendi:', userMapping.tigerUserName, 'ID:', userMapping.tigerUserId);
    } else {
      console.log('Bu kullanıcı için plasiyer eşleştirmesi bulunamadı');
      document.getElementById('plasiyerInput').value = 'Plasiyer eşleştirmesi bulunamadı';
    }
  } catch (error) {
    console.error('Plasiyer yükleme hatası:', error);
    document.getElementById('plasiyerInput').value = 'Plasiyer yüklenemedi';
  }
}

// Uygulama başlangıcı
async function initApp() {
  try {
    // Loading göster
    showLoading();
    
    const flowId = getQueryParam('flowId');
    const userId = getQueryParam('userId');

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

    // Lookup verileri paralel olarak yükle
    console.log('Veriler yükleniyor...');
    showLoading('Müşteri ve Ürün Verileri Yükleniyor...');
    
    const [customersData, productsData, vehiclesData, tigerUsersData, citiesData] = await Promise.all([
      fetchCustomers(),
      fetchProducts(),
      fetchVehicles(),
      fetchTigerUsers(),
      fetchCities()
    ]);
    
    customers = customersData;
    products = productsData;
    vehicles = vehiclesData;
    tigerUsers = tigerUsersData;
    cities = citiesData;
    
    console.log('Tüm veriler yüklendi:', {
      customers: customers.length,
      products: products.length, 
      vehicles: vehicles.length,
      tigerUsers: tigerUsers.length,
      cities: cities.length
    });

    // Cities dropdown'ını yükle
    loadCitiesDropdown(cities);

  // FlowId ile kayıt kontrolü yap - FlowId varsa API'ye sor
  let isNewRecord = true; // Default olarak yeni kayıt varsay
  
  if (flowId) {
    try {
      console.log('FlowId mevcut, kayıt kontrolü yapılıyor:', flowId);
      showLoading('Mevcut Kayıt Kontrol Ediliyor...');
      const result = await fetchSalesByFlowId(flowId);
      
      // API'den kayıt döndü mü kontrol et
      if (result && result.success && result.data && result.data.id > 0) {
        console.log('Mevcut kayıt bulundu, form doldurulacak');
        isNewRecord = false;
        // Mevcut kayıt bulundu, formu doldur
        showLoading('Form Verileri Yükleniyor...');
        await loadExistingSales(flowId, customers, products, tigerUsers);
      } else {
        console.log('FlowId ile API çağrısı başarılı ama kayıt yok - yeni kayıt');
        isNewRecord = true;
      }
    } catch (error) {
      console.log('FlowId ile API hatası - yeni kayıt:', error);
      isNewRecord = true;
    }
  } else {
    console.log('FlowId yok - yeni kayıt');
    isNewRecord = true;
  }

  // Sonuca göre işlem yap
  if (isNewRecord) {
    console.log('Yeni kayıt moduna geçiliyor');
    showLoading('Yeni Kayıt Hazırlanıyor...');
    await handleNewRecord();
  }

  // UserId varsa plasiyeri getir (handleNewRecord'dan sonra)
  if (userId) {
    showLoading('Plasiyer Bilgileri Yükleniyor...');
    await loadPlasiyer(userId);
  }

  // Dropdown'ları kur (isNewRecord belirlendikten sonra)
  showLoading('Arayüz Hazırlanıyor...');
  setupDropdowns(customers, products, vehicles, isNewRecord);

    // Buton ve klavye event'leri
    document.getElementById('toggleOrderInfo').onclick = toggleOrderInfo;
    document.getElementById('productQuantity').onkeypress = e => handleEnter(e, addProduct);
    
    // Loading gizle
    hideLoading();
    
  } catch (error) {
    console.error('Uygulama başlatma hatası:', error);
    hideLoading();
    // Hata durumunda da sayfayı göster
  }
}

// Global fonksiyonları window'a ekle
window.createOrder = createOrder;
window.openNewCustomerModal = openNewCustomerModal;
window.openNewVehicleModal = openNewVehicleModal;
window.saveNewCustomer = saveNewCustomer;
window.saveNewVehicle = saveNewVehicle;

// Sipariş üst bilgi ve kalem işlemleri
window.kaydetMas = () => kaydetMas(customers, products, tigerUsers);
window.addProduct = addProduct;
window.removeProductHandler = removeProductHandler;
window.editProduct = editProduct;
window.updateProduct = updateProduct;
window.resetProductForm = resetProductForm;

// Proforma ve sipariş oluşturma
window.generateProforma = generateProforma;

// Lookup fonksiyonları
window.fetchCustomers = fetchCustomers;
window.fetchProducts = fetchProducts;
window.fetchVehicles = fetchVehicles;

// Detay görüntüleme fonksiyonları
window.openCustomerDetailModal = openCustomerDetailModal;
window.openVehicleDetailModal = openVehicleDetailModal;

// Cities'i global değişken olarak ekle
window.cities = cities;

// Uygulama başlat
window.addEventListener('DOMContentLoaded', initApp);
