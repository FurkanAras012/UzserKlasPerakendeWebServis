# Services Klasörü

Bu klasör, uygulamanın dış servislerle (API) iletişimini ve yardımcı fonksiyonları içerir. Veri katmanı ve utility fonksiyonları burada bulunur.

## Dosyalar

### `api.js`
- Backend API ile iletişim fonksiyonları
- HTTP istekleri (GET, POST, PUT, DELETE)
- Müşteri, ürün, araç, satış verilerinin API'den çekilmesi
- Yeni kayıt ekleme ve güncelleme işlemleri
- Hata yönetimi ve response handling

#### Ana API Fonksiyonları:
- `fetchCustomers()` - Müşteri listesi
- `fetchProducts()` - Ürün listesi  
- `fetchVehicles()` - Araç listesi
- `fetchSales()` - Satış verileri
- `saveMaster()` - Ana kayıt kaydetme
- `saveLine()` - Satır kaydetme
- `deleteLine()` - Satır silme

### `helpers.js`
- Genel yardımcı fonksiyonlar
- URL parametre okuma (`getQueryParam`)
- Tarih formatı dönüşümleri
- String işlemleri
- Validation fonksiyonları
- Ortak utility işlemleri

#### Ana Helper Fonksiyonları:
- `getQueryParam(param)` - URL'den parametre alma
- `formatDateForInput(date)` - Tarih formatı dönüşümü
- Diğer genel utility fonksiyonları

## API Konfigürasyonu

API endpoint'leri ve konfigürasyonlar `../config.js` dosyasından alınır.

## Kullanım

Bu servisler uygulama genelinde import edilir ve veri işlemleri için kullanılır. API fonksiyonları async/await pattern'i ile çalışır ve hata yönetimi içerir.
