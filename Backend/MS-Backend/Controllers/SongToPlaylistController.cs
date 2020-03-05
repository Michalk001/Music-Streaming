using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MS_Backend.ServiceInterfaces;

namespace MS_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongToPlaylistController : ControllerBase
    {

        IPlaylistService _playlistService;
        public SongToPlaylistController(IPlaylistService playlistService)
        {
            _playlistService = playlistService;
        }


        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/SongToPlaylist/5
        [HttpGet("{id}", Name = "Get")]
        public  string Get(int id)
        {
            return "value";
        }

        // POST: api/SongToPlaylist
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/SongToPlaylist/5
        [HttpPut("{idPlaylist}/{idSong}")]
        public async Task<JsonResult> Put(string idPlaylist, string idSong)
        {
            string token = Request.Headers["Authorization"];
            var res = await _playlistService.AddSong(idPlaylist, idSong);
            return new JsonResult(res);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{idPlaylist}/{idSong}")]
        public async Task<JsonResult> Delete(string idPlaylist, string idSong)
        {
            string token = Request.Headers["Authorization"];
            var res = await _playlistService.RemoveSong(idPlaylist, idSong);
            return new JsonResult(res);
        }
    }
}
