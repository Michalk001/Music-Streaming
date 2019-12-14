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
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        public AlbumController(IAlbumService albumService)
        {
            _albumService = albumService;
        }
        // GET: api/Album
        // GET: api/Artist
        [HttpGet]
        public async Task<JsonResult> Get()
        {
            var artists = await _albumService.Get();
            return new JsonResult(artists);
        }

        // GET: api/Artist/5
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(string id)
        {
            var artist = await _albumService.Get(id);
            return new JsonResult(artist);
        }

        // POST: api/Artist
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] AlbumViewModel model)
        {
            var result = await _albumService.Save(model);
            return new JsonResult(result);

        }


        // PUT: api/Album/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
