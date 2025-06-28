import { showError, showSuccess } from './ui.js';
const BASE = 'http://localhost:5186/api/v1';

export async function fetchCustomers() {
  try {
    const res = await fetch(`${BASE}/lookup/customers`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch {
    
    return [];
  }
}

export async function fetchProducts() {
  try {
    const res = await fetch(`${BASE}/lookup/stocks`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch {
   
    return [];
  }
}

export async function fetchVehicles() {
  try {
    const res = await fetch(`${BASE}/lookup/vehicles`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch {
  
    return [];
  }
}

export async function fetchSales(flowId) {
  const res = await fetch(`${BASE}/sales/${flowId}`);
  if (!res.ok) throw res;
  return res.json();
}

export async function saveMaster(master) {
  try {
    const res = await fetch(`${BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(master)
    });
    if (!res.ok) throw res;

    const result = await res.json();
    // ► Gizli masId input'unu API'den gelen ID ile dolduralım
    if (result.data?.id) {
      const masInput = document.getElementById('masId');
      if (masInput) masInput.value = result.data.id;
    }

    // ► Başarı mesajı
    showSuccess(master.id ? 'Üst bilgi güncellendi' : 'Üst bilgi kaydedildi');
    return result;
  } catch (e) {
    console.error(e);
    showError('Üst bilgi kaydedilemedi.');
    throw e;
  }
}

export async function saveLine(line) {
  try {
    const res = await fetch(`${BASE}/sales/line`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(line),
    });
    if (!res.ok) throw res;
    const wrapper = await res.json();
    // Başarı toast
    showSuccess('Ürün satırı kaydedildi');
    // Direkt olarak içindeki data objesini döndür
    return wrapper.data;
  } catch (e) {
    console.error('saveLine hatası:', e);
    showError('Ürün satırı kaydedilemedi.');
    throw e;
  }
}

export async function deleteLine(id, userId) {
  try {
    const res = await fetch(`${BASE}/sales/line/delete-line`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId })
    });
    if (!res.ok) throw res;
    showSuccess('Ürün satırı silindi');
  } catch (e) {
    console.error(e);
    showError('Ürün satırı silinemedi.');
    throw e;
  }
}