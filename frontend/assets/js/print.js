// PDF Export ve Print İşlemleri - print.js

// PDF Export fonksiyonu
function exportToPDF() {
  // Dropdown'ları kapat
  document.getElementById('customerDropdown').style.display = 'none';
  document.getElementById('vehicleDropdown').style.display = 'none';
  document.getElementById('productDropdown').style.display = 'none';
  
  // Summary alanını kesinlikle göster
  const summarySection = document.getElementById('summarySection');
  if (summarySection) {
    summarySection.style.display = 'block';
    summarySection.style.visibility = 'visible';
    summarySection.style.opacity = '1';
    console.log('Summary alanı PDF için hazırlandı');
  }
  
  // Yazdırma dialog'unu aç
  window.print();
}

// Print öncesi/sonrası event'lar
window.addEventListener('beforeprint', function() {
  console.log('Sipariş formu yazdırılıyor...');
  
  // Sayfa başlığını geçici olarak temizle
  document.title = '';
  
  // Dropdown'ları kesin kapat
  const dropdowns = ['customerDropdown', 'vehicleDropdown', 'productDropdown'];
  dropdowns.forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.style.display = 'none';
      dropdown.style.visibility = 'hidden';
    }
  });
  
  // Summary alanını print sırasında kesinlikle göster
  const summarySection = document.getElementById('summarySection');
  if (summarySection) {
    summarySection.style.display = 'block !important';
    summarySection.style.visibility = 'visible !important';
    summarySection.style.opacity = '1 !important';
    console.log('Summary alanı print sırasında görünür yapıldı');
  }
});

window.addEventListener('afterprint', function() {
  console.log('Sipariş formu yazdırma tamamlandı.');
  // Sayfa başlığını geri yükle
  document.title = 'Klas Perakende Satış';
});

// Global olarak erişilebilir hale getir
window.exportToPDF = exportToPDF;
