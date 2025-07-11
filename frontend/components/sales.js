import { getQueryParam, formatDateForInput } from '../services/helpers.js';
import { showError } from './ui.js';
import { fetchSales, saveMaster, generateOrderNumber, fetchSalesByFlowId } from '../services/api.js';
import { setMasterId, fetchSiparisTra, updateSummary } from './product.js';
import { updateSignatureBoxes } from './customer.js';

// Üst bilgiyi kaydet
export async function kaydetMas(customers, products, tigerUsers) {
 
  // Master ID (0 ise yeni kayıt)
  const masId = parseInt(document.getElementById('masId').value) || 0;

  // Diğer gerekli veriler
  const userId = getQueryParam('userId') || 'unknownUser';
  const flowId = parseInt(getQueryParam('flowId')) || 0;
  const customerCode = document.getElementById('customerSelection').dataset.code || '';
  const licensePlate = document.getElementById('vehicleSelection').dataset.plate || '';
  const customerName= document.getElementById('customerSelection').dataset.name || '';
   // Zorunlu alan kontrolleri
  if (!customerName || customerName.trim() === '') {
    showError('Müşteri seçimi zorunludur!');
    return;
  }
  if (!licensePlate || licensePlate.trim() === '') {
    showError('Araç plakası zorunludur!');
    return;
  }
  
  // Tarih alanlarını al ve formatla
  let orderDate = document.getElementById('siparisTarihi').value || null;
  let deliveryDate = document.getElementById('teslimTarihi').value || null;
  
  // Tarih formatını kontrol et ve gerekirse ISO formatına çevir
  if (orderDate) {
    const orderDateObj = new Date(orderDate);
    orderDate = orderDateObj.toISOString();
  }
  
  if (deliveryDate) {
    const deliveryDateObj = new Date(deliveryDate);
    deliveryDate = deliveryDateObj.toISOString();
  }
  
  const description = document.getElementById('aciklama1').value || '';
  const description2 = document.getElementById('aciklama2').value || '';
  const discountRate = parseFloat(document.getElementById('iskontoOrani').value) || 0;
  
  // Plasiyer ID'sini al (data attribute'tan)
  const plasiyerInput = document.getElementById('plasiyerInput');
  const salesManCode = plasiyerInput.dataset.plasiyerId || plasiyerInput.value; // ID varsa onu, yoksa adını gönder
  
  console.log('Tarih bilgileri:', {
    orderDate: orderDate,
    deliveryDate: deliveryDate,
    siparisTarihiValue: document.getElementById('siparisTarihi').value,
    teslimTarihiValue: document.getElementById('teslimTarihi').value
  });
  
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

  console.log('Master nesnesi gönderiliyor:', master);

  try {
    // API çağrısı
    const res = await saveMaster(master);
    
    console.log('saveMaster response:', res);
    console.log('Backend response data:', res.data);

    // Dönen ID değerini masterId'ye ata
    if (res && res.data && res.data.id) {
      const masterId = res.data.id;
      setMasterId(masterId);
      document.getElementById('masId').value = masterId;
      console.log('masterId set to:', masterId);
      
      // Kayıt başarılı olduktan sonra form alanlarını güncelle
      // Tarih alanlarını güncellenmiş değerlerle doldur
      const responseOrderDate = res.data.orderDate || orderDate;
      const responseDeliveryDate = res.data.deliveryDate || deliveryDate;
      
      if (responseOrderDate) {
        const formattedOrderDate = formatDateForInput(responseOrderDate);
        document.getElementById('siparisTarihi').value = formattedOrderDate;
        document.getElementById('headerTarih').value = formattedOrderDate;
        
        // Flatpickr instance'ını güncelle
        if (window.siparisTarihiPicker) {
          window.siparisTarihiPicker.setDate(formattedOrderDate);
        }
      }
      
      if (responseDeliveryDate) {
        const formattedDeliveryDate = formatDateForInput(responseDeliveryDate);
        document.getElementById('teslimTarihi').value = formattedDeliveryDate;
        
        // Flatpickr instance'ını güncelle
        if (window.teslimTarihiPicker) {
          window.teslimTarihiPicker.setDate(formattedDeliveryDate);
        }
      }
      
      // Diğer alanları da güncelle
      const responseDescription = res.data.description || description;
      const responseDescription2 = res.data.description2 || description2;
      const responseDiscountRate = res.data.discountRate !== undefined ? res.data.discountRate : discountRate;
      
      document.getElementById('aciklama1').value = responseDescription;
      document.getElementById('aciklama2').value = responseDescription2;
      document.getElementById('iskontoOrani').value = responseDiscountRate;
      
    } else {
      console.error('API response yapısı beklenmeyen:', res);
    }

    // Satırları yeniden yükle
    await fetchSiparisTra();

    // Özet bilgiyi güncelle
    updateSummary();

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

  // İmza kutucuklarını güncelle
  updateSignatureBoxes();

  // Vehicle input'u hem value hem dataset ile güncelle
  const plate = data.licensePlate || '';
  const vehInput = document.getElementById('vehicleSelection');
  vehInput.dataset.plate = plate;
  vehInput.value = plate;

  // Diğer alanlar
  const orderDate = data.orderDate ? formatDateForInput(data.orderDate) : '';
  const deliveryDate = data.deliveryDate ? formatDateForInput(data.deliveryDate) : '';
  
  console.log('Tarih değerleri:', { orderDate, deliveryDate });
  console.log('Flatpickr instances mevcut mu?', {
    siparisTarihiPicker: !!window.siparisTarihiPicker,
    teslimTarihiPicker: !!window.teslimTarihiPicker
  });
  
  document.getElementById('siparisTarihi').value = orderDate;
 // document.getElementById('headerTarih').value = orderDate;
  document.getElementById('teslimTarihi').value = deliveryDate;
  
  // Flatpickr instance'larını güncelle - birden fazla yöntem dene
  const updateDatePickers = () => {
    try {
      if (window.siparisTarihiPicker && orderDate) {
        // Farklı format denemeleri
        const dateObj = new Date(data.orderDate);
        window.siparisTarihiPicker.setDate(dateObj);
        console.log('Sipariş tarihi flatpickr güncellendi:', dateObj);
      } else {
        console.log('Sipariş tarihi flatpickr güncellenemedi:', {
          instance: !!window.siparisTarihiPicker,
          value: orderDate
        });
      }
      
      if (window.teslimTarihiPicker && deliveryDate) {
        // Farklı format denemeleri
        const dateObj = new Date(data.deliveryDate);
        window.teslimTarihiPicker.setDate(dateObj);
        console.log('Teslim tarihi flatpickr güncellendi:', dateObj);
      } else {
        console.log('Teslim tarihi flatpickr güncellenemedi:', {
          instance: !!window.teslimTarihiPicker,
          value: deliveryDate
        });
      }
    } catch (error) {
      console.error('Flatpickr güncelleme hatası:', error);
    }
  };
  
  // Hemen güncelle
  updateDatePickers();
  
  // Eğer başarısız olursa biraz bekleyip tekrar dene
  setTimeout(updateDatePickers, 100);
  setTimeout(updateDatePickers, 500);
  
  document.getElementById('aciklama1').value = data.description || '';
  document.getElementById('aciklama2').value = data.description2 || '';
  document.getElementById('iskontoOrani').value = data.discountRate || 0;

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
      console.log('loadExistingSales - data:', result.data);
      document.querySelector("button[onclick='kaydetMas()']").textContent = 'Güncelle';
      populateFormWithSalesData(result.data, customers, tigerUsers);
      await fetchSiparisTra();
      // Mevcut kayıt yüklendiğinde summary'yi güncelle
      updateSummary();
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
