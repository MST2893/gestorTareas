using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITEST.Migrations
{
    /// <inheritdoc />
    public partial class DatosInicialesDos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Tarea",
                keyColumn: "TareaId",
                keyValue: new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"),
                column: "FechaCreacion",
                value: new DateTime(2026, 3, 26, 20, 13, 16, 354, DateTimeKind.Local).AddTicks(8649));

            migrationBuilder.UpdateData(
                table: "Tarea",
                keyColumn: "TareaId",
                keyValue: new Guid("fe2de405-c38e-4c90-ac52-da0540dfb411"),
                column: "FechaCreacion",
                value: new DateTime(2026, 3, 26, 20, 13, 16, 356, DateTimeKind.Local).AddTicks(3740));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Tarea",
                keyColumn: "TareaId",
                keyValue: new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"),
                column: "FechaCreacion",
                value: new DateTime(2026, 3, 26, 20, 10, 25, 909, DateTimeKind.Local).AddTicks(7426));

            migrationBuilder.UpdateData(
                table: "Tarea",
                keyColumn: "TareaId",
                keyValue: new Guid("fe2de405-c38e-4c90-ac52-da0540dfb411"),
                column: "FechaCreacion",
                value: new DateTime(2026, 3, 26, 20, 10, 25, 911, DateTimeKind.Local).AddTicks(5197));
        }
    }
}
