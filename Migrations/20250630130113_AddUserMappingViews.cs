using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uzser.CoreServices.Migrations
{
    /// <inheritdoc />
    public partial class AddUserMappingViews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // UZS_TBL_USER_MAPPING tablosu
            migrationBuilder.CreateTable(
                name: "UZS_TBL_USER_MAPPING",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlowUserId = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    FlowUserName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    TigerUserId = table.Column<int>(type: "int", nullable: false),
                    TigerUserName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    CreateUser = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    UpdateUser = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UZS_TBL_USER_MAPPING", x => x.Id);
                });

            // Index'ler
            migrationBuilder.CreateIndex(
                name: "IX_UserMapping_FlowUserId",
                table: "UZS_TBL_USER_MAPPING",
                column: "FlowUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMapping_TigerUserId",
                table: "UZS_TBL_USER_MAPPING",
                column: "TigerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMapping_IsActive",
                table: "UZS_TBL_USER_MAPPING",
                column: "IsActive");

            // UZS_VW_FLOWUSERS view
            migrationBuilder.Sql(@"
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
            ");

            // UZS_VW_TIGERUSERS view
            migrationBuilder.Sql(@"
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
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // View'ları sil
            migrationBuilder.Sql("DROP VIEW IF EXISTS UZS_VW_FLOWUSERS;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS UZS_VW_TIGERUSERS;");

            // Tabloyu sil
            migrationBuilder.DropTable(
                name: "UZS_TBL_USER_MAPPING");
        }
    }
}
