# Core Klasörü

Bu klasör, uygulamanın temel iş mantığını ve merkezi yönetim modüllerini içerir. Uygulama genelinde kullanılan core fonksiyonaliteler burada bulunur.

## Dosyalar

### `dataManager.js`
- Uygulama verilerinin merkezi yönetimi
- API'den veri çekme işlemlerinin koordinasyonu
- Müşteri, ürün, araç ve kullanıcı verilerinin yüklenmesi
- Şehir dropdown'ının başlatılması

### `dateManager.js`
- Tarih işlemlerinin yönetimi
- Flatpickr tarih seçicilerinin başlatılması
- Sipariş ve teslim tarihi yönetimi
- Tarih formatı dönüşümleri

### `eventManager.js`
- Global event handler'ların yönetimi
- Buton click olayları ve klavye olayları
- Global fonksiyonları window nesnesine ekleme
- Kullanıcı etkileşimlerinin koordinasyonu

### `loading.js`
- Loading/yükleniyor ekranının yönetimi
- Asenkron işlemler sırasında kullanıcı bilgilendirmesi
- Loading durumunun gösterilmesi ve gizlenmesi
- Özelleştirilebilir loading mesajları

### `recordManager.js`
- Kayıt durumu yönetimi (yeni/mevcut)
- FlowId'ye göre mevcut satış verilerinin kontrolü
- Yeni kayıt ve mevcut kayıt senaryolarının yönetimi
- Sayfa modunun belirlenmesi

### `userManager.js`
- Kullanıcı bilgilerinin yönetimi
- Plasiyer bilgilerinin API'den alınması
- Kullanıcı ile ilgili UI güncellemeleri
- Kullanıcı oturum bilgileri

## Kullanım

Core modüller app.js tarafından import edilir ve uygulamanın başlatılması sırasında koordineli bir şekilde çalıştırılır. Bu modüller uygulamanın temel altyapısını oluşturur ve diğer tüm bileşenler tarafından kullanılır.
