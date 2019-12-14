using Microsoft.EntityFrameworkCore.Migrations;

namespace MS_Backend.Migrations
{
    public partial class addIdString : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdString",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdString",
                table: "Artists",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdString",
                table: "Albums",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdString",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "IdString",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "IdString",
                table: "Albums");
        }
    }
}
