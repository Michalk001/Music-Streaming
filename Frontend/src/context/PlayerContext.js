import React from "react";

export const PlayerContext = React.createContext({

    songsPlaylist: [],
    currentySongIndex: 0,
    setAlbum: async () => { },
    setFavorit:async  () => { },
    nextSong: () => { },
    prevSong: () => { },
    play: async () => {},
    isFavoritCurrentSong: () => {},
    addFavorit: () => {},
    removeFavorit: () => {},
    currentySong: () =>{},
    createFavoritIdList: ()=>{},
    isPlayed: () =>{},
    pause: async () =>{},
    mute: (mute) => {},
    isMuted: false,
    currentTime: 0,
    setTimeMusic: (x)=>{},
    progresBarWidth: () =>{},
    setTimeMusicByKnob: () =>{},
    setVolume: (x) =>{},
    progresBarVolumeWidth: ()=>{},
    setVolumeByKnob: ()=>{},
    setSong: (number)=>{},
    setPlaylist : async (idPlaylist) =>{}
})

