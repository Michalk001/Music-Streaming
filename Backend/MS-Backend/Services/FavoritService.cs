using Microsoft.EntityFrameworkCore;
using MS_Backend.Entities;
using MS_Backend.ServiceInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using MS_Backend.Models;
using MS_Backend.ViewModel;

namespace MS_Backend.Services
{
    public class FavoritService : IFavoritService
    {
        DBContext _context;
        private readonly IAlbumService _albumService;
        public FavoritService(IAlbumService albumService, DBContext context)
        {
            _albumService = albumService;
            _context = context;
        }


        public async Task<object> Get(string token)
        {

            try
            { 
                var userToken = JwtDecode.User(token);
                var user = await _context.Users
                    .Where(x => x.UserName == userToken)
                    .Include(x => x.Playlists)
                    .ThenInclude(x => x.Songs)
                    .ThenInclude(x => x.Song)
                    .ThenInclude(x => x.SongFile)
                    .Include(x => x.Playlists)
                    .ThenInclude(x => x.Songs)
                    .ThenInclude(x => x.Song)
                    .ThenInclude(x => x.Album)
                    .ThenInclude(x => x.Artist)
                    .FirstOrDefaultAsync();
                var favorit =  user.Playlists.Where(x => x.IsFavorit == true).FirstOrDefault();
                AlbumViewModel album = new AlbumViewModel()
                {
                    IdString = favorit.IdString,
                    Songs = favorit.Songs.Select(x => new SongViewModel()
                    {
                        Path = x.Song.SongFile.Path,
                        Name = x.Song.Name,
                        Length = x.Song.Length.ToString(),
                        IdString = x.Song.IdString,
                        Album = new AlbumViewModel()
                        {
                            ArtistName = x.Song.Album.Artist.Name,
                            ArtistIdString = x.Song.Album.Artist.IdString,
                            IdString = x.Song.Album.IdString,
                            Name = x.Song.Album.Name
                        }
                    }).ToList()
                };
                return new
                {
                    Succeeded = true,
                    Favorit = album

                };
            }
            catch (Exception e)
            {
                return new
                {
                    Succeeded = false,
                   
                };
            }
        }

        public async Task<object> Add(string token, string idSong)
        {
            try
            {

                var userToken = JwtDecode.User(token);
                var user = _context.Users
                    .Where(x => x.UserName == userToken)
                    .Include(x => x.Playlists)
                    .FirstOrDefault();
                var favorit = user.Playlists.Where(x => x.IsFavorit == true).FirstOrDefault();
                var song = _context.Songs.Where(x => x.IdString == idSong).FirstOrDefault();
                favorit.Songs.Add(new SongPlaylist() { Playlist = favorit, Song = song });
                _context.SaveChanges();
                return new
                {
                    Succeeded = true

                };
            }
            catch (Exception e)
            {
                return new
                {
                    Succeeded = false,

                };
            }
        }
        public async Task<object> Remove(string token, string idSong)
        {
            try
            {
                var userToken = JwtDecode.User(token);
            var user = _context.Users
                 .Where(x => x.UserName == userToken)
                 .Include(x => x.Playlists)
                 .FirstOrDefault();
            var favorit = user.Playlists.Where(x => x.IsFavorit == true).FirstOrDefault();
            var songPlaylist = _context.SongPlaylists.Where(x => x.Song.IdString == idSong).FirstOrDefault();
            favorit.Songs.Remove(songPlaylist);
            _context.SaveChanges();
                return new
                {
                    Succeeded = true

                };
            }
         catch (Exception e)
            {
                return new
                {
                    Succeeded = false,
                   
                };
}
        }

    }
}
