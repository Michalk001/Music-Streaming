using Microsoft.EntityFrameworkCore.Migrations;

namespace MS_Backend.Migrations
{
    public partial class tretret : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPrivate",
                table: "Playlists",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Playlists",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPrivate",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Playlists");
        }
    }
}
