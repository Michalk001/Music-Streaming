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
    public class FavoritController : ControllerBase
    {
        private IFavoritService _favoritService;
        public FavoritController(IFavoritService favoritService)
        {
            _favoritService = favoritService;
        }

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            string token = Request.Headers["Authorization"];
            var res  = await _favoritService.Get(token);
            return new JsonResult(res);
        }
        [HttpPut("{idSong}")]
        public async Task<JsonResult> Put(string idSong)
        {
            string token = Request.Headers["Authorization"];
            var res = await _favoritService.Add(token, idSong);
            return new JsonResult(res);
        }
        [HttpDelete("{idSong}")]
        public async Task<JsonResult> Delete(string idSong)
        {
            string token = Request.Headers["Authorization"];
            var res = await _favoritService.Remove(token, idSong);
            return new JsonResult(res);
        }
    }
}