using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class Album
    {
        public Album()
        {
            this.Songs = new HashSet<Song>();
        }
     
        public Guid Id { get; set; }
        public string IdString { get; set; }
        public string Name { get; set; }
        public virtual Artist Artist { get; set; }
        public virtual ICollection<Song> Songs { get; set; }
    }
}
