using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MS_Backend.Entities;
using MS_Backend.Models;
using MS_Backend.Services;
using MS_Backend.ServiceInterfaces;

namespace MS_Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            services.AddIdentity<User, Role>()
             .AddEntityFrameworkStores<DBContext>();

            services.Configure<Settings>(options =>
            {
                options.JwtKey = Configuration.GetSection("Jwt:JwtKey").Value;
                options.JwtIssuer = Configuration.GetSection("Jwt:JwtIssuer").Value;
                options.JwtExpireMinutes = int.Parse(Configuration.GetSection("Jwt:JwtExpireMinutes").Value);
            });

            services.AddDbContextPool<DBContext>(x => x.UseSqlServer(Configuration.GetConnectionString("MusicDB")));
            services.Configure<IdentityOptions>(options =>
            {

                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 0;
            });


            services.AddAuthentication(x => {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }
            )
            .AddJwtBearer(options =>
            {

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration.GetSection("Jwt:JwtIssuer").Value,
                    ValidAudience = Configuration.GetSection("Jwt:JwtIssuer").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("Jwt:JwtKey").Value)),
                    RoleClaimType = "role"
                };
            });


            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<IArtistService, ArtistService>();
            services.AddTransient<IAlbumService, AlbumService>();
            services.AddTransient<ISongService, SongService>();
            services.AddTransient<IFavoritService, FavoritService>();
            services.AddTransient<IPlaylistService, PlaylistService>();

            services.AddControllers();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();
            CreateRoles(services).Wait();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private async Task CreateRoles(IServiceProvider serviceProvider)
        {
            //adding customs roles : Question 1
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            var UserManager = serviceProvider.GetRequiredService<UserManager<User>>();
            string[] roleNames = { "Admin", "User"};
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await RoleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    //create the roles and seed them to the database: Question 2
                    roleResult = await RoleManager.CreateAsync(new Role(roleName));
                }
            }

            //Here you could create a super user who will maintain the web app
            var poweruser = new User
            {
                UserName = Configuration["AdminSettings:UserName"],
                Email = Configuration["AdminSettings:AdminUserEmail"],
            };

            string userPWD = Configuration["AdminSettings:UserPassword"];
            var _user = await UserManager.FindByEmailAsync(Configuration["AdminSettings:AdminUserEmail"]);

            if (_user == null)
            {
                var createPowerUser = await UserManager.CreateAsync(poweruser, userPWD);
                if (createPowerUser.Succeeded)
                {
                    //here we tie the new user to the role : Question 3
                    var user = await UserManager.FindByNameAsync(poweruser.UserName);
                    var Role = await RoleManager.FindByNameAsync("Admin");
                    var userRoles = (user.UserRoles);
                    userRoles.Add(new UserRole()
                    {
                        Role = Role,
                        User = user,
                        RoleId = Role.Id,
                        UserId = user.Id
                    });
                    user.UserRoles = userRoles;
                    await UserManager.UpdateAsync(user);
                }
            }
        }

    }
}
