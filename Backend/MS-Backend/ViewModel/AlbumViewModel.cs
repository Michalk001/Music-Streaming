using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ViewModel
{
    public class AlbumViewModel
    {
        public string IdString { get; set; }
        public string Name { get; set; }
        public string ArtistIdString { get; set; }
        public string ArtistName { get; set; }
        public List<SongViewModel> Songs { get; set; }
        public FileViewModel Cover { get; set; }
    }
}
