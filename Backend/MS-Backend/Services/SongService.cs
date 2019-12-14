using Microsoft.EntityFrameworkCore;
using MS_Backend.Entities;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Services
{
    public class SongService : ISongService
    {
        DBContext _context;
        public SongService(DBContext context)
        {

            _context = context;
        }
        public async Task<object> Save(SongViewModel model)
        {
            string idString = new string(model.Name.Select(x => char.IsLetterOrDigit(x) ? x : '-').ToArray()).ToLower();
            var album = await _context.Albums
                .Where(x => x.IdString == model.IdAlbumString)
                .Include(x => x.Songs)
                .FirstOrDefaultAsync();


            if (album == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFoundAlbum" } }
                };

            if (album.Songs.Where(x => x.IdString == idString).FirstOrDefault() != null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "BusyName" } }
                };


            Song song = new Song()
            {
                Album = album,
                Path = "/",
                IdString = idString,
                Name = model.Name,
                Id = Guid.NewGuid()
            };

            await _context.Songs.AddAsync(song);
            await _context.SaveChangesAsync();

            return new
            {
                Succeeded = true,
            };
        }
        public async Task<object> Get()
        {
            var result = await _context.Songs
                .Include(x => x.Album)
                .Select(x => new SongViewModel()
                {
                    Name = x.Name,
                    IdString = x.IdString,
                    Album = new AlbumViewModel()
                    {
                        Name = x.Album.Name,
                        IdString = x.Album.IdString,
                        ArtistName = x.Album.Artist.Name,
                        ArtistIdString = x.Album.Artist.IdString
                    },
                    Path = x.Path.ToString(),
                    Length = x.Length.ToString()

                }).ToListAsync();

            return new
            {
                Succeeded = true,
                Album = result
            };
        }
        public async Task<object> Get(string idString)
        {

            var model = await _context.Songs.Where(x => x.IdString == idString).FirstOrDefaultAsync();
            if (model == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFound" } }
                };

            var modelVM = new SongViewModel()
            {
       
                    Name = model.Name,
                    IdString = model.IdString,
                    Album = new AlbumViewModel()
                    {
                        Name = model.Album.Name,
                        IdString = model.Album.IdString,
                        ArtistName = model.Album.Artist.Name,
                        ArtistIdString = model.Album.Artist.IdString,
                        
                    },
                    Path = model.Path.ToString(),
                    Length = model.Length.ToString(),
                    IdAlbumString = model.Album.IdString
            };

            return new
            {
                Succeeded = true,
                Song = modelVM
            };
        }
        public async Task<object> Update(SongViewModel model)
        {
            return new
            {

            };
        }
        public async Task<object> Remove(string isString)
        {
            return new
            {

            };
        }
    }
}
