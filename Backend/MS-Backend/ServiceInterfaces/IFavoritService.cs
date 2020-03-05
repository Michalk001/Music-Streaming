using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ServiceInterfaces
{
    public interface IFavoritService
    {
        Task<object> Get( string token);
        Task<object> Add(string token, string idSong);
        Task<object> Remove(string token, string idSong);

    }
}
