using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uzser.CoreServices.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToSalesHeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Model",
                table: "Model");

            migrationBuilder.RenameTable(
                name: "Model",
                newName: "Modeller");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UZS_VW_FLOWUSERS",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "FlowUserId",
                table: "UZS_TBL_USER_MAPPING",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "UZS_TBL_SATIS_MAS",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Modeller",
                table: "Modeller",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Modeller",
                table: "Modeller");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "UZS_TBL_SATIS_MAS");

            migrationBuilder.RenameTable(
                name: "Modeller",
                newName: "Model");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "UZS_VW_FLOWUSERS",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<Guid>(
                name: "FlowUserId",
                table: "UZS_TBL_USER_MAPPING",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Model",
                table: "Model",
                column: "Id");
        }
    }
}
