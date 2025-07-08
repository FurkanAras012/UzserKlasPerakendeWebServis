// Kullanıcı yönetimi modülü
import { getUserMappingByFlowUserId } from '../services/api.js';
import { updateSignatureBoxes } from '../components/customer.js';
import { LoadingManager } from './loading.js';

export class UserManager {
  static async loadPlasiyer(userId) {
    try {
      console.log('UserId ile plasiyer getiriliyor:', userId);
      LoadingManager.showLoading('Plasiyer Bilgileri Yükleniyor...');
      
      const userMapping = await getUserMappingByFlowUserId(userId);
      
      if (userMapping && userMapping.tigerUserName) {
        const plasiyerInput = document.getElementById('plasiyerInput');
        plasiyerInput.value = userMapping.tigerUserName;
        // Plasiyer ID'sini data attribute olarak sakla
        plasiyerInput.dataset.plasiyerId = userMapping.tigerUserId;
        console.log('Plasiyer yüklendi:', userMapping.tigerUserName, 'ID:', userMapping.tigerUserId);
        
        // İmza kutucuklarını güncelle
        updateSignatureBoxes();
      } else {
        console.log('Bu kullanıcı için plasiyer eşleştirmesi bulunamadı');
        document.getElementById('plasiyerInput').value = 'Plasiyer eşleştirmesi bulunamadı';
      }
    } catch (error) {
      console.error('Plasiyer yükleme hatası:', error);
      document.getElementById('plasiyerInput').value = 'Plasiyer yüklenemedi';
    }
  }
}
