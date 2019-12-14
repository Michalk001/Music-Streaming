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
    public class AlbumService : IAlbumService
    {
        DBContext _context;
        public AlbumService(DBContext context)
        {

            _context = context;
        }
        public async Task<object> Save(AlbumViewModel model)
        {
            string idString = new string(model.Name.Select(x => char.IsLetterOrDigit(x) ? x : '-').ToArray()).ToLower();
            var artist = await _context.Artists
                .Where(x => x.IdString == model.ArtistIdString)
                .Include(x => x.Albums)
                .FirstOrDefaultAsync();


            if (artist == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFoundArtist" } }
                };

            if(artist.Albums.Where(x => x.IdString == idString).FirstOrDefault() != null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "BusyName" } }
                };


            Album album = new Album()
            {
               Songs = new List<Song>(),
               IdString = idString,
               Artist = artist,
               Name = model.Name,
               Id = Guid.NewGuid()
            };

            await _context.Albums.AddAsync(album);
            await _context.SaveChangesAsync();

            return new
            {
                Succeeded = true,
            };
        }
        public async Task<object> Get()
        {
            var result = await _context.Albums
                .Include(x => x.Artist)
                .Select(x => new AlbumViewModel()
            {
                Name = x.Name,
                IdString = x.IdString,
                Songs = x.Songs.Select(x => new SongViewModel() 
                {   
                    IdString = x.IdString,
                    Length = x.Length.ToString(),
                    Name = x.Name,
                    Path = x.Path
                }).ToList(),
                ArtistName = x.Artist.Name,
                ArtistIdString = x.Artist.IdString

            }).ToListAsync();

            return new
            {
                Succeeded = true,
                Album = result
            };
        }
        public async Task<object> Get(string idString)
        {

            var model = await _context.Albums.Where(x => x.IdString == idString).FirstOrDefaultAsync();
            if (model == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFound" } }
                };

            var modelVM = new AlbumViewModel()
            {
                Name = model.Name,
                IdString = model.IdString,
                ArtistName = model.Artist.Name,
                ArtistIdString = model.Artist.IdString,
                Songs = model.Songs.Select(x => new SongViewModel()
                {
                    IdString = x.IdString,
                    Length = x.Length.ToString(),
                    Name = x.Name,
                    Path = x.Path
                }).ToList()

            };
            return new
            {
                Succeeded = true,
                Artist = modelVM
            };
        }
        public async Task<object> Update(AlbumViewModel model)
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
