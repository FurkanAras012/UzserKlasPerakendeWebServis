using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Uzser.CoreServices.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToUzserCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "UZS_TBL_CUSTOMER",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "UZS_TBL_CUSTOMER");
        }
    }
}
