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
    public class ArtistService : IArtistService
    {
        DBContext _context;
        public ArtistService(DBContext context)
        {

            _context = context;
        }
        public async Task<object> Save(ArtistViewModel model)
        {
            string idString = new string(model.Name.Select(x => char.IsLetterOrDigit(x) ? x : '-').ToArray()).ToLower();
            var check = await _context.Artists
                .Where(x => x.IdString == idString)
                .Include(x => x.Albums)
                .FirstOrDefaultAsync();
            if (check != null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "BusyName" } }
                };
            Artist artist = new Artist()
            {
                Albums = new List<Album>(),
                Name = model.Name,
                IdString = idString,
                Id = Guid.NewGuid()
            };

            await _context.Artists.AddAsync(artist);
            await _context.SaveChangesAsync();

            return new
            {
                Succeeded = true,
            };
        }
        public async Task<object> Get()
        {
            var result = await _context.Artists.Select(x => new ArtistViewModel()
            {
               Name = x.Name,
               IdString = x.IdString,
               Albums = x.Albums.Select(z => new AlbumViewModel()
               {
                   ArtistName = x.Name,
                   ArtistIdString = x.IdString,
                   IdString = z.IdString,
                   Name = z.Name
                
               }).ToList()

            }).ToListAsync();

            return new
            {
                Succeeded = true,
                Artists = result
            };
        }
        public async Task<object> Get(string idString)
        {

            var model = await _context.Artists
                .Where(x => x.IdString == idString)
                .Include(x => x.Albums)
                .ThenInclude(x => x.Songs)
                .Include(x => x.Albums)
                .ThenInclude(x => x.Cover)
                .FirstOrDefaultAsync();
            if (model == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFound" } }
                };

            var modelVM = new ArtistViewModel()
            {
                Name = model.Name,
                IdString = model.IdString,
                Albums = model.Albums.Select(z => new AlbumViewModel()
                {
                    ArtistName = model.Name,
                    ArtistIdString = model.IdString,
                    IdString = z.IdString,
                    Name = z.Name,
                    Cover = new FileViewModel()
                    {
                        Path = z.Cover.Path,
                    },
                    Songs = z.Songs.Select(y => new SongViewModel()
                    {
                        Name = y.Name
                    }).ToList()

                }).ToList()
            };
            return new
            {
                Succeeded = true,
                Artist = modelVM
            };
        }
        public async Task<object> Update(ArtistViewModel model)
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

