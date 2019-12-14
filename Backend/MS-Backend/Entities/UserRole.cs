using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MS_Backend.Entities
{
    public class UserRole : IdentityUserRole<Guid>
    {
        public UserRole() : base()
        {

        }
        public virtual Role Role { get; set; }
        public virtual User User { get; set; }
    }
}
