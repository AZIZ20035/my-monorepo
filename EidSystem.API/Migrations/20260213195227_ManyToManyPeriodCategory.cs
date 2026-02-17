using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EidSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class ManyToManyPeriodCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DayPeriods_Categories_CategoryId",
                table: "DayPeriods");

            migrationBuilder.DropForeignKey(
                name: "FK_EidDayPeriods_DayPeriods_PeriodId",
                table: "EidDayPeriods");

            migrationBuilder.DropIndex(
                name: "IX_DayPeriods_CategoryId",
                table: "DayPeriods");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "DayPeriods");

            migrationBuilder.RenameColumn(
                name: "PeriodId",
                table: "EidDayPeriods",
                newName: "DayPeriodCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_EidDayPeriods_PeriodId",
                table: "EidDayPeriods",
                newName: "IX_EidDayPeriods_DayPeriodCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_EidDayPeriods_EidDayId_PeriodId",
                table: "EidDayPeriods",
                newName: "IX_EidDayPeriods_EidDayId_DayPeriodCategoryId");

            migrationBuilder.CreateTable(
                name: "DayPeriodCategories",
                columns: table => new
                {
                    DayPeriodCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PeriodId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayPeriodCategories", x => x.DayPeriodCategoryId);
                    table.ForeignKey(
                        name: "FK_DayPeriodCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DayPeriodCategories_DayPeriods_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "DayPeriods",
                        principalColumn: "PeriodId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DayPeriodCategories_CategoryId",
                table: "DayPeriodCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DayPeriodCategories_PeriodId_CategoryId",
                table: "DayPeriodCategories",
                columns: new[] { "PeriodId", "CategoryId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EidDayPeriods_DayPeriodCategories_DayPeriodCategoryId",
                table: "EidDayPeriods",
                column: "DayPeriodCategoryId",
                principalTable: "DayPeriodCategories",
                principalColumn: "DayPeriodCategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EidDayPeriods_DayPeriodCategories_DayPeriodCategoryId",
                table: "EidDayPeriods");

            migrationBuilder.DropTable(
                name: "DayPeriodCategories");

            migrationBuilder.RenameColumn(
                name: "DayPeriodCategoryId",
                table: "EidDayPeriods",
                newName: "PeriodId");

            migrationBuilder.RenameIndex(
                name: "IX_EidDayPeriods_EidDayId_DayPeriodCategoryId",
                table: "EidDayPeriods",
                newName: "IX_EidDayPeriods_EidDayId_PeriodId");

            migrationBuilder.RenameIndex(
                name: "IX_EidDayPeriods_DayPeriodCategoryId",
                table: "EidDayPeriods",
                newName: "IX_EidDayPeriods_PeriodId");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "DayPeriods",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DayPeriods_CategoryId",
                table: "DayPeriods",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_DayPeriods_Categories_CategoryId",
                table: "DayPeriods",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EidDayPeriods_DayPeriods_PeriodId",
                table: "EidDayPeriods",
                column: "PeriodId",
                principalTable: "DayPeriods",
                principalColumn: "PeriodId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
