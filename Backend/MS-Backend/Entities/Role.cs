using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class Role : IdentityRole<Guid>
    {
        public Role() : base()
        {

        }
        public Role(string name) : base(name)
        {

        }
        public Role(Guid guid) : base()
        {

        }
        public virtual List<UserRole> UserRoles { get; set; }
    }
}

