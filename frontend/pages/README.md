# Pages Klasörü

Bu klasör, ana sayfa dışındaki ek sayfaları ve bunların JavaScript dosyalarını içerir. Her sayfa kendi iş mantığı ile birlikte organize edilmiştir.

## Dosyalar

### `usermapping.html`
- Kullanıcı eşleme sayfası HTML dosyası
- Plasiyer ve kullanıcı eşleme arayüzü
- Form elemanları ve modal yapıları

### `usermapping.js`
- Kullanıcı eşleme sayfasının JavaScript mantığı
- API ile kullanıcı verilerinin yönetimi
- Form validasyonları ve submit işlemleri
- Kullanıcı eşleme işlemlerinin koordinasyonu

## Sayfa Yapısı

Bu klasördeki her sayfa:
- Kendi HTML dosyası
- Kendi JavaScript dosyası
- İlgili sayfaya özel CSS (gerekirse)
- Bağımsız çalışabilir yapı

## Kullanım

Bu sayfalar ana uygulamadan ayrı olarak çalışır ancak aynı API servislerini ve bazı ortak bileşenleri kullanabilir. Her sayfa kendi entry point'ine sahiptir.
