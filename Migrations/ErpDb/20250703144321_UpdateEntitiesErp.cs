using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uzser.CoreServices.Migrations.ErpDb
{
    /// <inheritdoc />
    public partial class UpdateEntitiesErp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UZS_VW_CUSTOMER",
                columns: table => new
                {
                    CREATEDATE = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CREATEUSER = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UPDATEDATE = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UPDATEUSER = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WFSTATE = table.Column<int>(type: "int", nullable: true),
                    CUSTOMERCODE = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CUSTOMERNAME = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VKNTC = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TAXOFFICE = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ADDRESS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TELEPHONE = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PAYMENTTYPE = table.Column<int>(type: "int", nullable: true),
                    EMAIL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FLOWID = table.Column<int>(type: "int", nullable: true),
                    STATUS = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "UZS_VW_DEPARTMENTS",
                columns: table => new
                {
                    DEPARTMENT_CODE = table.Column<short>(type: "smallint", nullable: false),
                    DEPARTMENT_NAME = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "UZS_VW_STOCK",
                columns: table => new
                {
                    STOCK_CODE = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    STOCK_NAME = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UZS_VW_CUSTOMER");

            migrationBuilder.DropTable(
                name: "UZS_VW_DEPARTMENTS");

            migrationBuilder.DropTable(
                name: "UZS_VW_STOCK");
        }
    }
}
