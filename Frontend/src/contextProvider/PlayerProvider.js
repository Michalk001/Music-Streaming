import { PlayerContext } from '../context/PlayerContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer } from "react";
import { AlbumFetch } from "../featchApi/AlbumFetch";
import { FavoritFetch } from "../featchApi/FavoritFetch";

export const PlayerProvider = (props) => {

    const albumF = new AlbumFetch();
    const favoritF = new FavoritFetch();
    const [songsPlayList, setSongsPlayList] = useState(null)
    const [currentySongIndex, setCurrentySongIndex] = useState(0)
    const [quantitySong, setQuantitySong] = useState(0)
    const [audioOb, setAudioOb] = useState(null);
    const [favoritId, setFavoritId] = useState([])
    const setAlbum = async (id) => {

        const res = await albumF.getAlbum(id);
        let songs = [];
        res.playlist.songs.map(x => {
            songs.push(
                {
                    Name: x.name,
                    Path: x.path,
                    Length: x.length,
                    IdString: x.idString
                }
            )
        })
        if (songs.length <= 0) {
            setQuantitySong(0)
            setSongsPlayList(null)
            audioOb.src = null;
            audioOb.load();
            return
        }

        const obj = {
            Name: res.playlist.name,
            ArtistName: res.playlist.artistName,
            Songs: songs,
            Cover: res.playlist.cover.path,
            IdString: res.playlist.idString
        }
        setQuantitySong(songs.length - 1)
        setSongsPlayList(obj);
        playAfteChange();

    }

    const setPlaylist = async (idPlaylist) => {
        let result = []
        if (idPlaylist == null)
            return;
        await fetch(`${config.apiRoot}/api/Playlist/${idPlaylist}`, {
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
        console.log(result)
        if (!result.succeeded)
            return;
    }


    const setFavorit = async () => {

        const res = await favoritF.getFavorit();
        let songs = [];

        res.favorit.songs.map(x => {
            songs.push(
                {
                    Name: x.name,
                    Path: x.path,
                    Length: x.length,
                    IdString: x.idString
                }
            )


        })
        createFavoritIdList(res.favorit.songs)
        if (songs.length <= 0) {
            setQuantitySong(0)
            setSongsPlayList(null)
            audioOb.src = null;
            audioOb.load();
            return
        }
        const obj = {
            Songs: songs,

        }
        setQuantitySong(songs.length - 1)
        setSongsPlayList(obj);
        playAfteChange();

    }

    const isFavoritCurrentSong = () => {

        if (songsPlayList == null)
            return false;

        const isFavorit = favoritId.find((x) => {

            return x.id == songsPlayList.Songs[currentySongIndex].IdString
        })
        if (isFavorit == undefined)
            return false;

        return true;
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
    const changeSong = (id) => {
        if (id <= quantitySong) {
            setCurrentySongIndex(id)
            return;
        }
        setCurrentySongIndex(0)
    }
    const setAudio = (audio) => {
        setAudioOb(audio)

    }
    const playAfteChange = () => {

        if (!audioOb)
            return
        if (!audioOb.paused) {
            audioOb.load()
            audioOb.play();
            return
        }
        audioOb.load()
    }

    const play = () => {
        if (!audioOb)
            return
        audioOb.load()
        audioOb.play();
    }

    const addFavorit = (id) => {
        const res = favoritF.addFavorit(id)
        setFavoritId([...favoritId, { id: id }])
    }

    const removeFavorit = (id) => {
        const res = favoritF.removeFavorit(id)
        const arrayTMP = favoritId.filter((x) => {
            return x.id != id
        })
        console.log(arrayTMP)
        setFavoritId(arrayTMP)
    }

    const createFavoritIdList = async (listOptional = null) => {
        let songsId = []
        let songs = null
        if (listOptional == null) {
            const res = await favoritF.getFavorit();
            if (res.succeeded)
                songs = res.favorit.songs;

        }
        else
            songs = listOptional;

        if (songs == null)
            return;
        songs.map(x => {
            songsId.push({ id: x.idString });
        })
        setFavoritId(songsId)
    }


    const currentySong = () => {
        if (songsPlayList == null)
            return null;
        if (songsPlayList.Songs.length == 0)
            return null;
        return songsPlayList.Songs[currentySongIndex];

    }
    useEffect(() => {
        createFavoritIdList();
    }, [])

    useEffect(() => {

    }, [favoritId])

    return (
        <PlayerContext.Provider
            value={
                {
                    songsPlayList,
                    setAlbum,
                    currentySongIndex,
                    currentySong,
                    nextSong,
                    prevSong,
                    changeSong,
                    setAudio,
                    playAfteChange,
                    play,
                    setFavorit,
                    isFavoritCurrentSong,
                    addFavorit,
                    removeFavorit,
                    createFavoritIdList,
                    setPlaylist
                }
            }
        >
            {props.children}
        </PlayerContext.Provider>
    );

}