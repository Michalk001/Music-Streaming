import { PlaylistContext } from '../context/PlaylistContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import config from '../config.json'
import { InfoBoxContext } from "../context/InfoBoxContext";


export const PlaylistProvider = (props) => {

    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [showAddSongPlaylist, setShowAddSongPlaylist] = useState(false);
    const [idSongAdd, setIdSongAdd] = useState(null)
    const contextInfoBox = useContext(InfoBoxContext);

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
        if (result.succeeded) {
            contextInfoBox.addInfo("Dodano do playlisty")
           
        }
        else {
            contextInfoBox.addInfo("Wystąpił błąd, spróbuj później")
        }
        setShowAddSongPlaylist(false)
    }
    const removeSongPlaylist = async (idPlaylist,idSong) => {
        let result = []
        if (idSong == null)
            return;
        await fetch(`${config.apiRoot}/api/SongToPlaylist/${idPlaylist}/${idSong}`, {
            method: "delete",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;


            })
     
            if (result.succeeded) {
                contextInfoBox.addInfo("Usunięto z playlisty")
               
            }
            else {
                contextInfoBox.addInfo("Wystąpił błąd, spróbuj później")
            }
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
                    addSongPlaylist,
                    removeSongPlaylist
                }
            }
        >
            {props.children}
        </PlaylistContext.Provider>
    );

}
