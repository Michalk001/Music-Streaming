
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class User : IdentityUser<Guid>
    {
        public User() : base()
        {

        }

       

        public virtual List<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual List<Playlist> Playlists { get; set; } = new List<Playlist>();
    }
}

