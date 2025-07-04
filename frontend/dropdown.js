import { populateDropdown } from './ui.js';
import { selectCustomer, openCustomerDetailModal } from './customer.js';
import { selectVehicle, openVehicleDetailModal } from './vehicle.js';
import { selectProduct } from './product.js';

// Dropdown state yönetimi
let dropdownStates = {
  customer: { isOpen: false, hideTimeout: null },
  vehicle: { isOpen: false, hideTimeout: null },
  product: { isOpen: false, hideTimeout: null }
};

// Dropdown'ı güvenli bir şekilde göster
function showDropdown(type, dropdownId) {
  const state = dropdownStates[type];
  if (state.hideTimeout) {
    clearTimeout(state.hideTimeout);
    state.hideTimeout = null;
  }

  const dd = document.getElementById(dropdownId);
  if (dd) {
    state.isOpen = true;
    dd.style.display = 'block';
    dd.style.visibility = 'visible';
    dd.style.opacity = '1';
    dd.style.pointerEvents = 'auto';
    console.log(`📋 ${type} dropdown gösterildi`);
  }
}

// Dropdown'ı güvenli bir şekilde gizle
function hideDropdown(type, dropdownId, delay = 150) {
  const state = dropdownStates[type];

  if (state.hideTimeout) {
    clearTimeout(state.hideTimeout);
  }

  state.hideTimeout = setTimeout(() => {
    const dd = document.getElementById(dropdownId);
    if (dd && state.isOpen) {
      state.isOpen = false;
      dd.style.display = 'none';
      dd.style.visibility = 'hidden';
      dd.style.opacity = '0';
      dd.style.pointerEvents = 'none';
      console.log(`📋 ${type} rehber dropdown kapatıldı`);
    }
  }, delay);
}

