# Components Klasörü

Bu klasör, uygulamanın UI ve iş mantığı bileşenlerini içerir. Her dosya belirli bir işlevsellik alanından sorumludur.

## Dosyalar

### `customer.js`
- Müşteri yönetimi ile ilgili tüm fonksiyonlar
- Müşteri seçimi, yeni müşteri ekleme, müşteri detay modal'ı
- Müşteri arama ve filtreleme işlemleri
- İmza kutuları güncelleme fonksiyonları

### `dropdown.js`
- Dropdown bileşenlerinin yönetimi
- Müşteri, araç ve ürün dropdown'larının açılma/kapanma mantığı
- Dropdown event listener'ları ve state yönetimi
- Otomatik tamamlama ve arama fonksiyonları

### `product.js`
- Ürün yönetimi ve sipariş satırları
- Ürün ekleme, düzenleme, silme işlemleri
- Miktar ve fiyat hesaplamaları
- Ürün form validasyonları

### `sales.js`
- Satış işlemleri ana modülü
- Sipariş kaydetme, proforma oluşturma
- Mevcut satış verilerini yükleme
- Sipariş numarası oluşturma

### `ui.js`
- Genel UI yardımcı fonksiyonları
- Toast mesajları (hata, başarı)
- Dropdown populate işlemleri
- Genel UI etkileşimleri

### `vehicle.js`
- Araç yönetimi fonksiyonları
- Araç seçimi, yeni araç ekleme
- Araç detay modal'ı işlemleri
- Araç arama ve filtreleme

## Kullanım

Bu dosyalar app.js tarafından import edilir ve gerekli yerlerde kullanılır. Her bileşen kendi sorumluluğu dahilindeki işlemleri yönetir ve diğer bileşenlerle minimal bağımlılık ilkesiyle çalışır.
