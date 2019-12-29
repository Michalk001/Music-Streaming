import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { PlayerContext } from "../../context/PlayerContext";

export const Player = () => {

    const [isPlay, setIsPlay] = useState(false);
    const [musicDuration, setMusicDuration] = useState("0:00");
    const [currentTime, setCurrentTime] = useState("0:00");
    const [progresBarWidth, setProgresBarWidth] = useState("0%");

    const Pause = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        if (isPlay) {

            setIsPlay(false);
            audio.pause();
        }
    }
    const Play = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        if (!isPlay) {

            setIsPlay(true);
            audio.play();
            setInterval(() => {

                UpdateProgresBar();
                GetTimeMusic();
                GetCurrentTime();
            }, 100);
        }
    }
    const GetTimeMusic = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        const time = (Math.floor(audio.duration / 60) + ':' + ('0' + Math.floor(audio.duration % 60)).slice(-2));

        if (isNaN(audio.duration))
            return;
        setMusicDuration(time);
    }
    const GetCurrentTime = () => {

        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        const time = (Math.floor(audio.currentTime / 60) + ':' + ('0' + Math.floor(audio.currentTime % 60)).slice(-2));

        setCurrentTime(time);
    }
    const UpdateProgresBar = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return
        const progress = ((audio.currentTime / audio.duration * 100) + "%");
        setProgresBarWidth(progress);
    }
    const Reset = () => {
        setMusicDuration("0:00");
        setCurrentTime("0:00");
        setProgresBarWidth("0%")
        const audio = document.getElementById('playerAudio');
        if (audio)
            audio.currentTime = 0
    }

    useEffect(() => {
        GetTimeMusic()

    }, []);


    return (
        <PlayerContext.Consumer>
            {context => (
                context.songsPlaylist &&
                <div className="player--wrap">

                    <div className="player">

                        <div className="player__info">
                            <div className="player__image">
                                {context.songsPlaylist && <img className="player__image--size" src={`https://localhost:44366/${context.songsPlaylist.Cover}`} />}
                            </div>
                            <div className="player__info--text-block">
                                <div className="player__text">
                                    {context.songsPlaylist && context.songsPlaylist.Songs[context.currentySongIndex].Name}
                                </div>
                                <div className="player__text">
                                    {context.songsPlaylist && context.songsPlaylist.ArtistName}
                                </div>
                            </div>
                        </div>
                        <div className="player__controls">
                            <div className="player__control-button-position">
                                <div className="player__control-button player__control-button--back">
                                    <i className="fas fa-step-forward" onClick={() => { Reset(), context.prevSong() }}></i>
                                </div>
                                <div className="player__control-button">
                                    {!isPlay && <i className="fas fa-play" onClick={() => Play()}></i>}
                                    {isPlay && <i className="fas fa-pause" onClick={() => Pause()}></i>}
                                </div>
                                <div className="player__control-button player__control-button--next">
                                    <i className="fas fa-step-forward" onClick={() => { Reset(), context.nextSong() }}></i>
                                </div>
                            </div>
                            <div className="player__progress-bar-position">
                                <div className="player__music-time">{currentTime}</div>
                                <div className="player__progress-bar">
                                    <div style={{ width: progresBarWidth }} className="player__progress-bar--currenty"> </div>
                                </div>
                                <div className="player__music-time">{musicDuration}</div>
                            </div>
                        </div>
                        <audio id="playerAudio"  > {context.songsPlaylist && <source src={`https://localhost:44366/${context.songsPlaylist.Songs[context.currentySongIndex].Path}`} />}</audio>
                    </div>
                </div>
            )}
        </PlayerContext.Consumer>
    )

}