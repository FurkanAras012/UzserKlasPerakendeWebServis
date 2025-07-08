// Tarih yönetimi modülü
export class DateManager {
  static siparisTarihiPicker = null;
  static teslimTarihiPicker = null;

  static initializeDatePickers() {
    // Tarih seçiciler
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('tr-TR', {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
    
    // Header tarih alanını doldur
    document.getElementById('headerTarih').value = formattedDate;
    
    this.siparisTarihiPicker = flatpickr('#siparisTarihi', {
      enableTime: true,
      dateFormat: 'Y-m-d',
      defaultDate: new Date(),
      locale: flatpickr.l10ns.tr
    });
    
    this.teslimTarihiPicker = flatpickr('#teslimTarihi', {
      enableTime: true,
      dateFormat: 'Y-m-d',
      defaultDate: new Date(),
      locale: flatpickr.l10ns.tr
    });
    
    console.log('Flatpickr instances oluşturuldu:', {
      siparisTarihiPicker: !!this.siparisTarihiPicker,
      teslimTarihiPicker: !!this.teslimTarihiPicker
    });

    // Global olarak erişilebilir yap
    window.siparisTarihiPicker = this.siparisTarihiPicker;
    window.teslimTarihiPicker = this.teslimTarihiPicker;
  }

  static getSiparisTarihiPicker() {
    return this.siparisTarihiPicker;
  }

  static getTeslimTarihiPicker() {
    return this.teslimTarihiPicker;
  }
}
