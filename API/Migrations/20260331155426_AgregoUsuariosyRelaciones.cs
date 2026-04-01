using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace APITEST.Migrations
{
    /// <inheritdoc />
    public partial class AgregoUsuariosyRelaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Usuario",
                columns: new[] { "UsuarioId", "Email", "Nombre" },
                values: new object[,]
                {
                    { new Guid("01c8921f-5b16-4895-abb4-4436fa7338b5"), "juan@test.com", "Juan" },
                    { new Guid("557c32cb-aefb-4fe9-a402-48e3de0828eb"), "matias@test.com", "Matías" }
                });

            migrationBuilder.InsertData(
                table: "TareaUsuariosRel",
                columns: new[] { "TareaId", "UsuarioId" },
                values: new object[,]
                {
                    { new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"), new Guid("01c8921f-5b16-4895-abb4-4436fa7338b5") },
                    { new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"), new Guid("557c32cb-aefb-4fe9-a402-48e3de0828eb") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TareaUsuariosRel",
                keyColumns: new[] { "TareaId", "UsuarioId" },
                keyValues: new object[] { new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"), new Guid("01c8921f-5b16-4895-abb4-4436fa7338b5") });

            migrationBuilder.DeleteData(
                table: "TareaUsuariosRel",
                keyColumns: new[] { "TareaId", "UsuarioId" },
                keyValues: new object[] { new Guid("fe2de405-c38e-4c90-ac52-da0540dfb410"), new Guid("557c32cb-aefb-4fe9-a402-48e3de0828eb") });

            migrationBuilder.DeleteData(
                table: "Usuario",
                keyColumn: "UsuarioId",
                keyValue: new Guid("01c8921f-5b16-4895-abb4-4436fa7338b5"));

            migrationBuilder.DeleteData(
                table: "Usuario",
                keyColumn: "UsuarioId",
                keyValue: new Guid("557c32cb-aefb-4fe9-a402-48e3de0828eb"));
        }
    }
}
