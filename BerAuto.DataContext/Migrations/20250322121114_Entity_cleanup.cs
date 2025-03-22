using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BerAuto.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class Entity_cleanup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_CarRentals_CarRentalId",
                table: "Cars");

            migrationBuilder.DropForeignKey(
                name: "FK_Rents_Addresses_AddressId",
                table: "Rents");

            migrationBuilder.DropForeignKey(
                name: "FK_Rents_CarRentals_CarRentalId",
                table: "Rents");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_CarRentals_CarRentalId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "CarRentals");

            migrationBuilder.DropIndex(
                name: "IX_Users_CarRentalId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Rents_AddressId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_CarRentalId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Cars_CarRentalId",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "CarRentalId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CarRentalId",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "CarRentalId",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "Ratings",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Addresses");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Rents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<double>(
                name: "Price",
                table: "Cars",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Rents");

            migrationBuilder.AddColumn<int>(
                name: "CarRentalId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CarRentalId",
                table: "Rents",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Price",
                table: "Cars",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<int>(
                name: "CarRentalId",
                table: "Cars",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ratings",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Addresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CarRentals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AddressId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarRentals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarRentals_Addresses_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CarRentalId",
                table: "Users",
                column: "CarRentalId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_AddressId",
                table: "Rents",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_CarRentalId",
                table: "Rents",
                column: "CarRentalId");

            migrationBuilder.CreateIndex(
                name: "IX_Cars_CarRentalId",
                table: "Cars",
                column: "CarRentalId");

            migrationBuilder.CreateIndex(
                name: "IX_CarRentals_AddressId",
                table: "CarRentals",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_CarRentals_CarRentalId",
                table: "Cars",
                column: "CarRentalId",
                principalTable: "CarRentals",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_Addresses_AddressId",
                table: "Rents",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_CarRentals_CarRentalId",
                table: "Rents",
                column: "CarRentalId",
                principalTable: "CarRentals",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_CarRentals_CarRentalId",
                table: "Users",
                column: "CarRentalId",
                principalTable: "CarRentals",
                principalColumn: "Id");
        }
    }
}
