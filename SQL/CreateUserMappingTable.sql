-- UZS_TBL_USER_MAPPING tablosu
CREATE TABLE UZS_TBL_USER_MAPPING (
    Id int IDENTITY(1,1) PRIMARY KEY,
    FlowUserId nvarchar(50) NOT NULL,
    FlowUserName nvarchar(255) NOT NULL,
    TigerUserId int NOT NULL,
    TigerUserName nvarchar(255) NOT NULL,
    CreateUser nvarchar(50) NULL,
    UpdateUser nvarchar(50) NULL,
    CreateDate datetime2 NOT NULL DEFAULT GETDATE(),
    UpdateDate datetime2 NOT NULL DEFAULT GETDATE(),
    IsActive bit NOT NULL DEFAULT 1
);

-- Index'ler
CREATE INDEX IX_UserMapping_FlowUserId ON UZS_TBL_USER_MAPPING(FlowUserId);
CREATE INDEX IX_UserMapping_TigerUserId ON UZS_TBL_USER_MAPPING(TigerUserId);
CREATE INDEX IX_UserMapping_IsActive ON UZS_TBL_USER_MAPPING(IsActive);
