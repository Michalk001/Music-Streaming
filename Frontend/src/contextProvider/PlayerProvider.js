import { PlayerContext } from '../context/PlayerContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { AlbumFetch } from "../featchApi/AlbumFetch";
import { FavoritFetch } from "../featchApi/FavoritFetch";
import config from '../config.json'
import { InfoBoxContext } from "../context/InfoBoxContext";

export const PlayerProvider = (props) => {

    const albumF = new AlbumFetch();
    const favoritF = new FavoritFetch();
    const [songsPlayList, setSongsPlayList] = useState(null)
    const [currentySongIndex, setCurrentySongIndex] = useState(0)
    const [quantitySong, setQuantitySong] = useState(0)
    const [audioOb, setAudioOb] = useState(null);
    const [favoritId, setFavoritId] = useState([])
    const [isPaused, setIsPaused] = useState(true)
    const [audio] = useState(new Audio())
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0)
    const [timer, setTimer] = useState(null)
    const contextInfoBox = useContext(InfoBoxContext);

    const isPlayed = () => {
        return !isPaused;
    }

    const loadMusic = () => {
        if (songsPlayList == null)
            return
        if (audio == null)
            return
        audio.src = `${config.apiRoot}/${currentySong().Path}`
        audio.load();
    }


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
            audio.src = null;
            audio.load();
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
        loadMusic();

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
        loadMusic()
        playAfteChange();

    }
    const prevSong = () => {
        const timeToBack = 5.0;
        if (audio.currentTime < timeToBack) {
            audio.currentTime = 0.0;
            return
        }
        if (currentySongIndex > 0) {
            setCurrentySongIndex(currentySongIndex - 1)
        }
        loadMusic()
        playAfteChange();
    }


    const playAfteChange = () => {

        if (!isPaused) {
            audio.load()
            audio.play();
        }

    }

    const play = () => {
        audio.play();
        updateCurrentTime()
        if (timer != null) {
            clearInterval(timer)
        }
        setTimer(setInterval(() => {
            updateCurrentTime()
        }, 100)
        )
        setIsPaused(false)

    }
    const updateCurrentTime = () => {
        if (audio != null)
            setCurrentTime(audio.currentTime)
    }


    const pause = () => {
        audio.pause();
        clearInterval(timer)
        updateCurrentTime()
        setTimer(null);
        setIsPaused(true)
    }

    const mute = (mute) => {
        audio.muted = mute
        setIsMuted(mute)
    }


    const addFavorit = async (id) => {
        const res = await favoritF.addFavorit(id)
        if (res.succeeded) {
            contextInfoBox.addInfo("Dodano do ulubionych")
            setFavoritId([...favoritId, { id: id }])
        }
        else {
            contextInfoBox.addInfo("Wystąpił błąd, spróbuj później")
        }
    }

    const removeFavorit = async (id) => {
        const res = await favoritF.removeFavorit(id)
        if (res.succeeded) {
            const arrayTMP = favoritId.filter((x) => {
                return x.id != id
            })
            contextInfoBox.addInfo("Usunięto z ulubionych")
            setFavoritId(arrayTMP)
        }
        else {
            contextInfoBox.addInfo("Wystąpił błąd, spróbuj później")
        }
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
        return songsPlayList.Songs[currentySongIndex]
    }

    const setTimeMusic = (x) => {

        if (x.target.id == "player-bar") {
            const lengthBar = x.target.getBoundingClientRect().width;
            const positionClick = x.nativeEvent.offsetX;
            const duration = audio.duration;
            const timeToSet = positionClick * duration / lengthBar;
            audio.currentTime = timeToSet;
        }

    }

    const progresBarWidth = () => {
        const progress = ((audio.currentTime / audio.duration * 100));
        return progress
    }

    const setTimeMusicByKnob = () => {
        const updateTimeOnMove = eMove => {
            if (eMove.target.id == "player-bar-knob") {
                audio.currentTime = audio.currentTime + (eMove.offsetX * eMove.movementX / (audio.duration));
            }
            if (eMove.target.id == "player-bar") {
                const lengthBar = document.getElementById("player-bar").getBoundingClientRect().width;
                const positionClick = eMove.offsetX;
                const duration = audio.duration;
                const timeToSet = positionClick * duration / lengthBar;
                audio.currentTime = timeToSet;
            }
        };

        document.addEventListener("mousemove", updateTimeOnMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", updateTimeOnMove);
        });

    }

    const setVolume = (x) => {

        if (x.target.id == "volume-bar") {

            const lengthBar = x.target.getBoundingClientRect().width;
            const positionClick = x.nativeEvent.offsetX;
            audio.volume = positionClick / lengthBar;
            audio.muted = false;
            setIsMuted(false)
            if (audio.volume <= 0.05) {
                audio.volume = 0.0;
                audio.muted = true;
                setIsMuted(true)
            }
            if (audio.volume >= 0.95)
                audio.volume = 1.0;
        }

    }

    const progresBarVolumeWidth = () => {
        const progress = ((audio.volume * 100));
        return progress
    }

    const setVolumeByKnob = () => {
        const updateVolumeOnMove = eMove => {

            if (eMove.target.id == "volume-bar") {
                const lengthBar = document.getElementById("volume-bar").getBoundingClientRect().width;
                const positionClick = eMove.offsetX;
                audio.volume = positionClick / lengthBar;
                audio.muted = false;
                setIsMuted(false)
                if (audio.volume <= 0.05) {
                    audio.volume = 0.0;
                    audio.muted = true;
                    setIsMuted(true)
                }
                if (audio.volume >= 0.95)
                    audio.volume = 1.0;

            }
        };

        document.addEventListener("mousemove", updateVolumeOnMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", updateVolumeOnMove);
        });

    }


    useEffect(() => {

        createFavoritIdList();
    }, [])


    useEffect(() => {

    }, [currentTime])

    useEffect(() => {
        loadMusic();
    }, [songsPlayList])


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
                    play,
                    setFavorit,
                    isFavoritCurrentSong,
                    addFavorit,
                    removeFavorit,
                    createFavoritIdList,
                    setPlaylist,
                    isPlayed,
                    pause,
                    mute,
                    isMuted,
                    currentTime,
                    setTimeMusic,
                    progresBarWidth,
                    setTimeMusicByKnob,
                    setVolume,
                    progresBarVolumeWidth,
                    setVolumeByKnob
                }
            }
        >

            {props.children}
        </PlayerContext.Provider>
    );

}