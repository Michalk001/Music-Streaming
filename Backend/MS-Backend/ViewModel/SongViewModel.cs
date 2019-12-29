using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ViewModel
{
    public class SongViewModel
    {
        public string Name { get; set; }
        public string IdString { get; set; }
        public AlbumViewModel Album { get; set; }
        public string Path { get; set; }
        public string Length { get; set; }
        public string IdAlbumString { get; set; }
        public string Type { get; set; }
        public string Base64 { get; set; }
    }
}
