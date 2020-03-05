import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'

import { AlbumFetch } from '../../featchApi/AlbumFetch'
import { PlayerContext } from "../../context/PlayerContext";


export const Album = (props) => {

    const albumF = new AlbumFetch();
    const [playlist, setPlaylist] = useState(null);

    const getPlaylist = async () => {
        const id = props.match.params.id;
        const res = await albumF.getAlbum(id);
        if (!res.succeeded)
            return;
        setPlaylist(res.playlist);
       
    }

    const ConvertDuration = (durationTmp) => {
        const duration = durationTmp.replace(",", ".");
        const time = (Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2));
        return time;
    }


    useEffect(() => {
        getPlaylist();
    }, [])



    return (
        <PlayerContext.Consumer>
            {context => (
                <div className="user__view playlist ">
                    {playlist && <> 
                        <div className="playlist__top ">
                            <div className="playlist__row playlist__row--center" draggable="true">
                                <img className="playlist__cover" src={`${config.apiRoot}/${playlist.cover.path}`} />
                                <div className="playlist__top--text-field">
                                    <div className="playlist__text">Album</div>
                                    <div className="playlist__text">{playlist.name}</div>
                                    <div className="playlist__text playlist__text--playlist-name">
                                        <Link className="playlist__text playlist__text--playlist-name " to={`/artist/${playlist.artistIdString}`}>{playlist.artistName}</Link>
                                    </div>
                                    <div onClick={() => { context.setAlbum(playlist.idString); context.play() }} className="playlist__text playlist__button playlist__button--play-playlist">ODTWÓRZ</div>
                                </div>
                            </div>
                            <div onDoubleClick={() => { context.setAlbum(playlist.idString); context.play() }} className="playlist__main">
                                {playlist.songs && playlist.songs.map((x, index) => (
                                    <div key={`alb${index}`}  draggable="true" onDoubleClick={x => { context.changeSong(index); context.play() }} className="playlist__song">
                                        <div className="playlist__row ">
                                            <div>
                                                <i onClick={() => { context.setAlbum(playlist.idString); context.changeSong(index); context.play() }} className="fas playlist__ico "></i>
                                            </div>
                                            <div className="playlist__song--center-content">
                                                <div className="playlist__row " >
                                                    <div className="playlist__text playlist__text--name-song" >{x.name}</div>
                                                </div>
                                                <div className="playlist__row ">
                                                    <Link to={`/artist/${x.album.artistIdString}`} className="playlist__text playlist__text--link-mini ">{x.album.artistName}</Link>
                                                    <Link to={`/playlist/${x.album.idString}`} className="playlist__text  playlist__text--link-mini" >{x.album.name}</Link>
                                                </div>
                                            </div>

                                            <div className="playlist__text playlist__text--duration">{ConvertDuration(x.length)}</div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>}

                </div>
            )}
        </PlayerContext.Consumer>
    )

}