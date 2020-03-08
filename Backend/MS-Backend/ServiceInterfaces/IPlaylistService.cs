using MS_Backend.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MS_Backend.ServiceInterfaces
{
    public interface IPlaylistService
    {
        Task<object> Get(string id);
        Task<object> CreatePlaylist(PlaylistViewModel model, string token);
        Task<object> RemovePlaylist(string idPlaylist);
        Task<object> AddSong(string idPlaylist, string idSong);
        Task<object> RemoveSong(string idPlaylist, string idSong);

        Task<object> GetByCurrentUser(string token);
    }
}
