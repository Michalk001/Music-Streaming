using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class SongPlaylist
    {
        public Song Song { get; set; }
        public Playlist Playlist { get; set; }

        public Guid SongId { get; set; }
        public Guid PlaylistId { get; set; }
    }
}
