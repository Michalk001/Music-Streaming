import { PlayerContext } from '../context/PlayerContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext, useRef } from "react";
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
    const [favoritId, setFavoritId] = useState([])
    const [isPaused, setIsPaused] = useState(true)

    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0)
    const [timer, setTimer] = useState(null)
    const contextInfoBox = useContext(InfoBoxContext);
    const [currentIdPlaylist, setCurrentIdPlaylist] = useState(null)


    const isPlayed = () => {
        return !isPaused;
    }

    const audio = useRef();

    const loadMusic = async () => {
        if (songsPlayList == null)
            return
        if (audio.current == null)
            return
        audio.current.src = `${config.apiRoot}/${currentySong().Path}`
        await audio.current.load();
            await playAfteChange();
    }


    const setAlbum = async (id) => {

        const res = await albumF.getAlbum(id);
        if (!res.succeeded) {
            return
        }
        if (currentIdPlaylist == res.playlist.idString)
            return;

        setCurrentIdPlaylist(res.playlist.idString)
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
            audio.current.src = null;
            audio.current.load();
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

        loadMusic();
        playAfteChange();
    }

    const setFavorit = async () => {
        const res = await favoritF.getFavorit();
        let songs = [];
        console.log(res)
        if (!res.succeeded) {
            return
        }
        if (currentIdPlaylist == res.favorit.idString)
            return;
        setCurrentIdPlaylist(res.favorit.idString)
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
            audio.current.src = null;
            audio.current.load();
            return
        }
        const obj = {
            Songs: songs,

        }
        setQuantitySong(songs.length - 1)
        setSongsPlayList(obj);
        loadMusic();
        playAfteChange();
    }
    const setPlaylist = async (idPlaylist) => {
        if (currentIdPlaylist == idPlaylist)
            return false;
        setCurrentIdPlaylist(idPlaylist)
      
        let result = []
        if (idPlaylist == null)
        return false;
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
        return false;

        let songs = [];
        result.playlist.playlist.songs.map(x => {
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
            audio.current.src = null;
            await audio.current.load();
            return false;
        }
        const obj = {
            Songs: songs,

        }
        setQuantitySong(songs.length - 1)
        setSongsPlayList(obj);
        await loadMusic()
        return true;
    
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

        if (currentySongIndex + 1 <= quantitySong) {
            setCurrentySongIndex(currentySongIndex + 1)
        }
        else {
            setCurrentySongIndex(0)
        }
    }

    const prevSong = () => {
        const timeToBack = 5.0;
        if (audio.current.currentTime < timeToBack) {
            audio.current.currentTime = 0.0;
            return
        }
        if (currentySongIndex > 0) {
            setCurrentySongIndex(currentySongIndex - 1)
        }
    }


    const playAfteChange = async  () => {

        if (!isPaused) {
            await  play();
        }

    }

    const play = async () => {
      await  audio.current.play();

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
        if (audio.current != null)
            setCurrentTime(audio.current.currentTime)
    }


    const pause = async () => {
        await audio.current.pause();
        clearInterval(timer)
        updateCurrentTime()
        setTimer(null);
        setIsPaused(true)
    }

    const mute = (mute) => {
        audio.current.muted = mute
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
            const duration = audio.current.duration;
            const timeToSet = positionClick * duration / lengthBar;
            audio.current.currentTime = timeToSet;
        }

    }

    const progresBarWidth = () => {
        const progress = ((audio.current.currentTime / audio.current.duration * 100));
        return progress
    }

    const setTimeMusicByKnob = () => {
        const updateTimeOnMove = eMove => {
            if (eMove.target.id == "player-bar-knob") {
                audio.current.currentTime = audio.current.currentTime + (eMove.offsetX * eMove.movementX / (audio.current.duration));
            }
            if (eMove.target.id == "player-bar") {
                const lengthBar = document.getElementById("player-bar").getBoundingClientRect().width;
                const positionClick = eMove.offsetX;
                const duration = audio.current.duration;
                const timeToSet = positionClick * duration / lengthBar;
                audio.current.currentTime = timeToSet;
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
            audio.current.volume = positionClick / lengthBar;
            audio.current.muted = false;
            setIsMuted(false)
            if (audio.current.volume <= 0.05) {
                audio.current.volume = 0.0;
                audio.current.muted = true;
                setIsMuted(true)
            }
            if (audio.current.volume >= 0.95)
                audio.current.volume = 1.0;
        }

    }

    const progresBarVolumeWidth = () => {
        const progress = ((audio.current.volume * 100));
        return progress
    }

    const setVolumeByKnob = () => {
        const updateVolumeOnMove = eMove => {

            if (eMove.target.id == "volume-bar") {
                const lengthBar = document.getElementById("volume-bar").getBoundingClientRect().width;
                const positionClick = eMove.offsetX;
                audio.current.volume = positionClick / lengthBar;
                audio.current.muted = false;
                setIsMuted(false)
                if (audio.current.volume <= 0.05) {
                    audio.current.volume = 0.0;
                    audio.current.muted = true;
                    setIsMuted(true)
                }
                if (audio.current.volume >= 0.95)
                    audio.current.volume = 1.0;

            }
        };

        document.addEventListener("mousemove", updateVolumeOnMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", updateVolumeOnMove);
        });

    }


    const setSong = (number) => {
            setCurrentySongIndex(number)   
    }


    useEffect(() => {

        createFavoritIdList();
    }, [])

    const checkNextSong = () => {
        if (audio.current.currentTime >= audio.current.duration)
            nextSong();
    }

    useEffect(() => {
        checkNextSong();
    }, [currentTime])

    useEffect(() => {
        loadMusic()
        playAfteChange();
    }, [currentySongIndex])


    useEffect(() => {
        loadMusic();
        playAfteChange();
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
                    setVolumeByKnob,
                    setSong,
                    setPlaylist
                }
            }
        >
            <audio ref={audio} />
            {props.children}
        </PlayerContext.Provider>
    );

}