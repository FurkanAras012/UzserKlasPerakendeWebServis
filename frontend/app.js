// Ana uygulama yöneticisi
import { getQueryParam } from './services/helpers.js';
import { setupDropdowns } from './components/dropdown.js';
import { LoadingManager } from './core/loading.js';
import { DateManager } from './core/dateManager.js';
import { DataManager } from './core/dataManager.js';
import { UserManager } from './core/userManager.js';
import { RecordManager } from './core/recordManager.js';
import { EventManager } from './core/eventManager.js';

// Floating labels için yardımcı fonksiyon
function initializeFloatingLabels() {
  console.log('🏷️ Floating labels kontrol ediliyor...');
  
  // Tüm floating input'ları bul
  const floatingInputs = document.querySelectorAll('.floating-input, .floating-textarea, .floating-select');
  
  floatingInputs.forEach(input => {
    // Eğer input'ta değer varsa, label'ı yukarı taşı
    if (input.value && input.value.trim() !== '') {
      input.setAttribute('data-has-value', 'true');
      console.log(`✅ Input ${input.id} değer var, label yukarı taşındı`);
    }
    
    // Input değişimini dinle
    input.addEventListener('input', function() {
      if (this.value && this.value.trim() !== '') {
        this.setAttribute('data-has-value', 'true');
      } else {
        this.removeAttribute('data-has-value');
      }
    });
    
    // Readonly ve disabled alanlar için özel kontrol
    if (input.hasAttribute('readonly') || input.hasAttribute('disabled')) {
      if (input.value && input.value.trim() !== '') {
        input.setAttribute('data-has-value', 'true');
        console.log(`✅ Readonly/Disabled input ${input.id} değer var`);
      }
    }
  });
}

export class AppManager {
  static async initialize() {
    try {
      // Loading göster
      LoadingManager.showLoading();
      
      const flowId = getQueryParam('flowId');
      const userId = getQueryParam('userId');

      // 1. Tarih seçicilerini başlat
      DateManager.initializeDatePickers();

      // 2. Verileri yükle
      const data = await DataManager.loadAllData();
      const { customers, products, vehicles, tigerUsers, cities } = data;

      // 3. Kayıt durumunu kontrol et
      const isNewRecord = await RecordManager.handleRecordState(flowId, customers, products, tigerUsers);

      // 4. UserId varsa plasiyeri getir
      if (userId) {
        await UserManager.loadPlasiyer(userId);
      }

      // 5. Dropdown'ları kur
      LoadingManager.showLoading('Arayüz Hazırlanıyor...');
      setupDropdowns(customers, products, vehicles, isNewRecord);

      // 6. Event handler'ları kur
      EventManager.setupEventHandlers(customers, products, tigerUsers);

      // 7. Floating labels'ları başlat
      initializeFloatingLabels();

      // 8. Global değişkenleri set et
      this.setGlobalVariables(cities);
      
      // Loading gizle
      LoadingManager.hideLoading();
      
    } catch (error) {
      console.error('Uygulama başlatma hatası:', error);
      LoadingManager.hideLoading();
      // Hata durumunda da sayfayı göster
    }
  }

  static setGlobalVariables(cities) {
    // Cities'i global değişken olarak ekle
    window.cities = cities;

    // Flatpickr instance'larını global yap (DateManager'dan alınabilir)
    window.siparisTarihiPicker = DateManager.getSiparisTarihiPicker();
    window.teslimTarihiPicker = DateManager.getTeslimTarihiPicker();
  }
}

// Global floating label yeniden kontrol fonksiyonu
window.updateFloatingLabels = function() {
  initializeFloatingLabels();
};

// DOM yüklendiğinde AppManager'ı başlat
document.addEventListener('DOMContentLoaded', () => {
  AppManager.initialize();
});
