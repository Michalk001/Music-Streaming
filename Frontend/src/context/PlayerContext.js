import React from "react";

export const PlayerContext = React.createContext({

    songsPlaylist: [],
    currentySongIndex: 0,
    setAlbum: () => { },
    setFavorit: () => { },
    nextSong: () => { },
    prevSong: () => { },
    changeSong: (id) => { },
    setAudio: (audio) => { },
    playAfteChange: () => { },
    play: () => {},
    isFavoritCurrentSong: () => {},
    addFavorit: () => {},
    removeFavorit: () => {},
    currentySong: () =>{},
    createFavoritIdList: ()=>{}
})

