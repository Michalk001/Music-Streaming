using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.Entities
{
    public class Song
    {
        public Guid Id { get; set; }
        public string IdString { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public virtual Album Album { get; set; }
        public int Length { get; set; }
        public virtual User UploadUser { get; set; }
        
           
    }
}
