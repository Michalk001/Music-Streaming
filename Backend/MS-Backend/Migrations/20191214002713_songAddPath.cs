using Microsoft.EntityFrameworkCore.Migrations;

namespace MS_Backend.Migrations
{
    public partial class songAddPath : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "Songs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "Songs");
        }
    }
}
