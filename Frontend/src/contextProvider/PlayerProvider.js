import { PlayerContext } from '../context/PlayerContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer } from "react";
import { AlbumFetch } from "../featchApi/AlbumFetch";

export const PlayerProvider = (props) => {

    const albumF = new AlbumFetch();
    const [songsPlaylist, setSongsPlaylist] = useState(null)
    const [currentySongIndex, setCurrentySongIndex] = useState(0)
    const [quantitySong, setQuantitySong] = useState(0)
    const setSongs = async (id) => {

        const res = await albumF.getAlbum(id);
        let songs = [];
        console.log(res);
        res.playlist.songs.map(x => {
            songs.push(
                {
                    Name: x.name,
                    Path: x.path
                }
            )
        })
        const obj = {
            Name: res.playlist.name,
            ArtistName: res.playlist.artistName,
            Songs: songs,
            Cover: res.playlist.cover.path
        }
        setQuantitySong(songs.length - 1)

        setSongsPlaylist(obj);
      

    }
    const nextSong = () => {

        if (currentySongIndex + 1 <= quantitySong)
            setCurrentySongIndex(currentySongIndex + 1)
        else {
            setCurrentySongIndex(0)
        }
       
    }
    const prevSong = () => {
        if (currentySongIndex > 0) {
            setCurrentySongIndex(currentySongIndex - 1)
        }
    }
    return (
        <PlayerContext.Provider
            value={
                {
                    songsPlaylist,
                    setSongs,
                    currentySongIndex,
                    nextSong,
                    prevSong
                }
            }
        >
            {props.children}
        </PlayerContext.Provider>
    );

}