-- UZS_VW_FLOWUSERS view - Flow ERP'den kullanıcıları getirir
CREATE VIEW UZS_VW_FLOWUSERS AS
SELECT 
    CAST('FLOW001' AS nvarchar(255)) AS UserId,
    'Flow Kullanıcı 1' AS UserName
UNION ALL
SELECT 
    CAST('FLOW002' AS nvarchar(255)) AS UserId,
    'Flow Kullanıcı 2' AS UserName
UNION ALL
SELECT 
    CAST('FLOW003' AS nvarchar(255)) AS UserId,
    'Flow Kullanıcı 3' AS UserName;

-- UZS_VW_TIGERUSERS view - Tiger ERP'den kullanıcıları getirir
CREATE VIEW UZS_VW_TIGERUSERS AS
SELECT 
    1 AS UserId,
    'Tiger Kullanıcı 1' AS UserName
UNION ALL
SELECT 
    2 AS UserId,
    'Tiger Kullanıcı 2' AS UserName
UNION ALL
SELECT 
    3 AS UserId,
    'Tiger Kullanıcı 3' AS UserName;
