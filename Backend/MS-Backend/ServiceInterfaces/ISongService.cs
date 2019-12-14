using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ServiceInterfaces
{
    public interface ISongService
    {
        Task<object> Save(SongViewModel model);
        Task<object> Get();
        Task<object> Get(string idString);
        Task<object> Remove(string idString);
        Task<object> Update(SongViewModel model);
    }
}
