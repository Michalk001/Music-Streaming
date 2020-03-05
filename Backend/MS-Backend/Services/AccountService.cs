using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MS_Backend.Entities;
using MS_Backend.Models;
using MS_Backend.ServiceInterfaces;
using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MS_Backend.Services
{
    public class AccountService : IAccountService
    {


        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IOptions<Settings> _settings;
        public AccountService( UserManager<User> userManager,
            SignInManager<User> signInManager, RoleManager<Role> roleManager
            , IOptions<Settings> settings)
        {
          
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _settings = settings;
        }

     

        public async Task<object> Login(LoginUserViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            if (result.Succeeded)
            {
                var appUser = _userManager.Users.Include(x => x.UserRoles).ThenInclude(x => x.Role).SingleOrDefault(r => r.UserName == model.UserName);

                return new
                {
                    succeeded = result.Succeeded,
                    Token = GenerateJwtToken(model.UserName, appUser),
                };
            }
            return new
            {
                Succeeded = false

            };
            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }

        public async Task<object> Register([FromBody] RegisterUserViewModel model)
        {
            try
            {
               
                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                };
                var guid = Guid.NewGuid();
                var favorit = new Playlist()
                {
                    IsFavorit = true,
                    Id = guid,
                };
                favorit.IdString = guid.ToString();

                user.Playlists.Add(favorit);
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, false);
                    var checkRole = await _roleManager.RoleExistsAsync("User");
                    user = await _userManager.FindByNameAsync(user.UserName);
                    if (user != null)
                    {
                        if (!checkRole)
                            await _roleManager.CreateAsync(new Role("User"));
                        var Role = await _roleManager.FindByNameAsync("User");
                        var userRoles = (user.UserRoles);
                        userRoles.Add(new UserRole()
                        {
                            Role = Role,
                            User = user,
                            RoleId = Role.Id,
                            UserId = user.Id
                        });
                        user.UserRoles = userRoles;
                        var r = await _userManager.UpdateAsync(user);

                    }
                    return new
                    {
                      
                        Succeeded = true,
                        Token = GenerateJwtToken(model.UserName, user),
                    };
                }
            }
            catch
            {
                return new
                {
                    Succeeded = false

                };
            }
            return new
            {
                Succeeded = false

            };
            throw new ApplicationException("UNKNOWN_ERROR");
        }

        private object GenerateJwtToken(string userName, User user)
        {

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            foreach (var role in user.UserRoles)
            {
                claims.Add(new Claim("role", role.Role.Name));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Value.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_settings.Value.JwtIssuer,
              _settings.Value.JwtIssuer,
              claims,
              expires: DateTime.UtcNow.AddMinutes(_settings.Value.JwtExpireMinutes),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
