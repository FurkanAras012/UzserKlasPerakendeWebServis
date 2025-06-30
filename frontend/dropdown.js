import { populateDropdown } from './ui.js';
import { selectCustomer } from './customer.js';
import { selectVehicle } from './vehicle.js';
import { selectProduct } from './product.js';

// Dropdown event listener'larını kurma
export function setupDropdowns(customers, products, vehicles) {
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

  // Dropdown'ları dışına tıklandığında kapat
  document.addEventListener('click', (e) => {
    ['customer', 'vehicle', 'product'].forEach(type => {
      const inputId = `${type}Selection`;
      const dropdownId = `${type}Dropdown`;
      const inputEl = document.getElementById(inputId);
      const ddEl = document.getElementById(dropdownId);

      if (!inputEl || !ddEl) return;

      if (!inputEl.contains(e.target) && !ddEl.contains(e.target)) {
        ddEl.style.display = 'none';
      }
    });
  });
}
