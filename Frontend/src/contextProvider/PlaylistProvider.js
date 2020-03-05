import { PlaylistContext } from '../context/PlaylistContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer } from "react";
import config from '../config.json'

export const PlaylistProvider = (props) => {

    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [showAddSongPlaylist, setShowAddSongPlaylist] = useState(false);
    const [idSongAdd, setIdSongAdd] = useState(null)
    const showPlaylistCreate = (choose) => {
        setShowCreatePlaylist(choose);
    }
    const showPlaylistAddSong = (choose, idSong) => {
        setIdSongAdd(idSong),
        setShowAddSongPlaylist(choose);
    }
    const addSongPlaylist = async (idPlaylist) => {
        if (idPlaylist == null)
        return;
        if (idSongAdd == null)
        return;
        let result = null;

        await fetch(`${config.apiRoot}/api/SongToPlaylist/${idPlaylist}/${idSongAdd}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })
        
        setShowAddSongPlaylist(false)
    }

    const downloadPlaylist = async () => {
        let result = null;

        await fetch(`${config.apiRoot}/api/Playlist/CurrentUser`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })
        if (result.succeeded == true) {
            setPlaylist(result.playlist);
        }
    
    }

    useEffect(() => {
        downloadPlaylist();
    }, [])
    useEffect(() => {

    }, [playlist])
    return (
        <PlaylistContext.Provider
            value={
                {
                    showCreatePlaylist,
                    showPlaylistCreate,
                    downloadPlaylist,
                    playlist,
                    showPlaylistAddSong,
                    showAddSongPlaylist,
                    idSongAdd,
                    addSongPlaylist
                }
            }
        >
            {props.children}
        </PlaylistContext.Provider>
    );

}
