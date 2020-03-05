import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'
import { FavoritFetch } from '../../featchApi/FavoritFetch'
import { PlayerContext } from "../../context/PlayerContext";
import { PlaylistContext } from "../../context/PlaylistContext";

export const Player = () => {

    const favoritF = new FavoritFetch();

    const [isPlay, setIsPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [progressBarVolumeWidth, setProgressBarVolumeWidth] = useState(100);
    const [mouseDown, setMouseDown] = useState(false);
    const [isMute, setIsMute] = useState(true);
    const Pause = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        setIsPlay(false);
        audio.pause();

    }
    const Play = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return

        setIsPlay(true);
        audio.load();
        audio.play();
        setInterval(() => {

            UpdateProgresBar();
            GetCurrentTime();
        }, 100);

    }
    const ConvertDuration = (durationTmp) => {
        let duration = durationTmp
        if (typeof durationTmp == "string")
            duration = duration.replace(",", ".");
        const time = (Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2));
        return time;
    }

    const GetCurrentTime = () => {

        const audio = document.getElementById('playerAudio');
        if (!audio)
            return

        const time = ConvertDuration(audio.currentTime);
        setCurrentTime(time);
    }
    const UpdateProgresBar = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        const progress = ((audio.currentTime / audio.duration * 100));
        setProgressBarWidth(progress);
    }
    const UpdateVolumeBar = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        const progress = ((audio.volume * 100));
        setProgressBarVolumeWidth(progress);
    }
    const Reset = () => {

        setCurrentTime("0:00");
        setProgressBarWidth(0)
        const audio = document.getElementById('playerAudio');
        if (audio)
            audio.currentTime = 0

        return true
    }



    const setTimeMusic = (x) => {

        if (x.target.id == "player-bar") {
            const lengthBar = x.target.getBoundingClientRect().width;
            const audio = document.getElementById('playerAudio');
            const positionClick = x.nativeEvent.offsetX;
            const duration = audio.duration;
            const timeToSet = positionClick * duration / lengthBar;
            audio.currentTime = timeToSet;
        }

    }
    const setVolume = (x) => {

        if (x.target.id == "volume-bar") {

            const lengthBar = x.target.getBoundingClientRect().width;
            const audio = document.getElementById('playerAudio');
            const positionClick = x.nativeEvent.offsetX;

            audio.volume = positionClick / lengthBar;
            audio.muted = false;
            setIsMute(false);
            if (audio.volume <= 0.05) {
                audio.volume = 0.0;
                audio.muted = true;
                setIsMute(true);
            }
            if (audio.volume >= 0.95)
                audio.volume = 1.0;
            UpdateVolumeBar();
        }

    }

    const setTimeMusicByKnob = (x) => {
        const updateTimeOnMove = eMove => {
            const audio = document.getElementById('playerAudio');
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

    const setVolumeByKnob = (x) => {
        const updateVolumeOnMove = eMove => {
            const audio = document.getElementById('playerAudio');

            if (eMove.target.id == "volume-bar") {
                const lengthBar = document.getElementById("volume-bar").getBoundingClientRect().width;
                const positionClick = eMove.offsetX;
                audio.volume = positionClick / lengthBar;
                audio.muted = false;
                setIsMute(false);
                if (audio.volume <= 0.05) {
                    audio.volume = 0.0;
                    audio.muted = true;
                    setIsMute(true);
                }
                if (audio.volume >= 0.95)
                    audio.volume = 1.0;

            }
            UpdateVolumeBar();
        };

        document.addEventListener("mousemove", updateVolumeOnMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", updateVolumeOnMove);
        });

    }

    const prevSong = () => {
        const timeToBack = 5.0;
        const audio = document.getElementById('playerAudio');

        if (!audio)
            return false;
        if (audio.currentTime < timeToBack)
            return true;
        audio.currentTime = 0.0;
        return false;
    }
    const CheckNextSong = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return false;
        if (audio.currentTime >= audio.duration)
            return true;
        return false;
    }

    const GetAudio = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return null;
        return audio
    }

    const Mute = (muted) => {
        const audio = document.getElementById('playerAudio');

        if (!audio)
            return null;
        audio.muted = muted
        setIsMute(muted)
        UpdateVolumeBar();
    }

    return (
        <PlaylistContext.Consumer>
            {playlistContext => (
                <PlayerContext.Consumer>

                    {context => (
                        context.songsPlayList &&
                        <div className="player--wrap" onMouseOver={() => setMouseDown(false)} onMouseUp={() => setMouseDown(false)}>

                            {CheckNextSong() && Reset() && (context.nextSong(), Play())}
                            {context.setAudio(GetAudio())}
                            <div className="player">
                                <div className="player__info" draggable="true">
                                    <div className="player__image">

                                        {<img className="player__image--size" src={`${config.apiRoot}/${context.songsPlayList.Cover}`} />}
                                    </div>
                                    <div className="player__info--text-block">
                                        <div className="player__text">
                                            {context.currentySong().Name}
                                        </div>
                                        <div className="player__text">
                                            {context.songsPlayList.ArtistName}
                                        </div>
                                    </div>
                                </div>
                                <div className="player__controls">
                                    <div className="player__favorit">
                                        {!context.isFavoritCurrentSong() && <i onClick={() => context.addFavorit(context.currentySong().IdString)} className="far fa-heart"></i>}
                                        {context.isFavoritCurrentSong() && <i onClick={() => context.removeFavorit(context.currentySong().IdString)} className="fas fa-heart"></i>}
                                    </div>
                                    <div className="player__control-button-position">
                                        <div className="player__control-button player__control-button--back">
                                            <i className="fas fa-step-forward" onClick={() => { if (prevSong()) { Reset(); context.prevSong(); context.playAfteChange() } }}></i>
                                        </div>
                                        <div className="player__control-button">
                                            {!isPlay && <i className="fas fa-play" onClick={() => Play()}></i>}
                                            {isPlay && <i className="fas fa-pause" onClick={() => Pause()}></i>}
                                        </div>
                                        <div className="player__control-button player__control-button--next">
                                            <i className="fas fa-step-forward" onClick={() => { Reset(), context.nextSong(); context.playAfteChange() }}></i>
                                        </div>
                                        <div className="player__progress-bar-position">
                                            <div draggable="true" className="player__music-time">{currentTime}</div>
                                            <div id="player-bar" style={{ background: `linear-gradient(to right, orange ${progressBarWidth}%, white 0px)` }}
                                                className="player__progress-bar" onMouseDown={x => setTimeMusic(x)}>
                                                <div onMouseDown={(x) => setTimeMusicByKnob(x)} id="player-bar-knob" style={{ left: `${(progressBarWidth - 2)}%` }} className="player__progress-knob"></div>
                                            </div>
                                            <div draggable="true" className="player__music-time">{ConvertDuration(context.currentySong().Length)}</div>
                                        </div>
                                    </div>
                                    <div className="player__volume">
                                        <div className="player__ico">
                                            <i onClick={()=> playlistContext.showPlaylistAddSong(true,context.currentySong().IdString)} className="fas fa-list"></i>
                                          
                                        </div>

                                        <div className="player__ico">
                                            <i onClick={() => Mute(!isMute)} className={`fas ${!isMute ? "fa-volume-up" : "fa-volume-mute"}`}></i>
                                        </div>
                                        <div className="player__progress-bar player__progress-bar--volume "
                                            style={{ background: `linear-gradient(to right, orange ${progressBarVolumeWidth}%, white 0px)` }} id="volume-bar" onMouseDown={x => setVolume(x)}>
                                            <div onMouseDown={(x) => setVolumeByKnob(x)} style={{ left: `${(progressBarVolumeWidth - 2)}%` }} className="player__progress-knob player__progress-knob--volume"
                                                id="volume-bar-knob"></div>
                                        </div>
                                    </div>

                                </div>
                                <audio id="playerAudio" > <source src={`${config.apiRoot}/${context.currentySong().Path}`} /></audio>
                            </div>
                        </div>
                    )}
                </PlayerContext.Consumer>
            )}
        </PlaylistContext.Consumer>
    )

}