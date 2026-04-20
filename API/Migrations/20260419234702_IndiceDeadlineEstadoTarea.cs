using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITEST.Migrations
{
    /// <inheritdoc />
    public partial class IndiceDeadlineEstadoTarea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tarea_Deadline_Estado",
                table: "Tarea",
                columns: new[] { "Deadline", "Estado" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tarea_Deadline_Estado",
                table: "Tarea");
        }
    }
}
