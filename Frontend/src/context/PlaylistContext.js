import React from "react";

export const PlaylistContext = React.createContext({
    showCreatePlaylist: false,
    showPlaylistCreate: (choose) => { },
    downloadPlaylist: () => { },
    playlist: [],
    showPlaylistAddSong: (choose, idSong) => { },
    showAddSongPlaylist: false,
    idSongAdd: null,
    addSongPlaylist: (idPlaylist) => { },
    setPlaylist: (idPlaylist) => { },
    removeSongPlaylist: (idPlaylist,idSong) =>{},
    
})

