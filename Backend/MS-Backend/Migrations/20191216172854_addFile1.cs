using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MS_Backend.Migrations
{
    public partial class addFile1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "Songs");

            migrationBuilder.AddColumn<Guid>(
                name: "SongFileId",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CoverId",
                table: "Albums",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Songs_SongFileId",
                table: "Songs",
                column: "SongFileId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_CoverId",
                table: "Albums",
                column: "CoverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_File_CoverId",
                table: "Albums",
                column: "CoverId",
                principalTable: "File",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_File_SongFileId",
                table: "Songs",
                column: "SongFileId",
                principalTable: "File",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_File_CoverId",
                table: "Albums");

            migrationBuilder.DropForeignKey(
                name: "FK_Songs_File_SongFileId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_SongFileId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Albums_CoverId",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "SongFileId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "CoverId",
                table: "Albums");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
