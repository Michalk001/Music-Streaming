using Microsoft.EntityFrameworkCore;
using MS_Backend.Entities;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Drawing;
using Microsoft.AspNetCore.Hosting;
using NAudio.Wave;

namespace MS_Backend.Services
{
    public class AlbumService : IAlbumService
    {
        DBContext _context;
        private IWebHostEnvironment _env;
        public AlbumService(IWebHostEnvironment env,DBContext context)
        {
            _env = env;
            _context = context;
        }
        public async Task<object> Save(AlbumViewModel model)
        {
                string idString =( new string(model.Name.Select(x => char.IsLetterOrDigit(x) ? x : '-').ToArray())+ Guid.NewGuid().ToString()
                    .Substring(0, 8)).ToLower();
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

            File cover = new File();
            if (model.Cover.Type.Contains("image"))
            {
                string hash = (model.Cover.Base64.Replace("data:" + model.Cover.Type + ";base64,", "")
                    .Substring(0, 60) + Guid.NewGuid().ToString()
                    .Substring(0, 8)).Replace("/", "")
                    .Replace("-", "") + "." + model.Cover.Type.Replace("image/", "");
                var byteBuffer = Convert.FromBase64String(model.Cover.Base64.Replace("data:" + model.Cover.Type + ";base64,", ""));
                var webRoot = _env.WebRootPath;
                var filePath = System.IO.Path.Combine(webRoot, "images\\cover");
                filePath = System.IO.Path.Combine(filePath, hash);
                System.IO.File.WriteAllBytes(filePath, byteBuffer);
                cover = new File()
                {
                    Id = Guid.NewGuid(),
                    Name = model.Cover.Name,
                    Hash = hash,
                    Path = "images/cover/" + hash,
                    Type = model.Cover.Type.Split('/').FirstOrDefault()
                };
            }

            List<Song> songs = new List<Song>();
            if(model.Songs != null)
            {
                foreach(var item in model.Songs)
                {
                    if (item.Type.Contains("audio"))
                    {
                        string hash = (item.Base64.Replace("data:" + item.Type + ";base64,", "")
                       .Substring(0, 50) + Guid.NewGuid().ToString()
                       .Substring(0, 8)).Replace("/", "")
                       .Replace("-", "") + "." + item.Type.Replace("audio/", "");
                        var byteBuffer = Convert.FromBase64String(item.Base64.Replace("data:" + item.Type + ";base64,", ""));
                        var webRoot = _env.WebRootPath;
                        var filePath = System.IO.Path.Combine(webRoot, "music");
                        filePath = System.IO.Path.Combine(filePath, hash);
                        System.IO.File.WriteAllBytes(filePath, byteBuffer);
                        var songFile = new File()
                        {
                            Id = Guid.NewGuid(),
                            Name = item.Name,
                            Hash = hash,
                            Path = "music/" + hash,
                            Type = item.Type.Split('/').FirstOrDefault()
                        };
                        /*  string idStringSong = new string((item.Name.Select(x => char.IsLetterOrDigit(x) ? x : '-').ToArray()) 
                              + Guid.NewGuid().ToString()
                              .Substring(0, 12)).ToLowe*/
                         string idStringSong = (item.Name
                              + Guid.NewGuid().ToString()
                              .Substring(0, 12)).ToLower();
                        var a = filePath;
                        Mp3FileReader songTags = new Mp3FileReader(filePath);
                        songs.Add(new Song()
                        {
                            SongFile = songFile,
                            Name = item.Name,
                            IdString = idStringSong,
                            Length = songTags.TotalTime.TotalSeconds

                        }); 
                  
                    }
                }

            }



            Album album = new Album()
            {
               Songs = songs,
               IdString = idString,
               Artist = artist,
               Name = model.Name,
               Id = Guid.NewGuid(),
               Cover = cover,
               
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
                Cover = new FileViewModel()
                {
                    Type = x.Cover.Type,
                    Path = x.Cover.Path,
                    Name = x.Cover.Name
                },
                Songs = x.Songs.Select(x => new SongViewModel() 
                {   
                    IdString = x.IdString,
                    Length = x.Length.ToString(),
                    Name = x.Name,
                    Path = x.SongFile.Path
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

            var model = await _context.Albums
                .Where(x => x.IdString == idString)
                .Include(x => x.Artist)
                .Include(x => x.Cover)
                .Include(x => x.Songs)
                .ThenInclude(x => x.SongFile)
                .FirstOrDefaultAsync();
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
                Cover = new FileViewModel()
                {
                    Name = model.Cover.Name,
                    Path= model.Cover.Path,
                    Type = model.Cover.Type
                },
                Songs = model.Songs.Select(x => new SongViewModel()
                {
                    IdString = x.IdString,
                    Length = x.Length.ToString(),
                    Name = x.Name,
                    Path = x.SongFile.Path,
                    Album = new AlbumViewModel()
                    {
                        Name = x.Album.Name,
                        IdString = x.Album.IdString,
                        ArtistName = x.Album.Artist.Name,
                        ArtistIdString = x.Album.Artist.IdString
                    }

                }).ToList()

            };
            return new
            {
                Succeeded = true,
                Playlist = modelVM
            };
        }
        public async Task<object> Update(AlbumViewModel VM)
        {
            var model = await _context.Albums
                 .Where(x => x.IdString == VM.IdString)
                 .Include(x => x.Artist)
                 .Include(x => x.Cover)
                 .Include(x => x.Songs)
                 .ThenInclude(x => x.SongFile)
                 .FirstOrDefaultAsync();
            if (model == null)
                return new
                {
                    Succeeded = false,
                    Errors = new[] { new { Code = "NotFound" } }
                };


            model.Name = VM.Name;
            model.Songs =  model.Songs.Join(VM.Songs, song => song.IdString, songVM => songVM.IdString, (song, _) => song).ToList() ;
            try
            {
                foreach (var item in VM.Songs)
                {
                    if (item.Base64 != null)
                    {
                        string hash = (item.Base64.Replace("data:" + item.Type + ";base64,", "")
                           .Substring(0, 60) + Guid.NewGuid().ToString()
                           .Substring(0, 8)).Replace("/", "")
                           .Replace(' ', '-')
                           .Replace("-", "") + "." + item.Type.Replace("audio/", "");
                        var byteBuffer = Convert.FromBase64String(item.Base64.Replace("data:" + item.Type + ";base64,", ""));
                        var webRoot = _env.WebRootPath;
                        var filePath = System.IO.Path.Combine(webRoot, "music");
                        filePath = System.IO.Path.Combine(filePath, hash);
                        System.IO.File.WriteAllBytes(filePath, byteBuffer);
                        var songFile = new File()
                        {
                            Id = Guid.NewGuid(),
                            Name = item.Name,
                            Hash = hash,
                            Path = "music/" + hash,
                            Type = model.Cover.Type.Split('/').FirstOrDefault()
                        };
                        string idStringSong = (item.Name
                            + Guid.NewGuid().ToString()
                            .Substring(0, 8)).ToLower()
                            .Replace('.', '-')
                            .Replace(' ', '-');
                        Mp3FileReader songTags = new Mp3FileReader(filePath);
                        var song = _context.Songs.Add(new Song()
                        {

                            SongFile = songFile,
                            Name = item.Name,
                            IdString = idStringSong,
                            Length = songTags.TotalTime.TotalSeconds

                        });
                        var res = await _context.SaveChangesAsync();
                        model.Songs.Add(song.Entity);
                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return new
                {
                    Succeeded = false
                };
            }
            return new
            {
                Succeeded = true
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
