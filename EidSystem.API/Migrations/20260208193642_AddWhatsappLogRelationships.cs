using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EidSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWhatsappLogRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_WhatsappLogs_CustomerId",
                table: "WhatsappLogs",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsappLogs_OrderId",
                table: "WhatsappLogs",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_WhatsappLogs_Customers_CustomerId",
                table: "WhatsappLogs",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_WhatsappLogs_Orders_OrderId",
                table: "WhatsappLogs",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WhatsappLogs_Customers_CustomerId",
                table: "WhatsappLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_WhatsappLogs_Orders_OrderId",
                table: "WhatsappLogs");

            migrationBuilder.DropIndex(
                name: "IX_WhatsappLogs_CustomerId",
                table: "WhatsappLogs");

            migrationBuilder.DropIndex(
                name: "IX_WhatsappLogs_OrderId",
                table: "WhatsappLogs");
        }
    }
}
