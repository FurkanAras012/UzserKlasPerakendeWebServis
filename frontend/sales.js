import { getQueryParam, formatDateForInput } from './helpers.js';
import { showError } from './ui.js';
import { fetchSales, saveMaster, generateOrderNumber, fetchSalesByFlowId } from './api.js';
import { setMasterId, fetchSiparisTra } from './product.js';

// Üst bilgiyi kaydet
export async function kaydetMas(customers, products, tigerUsers) {
  // Master ID (0 ise yeni kayıt)
  const masId = parseInt(document.getElementById('masId').value) || 0;

  // Diğer gerekli veriler
  const userId = getQueryParam('userId') || 'unknownUser';
  const flowId = parseInt(getQueryParam('flowId')) || 0;
  const customerCode = document.getElementById('customerSelection').dataset.code || '';
  const licensePlate = document.getElementById('vehicleSelection').dataset.plate || '';
  const orderDate = document.getElementById('siparisTarihi').value || null;
  const deliveryDate = document.getElementById('teslimTarihi').value || null;
  const description = document.getElementById('aciklama1').value || '';
  const description2 = document.getElementById('aciklama2').value || '';
  const discountRate = parseFloat(document.getElementById('iskontoOrani').value) || 0;
  
  // Plasiyer ID'sini al (data attribute'tan)
  const plasiyerInput = document.getElementById('plasiyerInput');
  const salesManCode = plasiyerInput.dataset.plasiyerId || plasiyerInput.value; // ID varsa onu, yoksa adını gönder
  
  console.log('Plasiyer bilgileri:', {
    plasiyerId: plasiyerInput.dataset.plasiyerId,
    plasiyerValue: plasiyerInput.value,
    salesManCode: salesManCode
  });
  
  // Sipariş numarası - input'tan al (zaten sayfa açılırken oluşturulmuş)
  const orderNumber = document.getElementById('orderCodeHeader').value || document.getElementById('orderCodeHeader').placeholder;

  // Master nesnesi
  const master = {
    id: masId,
    userId: userId,
    wfState: 0,
    flowId: flowId,
    customerCode: customerCode,
    licensePlate: licensePlate,
    orderDate: orderDate,
    deliveryDate: deliveryDate,
    description: description,
    description2: description2,
    discountRate: discountRate,
    orderNumber: orderNumber,
    salesManCode: salesManCode
  };

  try {
    // API çağrısı
    const res = await saveMaster(master);
    
    console.log('saveMaster response:', res);

    // Dönen ID değerini masterId'ye ata
    if (res && res.data && res.data.id) {
      const masterId = res.data.id;
      setMasterId(masterId);
      document.getElementById('masId').value = masterId;
      console.log('masterId set to:', masterId);
    } else {
      console.error('API response yapısı beklenmeyen:', res);
    }

    // Satırları yeniden yükle
    await fetchSiparisTra(products);

    // UI güncelle
    document.getElementById('siparisiOlusturButton').classList.remove('d-none');
    document.getElementById('productSelectionCard').style.display = 'block';
    
  } catch (e) {
    console.error('Üst bilgi kaydedilemedi', e);
    showError('Üst bilgi kaydedilemedi. Lütfen tekrar deneyiniz.');
  }
}

// Form verilerini doldur
export function populateFormWithSalesData(data, customers, tigerUsers = []) {
  // Master ID'yi al ve formu güncelle
  document.getElementById('masId').value = data.id || '';
  const masterId = data.id || 0;
  setMasterId(masterId);

  // CustomerCode'i al ve rehberde eşleşen isim için ara
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

  // Eğer salesManCode bir ID ise, bunu plasiyer adına çevir
  if (data.salesManCode && tigerUsers && tigerUsers.length > 0) {
    const tigerUser = tigerUsers.find(tu => tu.userId === data.salesManCode);
    if (tigerUser) {
      plasiyerInput.value = tigerUser.userName;
      plasiyerInput.dataset.plasiyerId = tigerUser.userId;
    }
  }

  // Customer input'unu hem value hem dataset ile güncelle
  const custInput = document.getElementById('customerSelection');
  custInput.dataset.code = custCode;
  custInput.dataset.name = custName;
  // Müşteri kodu varsa "KOD - AD" formatında, yoksa sadece müşteri adını göster
  if (custCode && custName) {
    custInput.value = `${custCode} - ${custName}`;
  } else if (custName) {
    custInput.value = custName;
  } else {
    custInput.value = '';
  }

  // Vehicle input'u hem value hem dataset ile güncelle
  const plate = data.licensePlate || '';
  const vehInput = document.getElementById('vehicleSelection');
  vehInput.dataset.plate = plate;
  vehInput.value = plate;

  // Diğer alanlar
  document.getElementById('siparisTarihi').value = data.orderDate ? formatDateForInput(data.orderDate) : '';
  document.getElementById('teslimTarihi').value = data.deliveryDate ? formatDateForInput(data.deliveryDate) : '';
  document.getElementById('aciklama1').value = data.description || '';
  document.getElementById('aciklama2').value = data.description2 || '';

  // MasId ve buton metni
  document.getElementById('masId').value = data.id || '';
  const saveBtn = document.querySelector("button[onclick='kaydetMas()']");
  if (saveBtn) saveBtn.textContent = 'Güncelle';

  // Sipariş kodu placeholder
  document.getElementById('orderCodeHeader').placeholder = data.orderNumber || '';
}

