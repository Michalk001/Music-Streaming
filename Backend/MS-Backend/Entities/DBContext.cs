using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class DBContext : IdentityDbContext<User
             , Role
             , Guid
             , IdentityUserClaim<Guid>
             , UserRole
             , IdentityUserLogin<Guid>
             , IdentityRoleClaim<Guid>
             , IdentityUserToken<Guid>
        >
    {

        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {

        }
        public new DbSet<Role> Roles { get; set; }
        public new DbSet<User> Users { get; set; }
        public  DbSet<Song> Songs { get; set; }
        public  DbSet<Artist> Artists { get; set; }
        public  DbSet<Album> Albums { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<SongPlaylist> SongPlaylists { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            this.Setup(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        private void Setup(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(x => x.Id);
            modelBuilder.Entity<Role>().HasKey(x => x.Id);
            modelBuilder.Entity<Song>().HasKey(x => x.Id);
            modelBuilder.Entity<Artist>().HasKey(x => x.Id);
            modelBuilder.Entity<Album>().HasKey(x => x.Id);
            modelBuilder.Entity<File>().HasKey(x => x.Id);
            modelBuilder.Entity<Playlist>().HasKey(x => x.Id);
            modelBuilder.Entity<SongPlaylist>().HasKey(x => new { x.PlaylistId, x.SongId });
        }


    }
}
