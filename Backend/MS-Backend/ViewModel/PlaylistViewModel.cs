using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ViewModel
{
    public class PlaylistViewModel
    {

        public string IdString { get; set; }
        public string Name { get; set; }
        public AlbumViewModel Playlist { get; set; }
        public string User { get; set; }
    }
}
