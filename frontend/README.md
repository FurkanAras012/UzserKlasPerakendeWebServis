# Frontend Klasörü

Bu klasör, satış/sipariş uygulamasının frontend kısmını içerir. Modüler ve organize edilmiş bir yapıya sahiptir.

## Ana Dosyalar

### `index.html`
- Ana HTML sayfası
- Uygulama giriş noktası
- CSS ve JavaScript referansları

### `app.js`
- Ana uygulama yöneticisi (AppManager)
- Uygulamanın başlatılması ve koordinasyonu
- Tüm modüllerin entegrasyonu

### `main.js`
- Legacy entry point (geriye dönük uyumluluk için)
- app.js'e yönlendirme yapar

### `config.js`
- API konfigürasyonları
- Uygulama ayarları
- Endpoint tanımları

## Klasör Yapısı

### `/components`
UI ve iş mantığı bileşenleri:
- `customer.js` - Müşteri yönetimi
- `dropdown.js` - Dropdown bileşenleri
- `product.js` - Ürün yönetimi
- `sales.js` - Satış işlemleri
- `ui.js` - UI yardımcı fonksiyonları
- `vehicle.js` - Araç yönetimi

### `/core`
Temel uygulama mantığı:
- `dataManager.js` - Veri yönetimi
- `dateManager.js` - Tarih işlemleri
- `eventManager.js` - Event yönetimi
- `loading.js` - Loading ekranı
- `recordManager.js` - Kayıt durumu
- `userManager.js` - Kullanıcı yönetimi

### `/services`
API ve yardımcı servisler:
- `api.js` - Backend API iletişimi
- `helpers.js` - Yardımcı fonksiyonlar

### `/pages`
Ek sayfalar:
- `usermapping.html` - Kullanıcı eşleme sayfası
- `usermapping.js` - Kullanıcı eşleme JS mantığı

### `/assets`
Statik dosyalar:
- `/css` - Stil dosyaları (styles.css, dropdown.css, loading.css, print.css)
- `/js` - JavaScript yardımcı dosyaları (print.js)
- `/img` - Resim dosyaları (klaslogo.png, logo.png)

## Uygulama Akışı

1. `index.html` yüklenir
2. `app.js` çalıştırılır (AppManager.initialize())
3. Core modüller başlatılır
4. Veriler API'den yüklenir
5. UI bileşenleri kurulur
6. Event handler'lar eklenir
7. Uygulama kullanıma hazır hale gelir

## Teknolojiler

- **ES6 Modules** - Modüler JavaScript yapısı
- **Async/Await** - Asenkron işlemler
- **Flatpickr** - Tarih seçici
- **Vanilla JavaScript** - Framework kullanılmadan

## Geliştirme Notları

- Tüm dosyalar ES6 module formatında
- Import yolları yeni dizin yapısına göre güncellendi
- Her modül kendi sorumluluğuna odaklanır
- Minimal bağımlılık ilkesi uygulanır
