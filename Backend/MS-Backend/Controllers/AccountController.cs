using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MS_Backend.Entities;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;

namespace MS_Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _account;
        private readonly UserManager<User> _userManager;
        public AccountController(IAccountService account, UserManager<User> userManager)
        {
            _account = account;
            _userManager = userManager;
        }



        [HttpPost]
        public async Task<JsonResult> Login([FromBody] LoginUserViewModel model)
        {
            var result = await _account.Login(model);
            return new JsonResult(result);

        }
        [HttpPost]
        public async Task<JsonResult> Register([FromBody] RegisterUserViewModel model)
        {
            var result = await _account.Register(model);
            return new JsonResult(result);
        }
    }
}