// Mevcut kayıt yükleme
export async function loadExistingSales(flowId, customers, products, tigerUsers = []) {
  try {
    const result = await fetchSalesByFlowId(flowId);
    
    // Null check'leri ekle
    if (result && result.success && result.data && result.data.id && result.data.id > 0) {
      const masterId = result.data.id;
      document.getElementById('masId').value = masterId;
      setMasterId(masterId); // masterId'yi set et
      console.log('loadExistingSales - masterId set to:', masterId);
      document.querySelector("button[onclick='kaydetMas()']").textContent = 'Güncelle';
      populateFormWithSalesData(result.data, customers, tigerUsers);
      await fetchSiparisTra(products);
      document.getElementById('productSelectionCard').style.display = 'block';
      document.getElementById('siparisiOlusturButton').classList.remove('d-none');
      console.log('Mevcut kayıt başarıyla yüklendi, sipariş no:', result.data.orderNumber);
    } else {
      console.log('loadExistingSales - Kayıt bulunamadı veya data null:', result);
      throw new Error('Kayıt bulunamadı');
    }
  } catch (error) {
    console.error('loadExistingSales hatası:', error);
    throw error; // Hatayı üst seviyeye fırlat
  }
}

// Yeni kayıt durumu
export async function handleNewRecord() {
  document.getElementById('productSelectionCard').style.display = 'none';
  document.getElementById('siparisiOlusturButton').classList.add('d-none');
  
  // Master ID'yi sıfırla
  document.getElementById('masId').value = '0';
  
  // Plasiyeri koru (zaten yüklenmişse sıfırlama)
  const plasiyerInput = document.getElementById('plasiyerInput');
  const currentPlasiyer = plasiyerInput ? plasiyerInput.value : '';
  
  // Kaydet butonunun metnini güncelle
  const saveBtn = document.querySelector("button[onclick='kaydetMas()']");
  if (saveBtn) saveBtn.textContent = 'Kaydet';
  
  // Yeni kayıt için otomatik sipariş numarası oluştur (sadece input boşsa)
  const orderInput = document.getElementById('orderCodeHeader');
  if (orderInput && (!orderInput.value || orderInput.value.trim() === '')) {
    try {
      const userId = getQueryParam('userId') || 'unknownUser';
      const orderResponse = await generateOrderNumber('SIP', userId);
      
      if (orderResponse && orderResponse.data && orderResponse.data.orderNumber) {
        orderInput.value = orderResponse.data.orderNumber;
        orderInput.placeholder = orderResponse.data.orderNumber;
        console.log('Yeni kayıt için otomatik sipariş numarası oluşturuldu:', orderResponse.data.orderNumber);
      } else {
        orderInput.placeholder = 'Sipariş numarası oluşturulamadı';
      }
    } catch (e) {
      console.error('Sipariş numarası oluşturulamadı:', e);
      orderInput.placeholder = 'Manuel sipariş numarası girin';
    }
  } else if (orderInput && orderInput.value) {
    console.log('Sipariş numarası zaten mevcut:', orderInput.value);
  }
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
  doc.setFont('helvetica','normal'); 
  doc.setFontSize(12);
}

// Sipariş oluştur
export async function createOrder() {
  try {
    showSuccess('Sipariş başarıyla oluşturuldu');
  } catch (e) {
    console.error('siparisiOlustur hata:', e);
    showError('Sipariş oluşturulamadı, lütfen tekrar deneyiniz.');
  }
}
