import React from "react";

export const PlayerContext = React.createContext({
    
    songsPlaylist: [],
    currentySongIndex: 0,
    setSongs: () =>{},
    nextSong: () => {},
    prevSong: () => {}
})

