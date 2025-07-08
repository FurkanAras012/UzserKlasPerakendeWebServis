// Loading yönetimi modülü
export class LoadingManager {
  static showLoading(message = 'Veriler Yükleniyor...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      
      // Mesajı güncelle
      const messageElement = overlay.querySelector('h5');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
  }

  static hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.classList.add('hidden');
      // 300ms sonra display none yap (transition süresi)
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  }
}
