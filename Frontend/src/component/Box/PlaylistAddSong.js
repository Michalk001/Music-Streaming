
import React, { useState, useEffect, useRef, state, useContext, useReducer } from "react";
import config from '../../config.json'
import { PlaylistContext } from "../../context/PlaylistContext"
import Cookies from 'js-cookie';

export const PlaylistAddSong = () => {


    return (
        <PlaylistContext.Consumer>
            {contextPlaylist => (
                <div className="playlist-box playlist-box--add-song">
                    <div className="playlist-box--wrap-add-song">
                        <div onClick={() => contextPlaylist.showPlaylistAddSong(false,null)} className="playlist-box__cross"><i className="fas fa-times"></i> </div>
                        <div className="playlist-box__text playlist-box__text--title">Dodaj do playlisty</div>
                        <div className="playlist-box__box playlist-box__box--add-song" >
                            
                            {contextPlaylist.playlist && contextPlaylist.playlist.map((x, index) => (
                                !x.isFavorit && 
                                <div onClick={() => contextPlaylist.addSongPlaylist(x.idString)} key={`addsp-${index}`} className="playlist-box__list-playlist-element">
                                    <div className="playlist-box__text playlist-box__text--add-song">{x.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </PlaylistContext.Consumer>
    )



}