// Dropdown event listener'larını kurma
export function setupDropdowns(customers, products, vehicles, isNewRecord = true) {
  // Dropdown içinde yapılan tıklamaları ve basılı tutmaları global olaydan koru
  ['customerSelection','customerDropdown','vehicleSelection','vehicleDropdown','productSelection','productDropdown']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', e => e.stopPropagation());
      el.addEventListener('mousedown', e => e.stopPropagation());
    });

  // Müşteri rehberi
  const custInput = document.getElementById('customerSelection');
  
  custInput.addEventListener('focus', (e) => {
    console.log('🎯 Müşteri input focus, isNewRecord:', isNewRecord);
    
    let customersToShow;
    if (isNewRecord) {
      // Yeni kayıt ise tüm müşterileri göster (ilk 20)
      customersToShow = customers.slice(0, 20);
    } else {
      // Mevcut kayıt ise sadece seçili müşteriyi göster
      const selectedCode = custInput.dataset.code;
      if (selectedCode) {
        customersToShow = customers.filter(c => c.customercode === selectedCode);
      } else {
        customersToShow = customers.slice(0, 20);
      }
    }
    
    populateDropdown(customersToShow, 'customerDropdown',
      c => c.customercode ? `${c.customercode} - ${c.customername}` : c.customername, 
      selectCustomer, 
      (customer) => openCustomerDetailModal(customer));
    showDropdown('customer', 'customerDropdown');
  });
  
  // Blur event'i kaldırıldı - dropdown'ları açık tutmak için
  
  custInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    if (term.length < 2) {
      let customersToShow;
      if (isNewRecord) {
        // Yeni kayıt ise tüm müşterileri göster (ilk 20)
        customersToShow = customers.slice(0, 20);
      } else {
        // Mevcut kayıt ise sadece seçili müşteriyi göster
        const selectedCode = custInput.dataset.code;
        if (selectedCode) {
          customersToShow = customers.filter(c => c.customercode === selectedCode);
        } else {
          customersToShow = customers.slice(0, 20);
        }
      }
      populateDropdown(customersToShow, 'customerDropdown',
        c => c.customercode ? `${c.customercode} - ${c.customername}` : c.customername, 
        selectCustomer, 
        (customer) => openCustomerDetailModal(customer));
      showDropdown('customer', 'customerDropdown');
      return;
    }
    
    const filtered = customers.filter(c =>
      (c.customercode || '').toLowerCase().includes(term) ||
      (c.customername || '').toLowerCase().includes(term)
    ).slice(0, 25);
    
    populateDropdown(filtered, 'customerDropdown',
      c => c.customercode ? `${c.customercode} - ${c.customername}` : c.customername, 
      selectCustomer, 
      (customer) => openCustomerDetailModal(customer));
      
    if (filtered.length) {
      showDropdown('customer', 'customerDropdown');
    } else {
      // Sonuç yoksa dropdown'ı gizleme, boş bırak
      populateDropdown([], 'customerDropdown', c => '', selectCustomer, (customer) => openCustomerDetailModal(customer));
      showDropdown('customer', 'customerDropdown');
    }
  });

  // Araç rehberi
  const vehInput = document.getElementById('vehicleSelection');
  
  vehInput.addEventListener('focus', (e) => {
    console.log('🎯 Araç input focus');
    const limitedVehicles = vehicles.slice(0, 20);
    populateDropdown(limitedVehicles, 'vehicleDropdown',
      v => `${v.vehiclePlate} - ${v.chassisNumber}`, 
      selectVehicle, 
      (vehicle) => openVehicleDetailModal(vehicle));
    showDropdown('vehicle', 'vehicleDropdown');
  });
  
  // Blur event'i kaldırıldı - dropdown'ları açık tutmak için
  
  vehInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    if (term.length < 2) {
      const limitedVehicles = vehicles.slice(0, 20);
      populateDropdown(limitedVehicles, 'vehicleDropdown',
        v => `${v.vehiclePlate} - ${v.chassisNumber}`, 
        selectVehicle, 
        (vehicle) => openVehicleDetailModal(vehicle));
      showDropdown('vehicle', 'vehicleDropdown');
      return;
    }
    
    const filtered = vehicles.filter(v =>
      (v.vehiclePlate || '').toLowerCase().includes(term) ||
      (v.chassisNumber || '').toLowerCase().includes(term)
    ).slice(0, 25);
    
    populateDropdown(filtered, 'vehicleDropdown',
      v => `${v.vehiclePlate} - ${v.chassisNumber}`, 
      selectVehicle, 
      (vehicle) => openVehicleDetailModal(vehicle));
      
    if (filtered.length) {
      showDropdown('vehicle', 'vehicleDropdown');
    } else {
      // Sonuç yoksa dropdown'ı gizleme, boş bırak
      populateDropdown([], 'vehicleDropdown', v => '', selectVehicle, (vehicle) => openVehicleDetailModal(vehicle));
      showDropdown('vehicle', 'vehicleDropdown');
    }
  });

  // Ürün rehberi
  const prodInput = document.getElementById('productSelection');
  
  prodInput.addEventListener('focus', (e) => {
    console.log('🎯 Ürün input focus');
    const limitedProducts = products.slice(0, 20);
    populateDropdown(limitedProducts, 'productDropdown',
      p => `${p.stockCode || p.code || ''} - ${p.stockName || p.name || ''}`, selectProduct);
    showDropdown('product', 'productDropdown');
  });
  
  // Blur event'i kaldırıldı - dropdown'ları açık tutmak için
  
  prodInput.addEventListener('input', e => {
    const term = (e.target.value || '').toLowerCase();
    if (term.length < 2) {
      const limitedProducts = products.slice(0, 20);
      populateDropdown(limitedProducts, 'productDropdown',
        p => `${p.stockCode || p.code || ''} - ${p.stockName || p.name || ''}`, selectProduct);
      showDropdown('product', 'productDropdown');
      return;
    }
    
    const filtered = products.filter(p =>
      (p.stockCode || p.code || '').toLowerCase().includes(term) ||
      (p.stockName || p.name || '').toLowerCase().includes(term)
    ).slice(0, 25);
    
    populateDropdown(filtered, 'productDropdown',
      p => `${p.stockCode || p.code || ''} - ${p.stockName || p.name || ''}`, selectProduct);
      
    if (filtered.length) {
      showDropdown('product', 'productDropdown');
    } else {
      // Sonuç yoksa dropdown'ı gizleme, boş bırak
      populateDropdown([], 'productDropdown', p => '', selectProduct);
      showDropdown('product', 'productDropdown');
    }
  });

  // Dropdown click event'leri kaldırıldı - dropdown'ları açık tutmak için

  // Global mousedown event - sadece boş alana tıklanırsa rehber dropdown'ları kapat
  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('#customerSelection, #customerDropdown, #vehicleSelection, #vehicleDropdown, #productSelection, #productDropdown')) {
      return;
    }
    hideDropdown('customer', 'customerDropdown', 0);
    hideDropdown('vehicle', 'vehicleDropdown', 0);
    hideDropdown('product', 'productDropdown', 0);
  });
}
