import React from "react";

export const PlayerContext = React.createContext({

    songsPlaylist: [],
    currentySongIndex: 0,
    setAlbum: () => { },
    setFavorit: () => { },
    nextSong: () => { },
    prevSong: () => { },
    play: () => {},
    isFavoritCurrentSong: () => {},
    addFavorit: () => {},
    removeFavorit: () => {},
    currentySong: () =>{},
    createFavoritIdList: ()=>{},
    isPlayed: () =>{},
    pause: () =>{},
    mute: (mute) => {},
    isMuted: false,
    currentTime: 0,
    setTimeMusic: (x)=>{},
    progresBarWidth: () =>{},
    setTimeMusicByKnob: () =>{},
    setVolume: (x) =>{},
    progresBarVolumeWidth: ()=>{},
    setVolumeByKnob: ()=>{},
})

