-- UZS_VW_CITIES view - Tiger ERP'den şehir listesi
-- Bu view production'da (224) zaten var, development (242) için oluşturulacak

-- Eğer view varsa önce sil
IF OBJECT_ID('UZS_VW_CITIES', 'V') IS NOT NULL
    DROP VIEW UZS_VW_CITIES;
GO

-- View'i oluştur
CREATE VIEW UZS_VW_CITIES AS   
SELECT LOGICALREF, COUNTRY, NAME, CODE FROM L_CITY;
GO

-- Test sorgusu (isteğe bağlı)
-- SELECT * FROM UZS_VW_CITIES;
