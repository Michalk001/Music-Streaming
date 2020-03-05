using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class Playlist
    {
        public Playlist()
        {
           
        }
        public Guid Id { get; set; }
        public string IdString { get; set; }
        public virtual User User { get; set; }
        public bool IsFavorit { get; set; } = false;
        public bool IsPrivate { get; set; } = false;
        public string Name { get; set; }
        public List<SongPlaylist> Songs { get; set; } = new List<SongPlaylist>();
    }
}
