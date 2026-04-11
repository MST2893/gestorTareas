using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APITEST.Migrations
{
    /// <inheritdoc />
    public partial class FotoUsuarioV : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FotoPerfil",
                table: "Usuario",
                newName: "Foto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Foto",
                table: "Usuario",
                newName: "FotoPerfil");
        }
    }
}
