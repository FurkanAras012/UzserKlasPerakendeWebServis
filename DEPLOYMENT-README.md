# Deployment Dosyaları

## 📁 Klasör Yapısı

```
UzserCoreServices-Deployment/
├── API-Backend/          # IIS Port 8080
│   ├── Uzser.CoreServices.dll
│   ├── appsettings.json
│   ├── web.config
│   └── ... (tüm publish dosyaları)
│
├── Frontend/             # IIS Port 8081 veya Static Hosting
│   ├── index.html
│   ├── usermapping.html
│   ├── api.js           # BASE URL: http://192.168.1.223:8080/api/v1
│   ├── main.js
│   └── ... (tüm frontend dosyaları)
│
└── IIS-KURULUM-REHBERI.md
```

## 🚀 Deployment Adımları

### 1. API Deployment (Port 8080)
```
Kaynak: publish/ klasörü
Hedef: C:\inetpub\wwwroot\UzserCoreServicesAPI\
```

### 2. Frontend Deployment (Port 8081)
```
Kaynak: frontend/ klasörü  
Hedef: C:\inetpub\wwwroot\UzserFrontend\
```

## ✅ Hazır Dosyalar

- ✅ API publish edildi
- ✅ appsettings.json production ayarları yapıldı
- ✅ web.config IIS için hazır
- ✅ Frontend'te BASE URL güncellendi (192.168.1.223:8080)
- ✅ CORS ayarları yapıldı
- ✅ Kurulum rehberi hazır

## 🔗 Test URL'leri

- **API Swagger**: http://192.168.1.223:8080/swagger
- **Frontend**: http://192.168.1.223:8081/index.html
- **User Mapping**: http://192.168.1.223:8081/usermapping.html
