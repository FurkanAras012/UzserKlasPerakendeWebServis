import { showError, showSuccess } from '../components/ui.js';
import { API_CONFIG, getApiUrl } from '../config.js';

const BASE = API_CONFIG.BASE_URL;

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

export async function fetchTigerUsers() {
  try {
    const res = await fetch(`${BASE}/usermapping/tigerusers`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch {
    console.error('Tiger users getirilemedi');
    return [];
  }
}

export async function fetchCities() {
  try {
    console.log('fetchCities çağrıldı, URL:', `${BASE}/lookup/cities`);
    const res = await fetch(`${BASE}/lookup/cities`);
    console.log('fetchCities response status:', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('fetchCities response data:', data);
    const result = Array.isArray(data) ? data : data.data || [];
    console.log('fetchCities final result:', result);
    return result;
  } catch (error) {
    console.error('Cities getirilemedi, hata:', error);
    return [];
  }
}

export async function fetchSales(flowId) {
  const res = await fetch(`${BASE}/sales/${flowId}`);
  if (!res.ok) throw res;
  return res.json();
}

export async function fetchSalesByFlowId(flowId) {
  const res = await fetch(`${BASE}/sales/flow/${flowId}`);
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
    
    // Mesajı burada göstermek yerine frontend'e bırakıyoruz
    // showSuccess('Ürün satırı kaydedildi');
    
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

export async function getUserMappingByFlowUserId(flowUserId) {
  try {
    const res = await fetch(`${BASE}/usermapping/byflowuser/${flowUserId}`);
    if (!res.ok) {
      if (res.status === 404) {
        // Eşleştirme bulunamadı, null döndür
        return null;
      }
      throw res;
    }
    const data = await res.json();
    return data.data || null; // ResponseWrapper'dan data'yı çıkar
  } catch (e) {
    console.error('Kullanıcı eşleştirmesi getirilemedi:', e);
    return null;
  }
}

export async function generateOrderNumber(seriesCode = 'SIP', userId = null) {
  try {
    const res = await fetch(`${BASE}/orderseries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        seriesCode: seriesCode,
        userId: userId
      })
    });
    if (!res.ok) throw res;
    return await res.json();
  } catch (e) {
    console.error('Sipariş numarası oluşturulamadı:', e);
    showError('Sipariş numarası oluşturulamadı.');
    throw e;
  }
}