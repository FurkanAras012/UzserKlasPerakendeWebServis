// Kayıt yönetimi modülü
import { fetchSalesByFlowId } from '../services/api.js';
import { loadExistingSales, handleNewRecord } from '../components/sales.js';
import { LoadingManager } from './loading.js';

export class RecordManager {
  static async handleRecordState(flowId, customers, products, tigerUsers) {
    let isNewRecord = true; // Default olarak yeni kayıt varsay
    
    if (flowId) {
      try {
        console.log('FlowId mevcut, kayıt kontrolü yapılıyor:', flowId);
        LoadingManager.showLoading('Mevcut Kayıt Kontrol Ediliyor...');
        const result = await fetchSalesByFlowId(flowId);
        
        // API'den kayıt döndü mü kontrol et
        if (result && result.success && result.data && result.data.id > 0) {
          console.log('Mevcut kayıt bulundu, form doldurulacak');
          isNewRecord = false;
          // Mevcut kayıt bulundu, formu doldur
          LoadingManager.showLoading('Form Verileri Yükleniyor...');
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
      LoadingManager.showLoading('Yeni Kayıt Hazırlanıyor...');
      await handleNewRecord();
    }

    return isNewRecord;
  }
}
