import { showError } from './ui.js';
import { fetchVehicles } from './api.js';
import { API_CONFIG } from './config.js';

// Araç seçim fonksiyonu
export function selectVehicle(vehicle) {
  const input = document.getElementById('vehicleSelection');
  input.value = `${vehicle.vehiclePlate} - ${vehicle.chassisNumber}`;
  input.dataset.plate = vehicle.vehiclePlate;
  input.dataset.chassis = vehicle.chassisNumber;
  document.getElementById('vehicleDropdown').style.display = 'none';
}

// Araç detaylarını görüntüleme modalını açma
export async function openVehicleDetailModal(vehicle) {
  console.log('🚗 openVehicleDetailModal çağrıldı, vehicle:', vehicle);
  
  try {
    const vehicleId = vehicle.id;
    console.log('📋 Vehicle ID:', vehicleId);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/vehicles/${vehicleId}`);
    const result = await response.json();
    
    console.log('🌐 API response:', result);
    
    if (!result.success || !result.data) {
      console.log('⚠️ Araç detayları getirilemedi');
      showError('Araç detayları getirilemedi.');
      return;
    }
    
    const vehicleData = result.data;
    console.log('✅ Araç verisi alındı:', vehicleData);
    
    // Readonly form alanlarını doldur
    document.getElementById('viewVehiclePlate').value = vehicleData.vehiclePlate || '';
    document.getElementById('viewVehicleChassis').value = vehicleData.chassisNumber || '';
    document.getElementById('viewVehicleEngine').value = vehicleData.engineNumber || '';
    document.getElementById('viewVehicleBrand').value = vehicleData.brand || '';
    document.getElementById('viewVehicleModel').value = vehicleData.model || '';
    document.getElementById('viewVehicleYear').value = vehicleData.modelYear || '';
    document.getElementById('viewVehicleFuelType').value = vehicleData.fuelType || '';
    document.getElementById('viewVehiclePower').value = vehicleData.enginePower || '';
    document.getElementById('viewVehicleKm').value = vehicleData.kilometer || '';
    document.getElementById('viewVehicleTireDepth').value = vehicleData.tireTreadDepth || '';
    document.getElementById('viewVehicleBatteryStatus').value = vehicleData.batteryStatus || '';
    
    console.log('📝 Modal alanları dolduruldu');
    
    // Modal'ı aç
    const modalEl = document.getElementById('vehicleDetailModal');
    if (modalEl) {
      console.log('🎭 Vehicle modal açılıyor...');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } else {
      console.error('❌ vehicleDetailModal element bulunamadı!');
    }
  } catch (error) {
    console.error('❌ Araç detayları getirilemedi:', error);
    showError('Araç detayları getirilemedi.');
  }
}

// Yeni araç modal açma - formu temizle
export function openNewVehicleModal() {
  // Formu temizle
  document.getElementById('newVehiclePlate').value = '';
  document.getElementById('newVehicleChassis').value = '';
  document.getElementById('newVehicleEngine').value = '';
  document.getElementById('newVehicleBrand').value = '';
  document.getElementById('newVehicleModel').value = '';
  document.getElementById('newVehicleYear').value = '';
  document.getElementById('newVehicleFuelType').value = '';
  document.getElementById('newVehiclePower').value = '';
  document.getElementById('newVehicleKm').value = '';
  document.getElementById('newVehicleTireDepth').value = '';
  document.getElementById('newVehicleBatteryStatus').value = '';
  
  const modalEl = document.getElementById('newVehicleModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// Yeni araç kaydetme
export async function saveNewVehicle() {
  const vehicleData = {
    id: 0,
    createUser: "currentUser",
    updateUser: "currentUser",
    wfState: 0,
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/vehicles`, {
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
