using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;

namespace MS_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        IPlaylistService _playlistService;
        public PlaylistController(IPlaylistService playlistService)
        {
            _playlistService = playlistService;
        }
        // GET: api/Playlist
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        [HttpGet("CurrentUser")]
        public async Task<JsonResult> CurrentUser()
        {
            string token = Request.Headers["Authorization"];
            var res = await _playlistService.GetByCurrentUser(token);
            return new JsonResult(res);
        }
        // GET: api/Playlist/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(string id)
        {
            var res = await _playlistService.Get(id);

            return new JsonResult(res);

        }

        // POST: api/Playlist
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] PlaylistViewModel model)
        {
            string token = Request.Headers["Authorization"];
            var res = await _playlistService.CreatePlaylist(model, token);
            return new JsonResult(res);
        }

        // PUT: api/Playlist/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(string id)
        {
            var res = await _playlistService.RemovePlaylist(id);
            return new JsonResult(res);
        }

       
    }
}
