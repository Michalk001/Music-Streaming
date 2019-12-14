using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class Artist
    {
        public Artist()
        {
            this.Albums = new HashSet<Album>();
        }
        public Guid Id { get; set; }
        public string IdString { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Album> Albums { get; set; }
    }
}
