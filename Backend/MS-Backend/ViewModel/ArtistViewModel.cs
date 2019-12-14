using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ViewModel
{
    public class ArtistViewModel
    {
        public string Name { get; set; }
        public string IdSting { get; set; }
        public List<AlbumViewModel> Albums { get; set; }
    }
}
