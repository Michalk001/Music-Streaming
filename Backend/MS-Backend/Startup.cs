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


            services.AddControllers();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
