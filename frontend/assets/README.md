# Assets Klasörü

Bu klasör, uygulamanın statik dosyalarını (CSS, JS, resimler, fontlar, ikonlar vb.) içerir.

## Klasör Yapısı

### `/css`
Stil dosyaları:
- `styles.css` - Ana stil dosyası (typography, layout, animasyonlar)
- `dropdown.css` - Dropdown bileşenlerinin stilleri
- `loading.css` - Loading ekranı stilleri  
- `print.css` - PDF/yazdırma stilleri

### `/js`
JavaScript yardımcı dosyaları:
- `print.js` - PDF export ve yazdırma işlevleri

### `/img`
Uygulama genelinde kullanılan resim dosyaları:
- `klaslogo.png` - Klas firmasının logosu (ekran için)
- `logo.png` - Ana uygulama logosu (PDF için)

## Dosya Organizasyonu

Statik dosyalar türlerine göre alt klasörlerde organize edilir:
- `/css` - Stil dosyaları (CSS)
- `/js` - JavaScript yardımcı dosyaları  
- `/img` - Resim dosyaları (PNG, JPG, SVG)
- `/fonts` - Font dosyaları (gerekirse)
- `/icons` - İkon dosyaları (gerekirse)

## Kullanım

Bu dosyalar HTML dosyalarında referans edilir:

### CSS Dosyaları:
```html
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="stylesheet" href="assets/css/dropdown.css">
<link rel="stylesheet" href="assets/css/loading.css">
<link rel="stylesheet" href="assets/css/print.css">
```

### JavaScript Dosyaları:
```html
<script src="assets/js/print.js"></script>
```

### Resim Dosyaları:
```html
<img src="assets/img/logo.png" alt="Logo">
```

## Dosya Yönetimi

- CSS dosyaları modüler yapıda organize edilmiş
- Resim dosyaları optimize edilmiş boyutlarda tutulmalı
- Dosya isimleri açıklayıcı ve küçük harfle yazılmalı
- Gereksiz dosyalar düzenli olarak temizlenmeli
