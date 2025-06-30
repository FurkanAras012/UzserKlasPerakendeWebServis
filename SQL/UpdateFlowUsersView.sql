-- Flow Users view'ını string döndürecek şekilde güncelle
ALTER VIEW UZS_VW_FLOWUSERS AS
SELECT 
    CAST(UserId AS NVARCHAR(50)) AS UserId,
    UserName
FROM TIGER_FLOW_USERS -- veya gerçek tablo/view adı
WHERE IsActive = 1;
