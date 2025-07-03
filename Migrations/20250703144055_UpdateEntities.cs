using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uzser.CoreServices.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Marka",
                table: "Marka");

            migrationBuilder.RenameTable(
                name: "Marka",
                newName: "Markalar");

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "UZS_TBL_CUSTOMER",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Markalar",
                table: "Markalar",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Markalar",
                table: "Markalar");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "UZS_TBL_CUSTOMER");

            migrationBuilder.RenameTable(
                name: "Markalar",
                newName: "Marka");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Marka",
                table: "Marka",
                column: "Id");
        }
    }
}
