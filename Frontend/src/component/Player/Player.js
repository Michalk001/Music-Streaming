import React, { useState, useEffect, state, useContext, useReducer, createContext } from "react";
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

    const ConvertDuration = (duration) => {

        const time = (Math.floor(parseFloat(duration) / 60) + ':' + ('0' + Math.floor(parseFloat(duration) % 60)).slice(-2));
        return time;
    }

   
   

  

    const CheckNextSong = () => {
        const audio = document.getElementById('playerAudio');
        if (!audio)
            return false;
        if (audio.currentTime >= audio.duration)
            return true;
        return false;
    }



    return (
        <PlaylistContext.Consumer>
            {playlistContext => (
                <PlayerContext.Consumer>

                    {context => (
                        context.songsPlayList &&
                        <div className="player--wrap" onMouseOver={() => setMouseDown(false)} onMouseUp={() => setMouseDown(false)}>



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
                                            <i className="fas fa-step-forward" onClick={() => { context.prevSong() }}></i>
                                        </div>
                                        <div className="player__control-button">

                                            {!context.isPlayed() && <i className="fas fa-play" onClick={() => context.play()}></i>}
                                            {context.isPlayed() && <i className="fas fa-pause" onClick={() => context.pause()}></i>}
                                        </div>
                                        <div className="player__control-button player__control-button--next">
                                            <i className="fas fa-step-forward" onClick={() => { context.nextSong() }}></i>
                                        </div>
                                        <div className="player__progress-bar-position">
                                            <div draggable="true" className="player__music-time">{ConvertDuration(context.currentTime)}</div>
                                            <div id="player-bar" style={{ background: `linear-gradient(to right, orange ${context.progresBarWidth()}%, white 0px)` }}
                                                className="player__progress-bar" onMouseDown={x => context.setTimeMusic(x)}>
                                                <div onMouseDown={(x) => context.setTimeMusicByKnob(x)} id="player-bar-knob" style={{ left: `${(context.progresBarWidth() - 2)}%` }} className="player__progress-knob"></div>
                                            </div>
                                            <div draggable="true" className="player__music-time">{ConvertDuration(context.currentySong().Length)}</div>
                                        </div>
                                    </div>
                                    <div className="player__volume">
                                        <div className="player__ico">
                                            <i onClick={() => playlistContext.showPlaylistAddSong(true, context.currentySong().IdString)} className="fas fa-list"></i>

                                        </div>

                                        <div className="player__ico">
                                            <i onClick={() => context.mute(!context.isMuted)} className={`fas ${!context.isMuted ? "fa-volume-up" : "fa-volume-mute"}`}></i>
                                        </div>
                                        {console.log(context.progresBarVolumeWidth())}
                                        <div className="player__progress-bar player__progress-bar--volume "
                                            style={{ background: `linear-gradient(to right, orange ${context.progresBarVolumeWidth()}%, white 0px)` }} id="volume-bar" onMouseDown={x => context.setVolume(x)}>
                                            <div onMouseDown={(x) => context.setVolumeByKnob(x)} style={{ left: `${(context.progresBarVolumeWidth() - 2)}%` }} className="player__progress-knob player__progress-knob--volume"
                                                id="volume-bar-knob"></div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )}
                </PlayerContext.Consumer>
            )}
        </PlaylistContext.Consumer>
    )

}