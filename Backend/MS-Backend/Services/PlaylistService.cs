using Microsoft.EntityFrameworkCore;
using MS_Backend.Entities;
using MS_Backend.Models;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Services
{
    public class PlaylistService : IPlaylistService
    {
        DBContext _context;
        public PlaylistService(DBContext context)
        {
            _context = context;
        }

        public async Task<object> Get(string id)
        {

            try
            {
                var playlistDB = await _context.Playlists
                .Where(x => x.IdString == id)
                .Include(x => x.Songs)
                .ThenInclude(x => x.Song)
                .ThenInclude(x => x.SongFile)
                .Include(x => x.Songs)
                .ThenInclude(x => x.Song)
                .ThenInclude(x => x.Album)
                .ThenInclude(x => x.Artist)
                .Include(x => x.User)
                .FirstOrDefaultAsync();

                var result = new PlaylistViewModel();
                result.Name = playlistDB.Name;
                result.IdString = playlistDB.IdString;
                result.User = playlistDB.User.UserName;
                var album = new AlbumViewModel();
                album.IdString = playlistDB.IdString;
                album.Name = playlistDB.Name;
                album.Songs = playlistDB.Songs.Select(x => new SongViewModel()
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
                }).ToList();
                result.Playlist = album;
                return new
                {
                    Succeeded = true,
                    Playlist = result

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

        public async Task<object> CreatePlaylist(PlaylistViewModel model,string token) {

            try
            {
                var userToken = JwtDecode.User(token);
                var user = await _context.Users
                     .Where(x => x.UserName == userToken)
                     .Include(x => x.Playlists)
                     .FirstOrDefaultAsync();
                var playlist = new Playlist();
                playlist.Name = model.Name;
                string idStringTMP = model.Name.Replace("/", "");
                if(idStringTMP.Length >= 8)
                {
                    idStringTMP = idStringTMP.Substring(0, 8);
                }
                playlist.IdString = (idStringTMP + Guid.NewGuid().ToString().Substring(0, 8)).ToLower();
                playlist.Id = new Guid();
                user.Playlists.Add(playlist);
                await _context.SaveChangesAsync();
                return new
                {
                    Succeeded = true
                  
                };
            }
            catch
            {
                return new
                {
                    Succeeded = false
                };
            }

        }
        public async Task<object> RemoveSong(string idPlaylist, string idSong)  {
            try
            {
                var playlist = await _context.Playlists
                    .Where(x => x.IdString == idPlaylist)
                    .Include(x => x.Songs)
                    .ThenInclude(x => x.Song)
                    .FirstOrDefaultAsync();
                var song = playlist.Songs.Where(x => x.Song.IdString == idSong).FirstOrDefault();
                if(song == null)
                    return new
                    {
                        Succeeded = false
                    };
                playlist.Songs.Remove(song);
                await _context.SaveChangesAsync();
                return new
                {
                    Succeeded = true

                };
            }
            catch
            {
                return new
                {
                    Succeeded = false
                };
            }
        }
        public async Task<object> RemovePlaylist(string idPlaylist)
        {
            try
            {
                var playlist = await _context.Playlists
                    .Where(x => x.IdString == idPlaylist)
                    .FirstOrDefaultAsync();
                _context.Playlists.Remove(playlist);
                await _context.SaveChangesAsync();

                return new
                {
                    Succeeded = true

                };
            }
            catch
            {
                return new
                {
                    Succeeded = false
                };
            }
        }

        public async Task<object> AddSong( string idPlaylist, string idSong) 
        {
            try 
            { 
                var playlist = await _context.Playlists.Where(x => x.IdString == idPlaylist).FirstOrDefaultAsync();
                var song = await _context.Songs.Where(x => x.IdString == idSong).FirstOrDefaultAsync();
                playlist.Songs.Add(new SongPlaylist() { Playlist = playlist, Song = song });
                await _context.SaveChangesAsync();
                return new
                {
                    Succeeded = true

                };
            }
            catch (Exception e)
            {
                return new
                {
                    Succeeded = false
                };
}

        }


        public async Task<object> GetByCurrentUser(string token)
        {
            try
            {
                var userToken = JwtDecode.User(token);
                var user = await _context.Users.Where(x => x.UserName == userToken)
                    .Include(x => x.Playlists)
                    .FirstOrDefaultAsync();
                List<object> result = new List<object>();
                foreach(var item in user.Playlists)
                {
                    result.Add(new 
                    {
                        item.Name,
                        item.IdString,
                        item.IsFavorit,
                        item.IsPrivate
                    });
                }
                return new
                {
                    Succeeded = true,
                    Playlist = result

                };
            }
            catch
            {
                return new
                {
                    Succeeded = false

                };
            }
        }
    }
}
