import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { PlayerContext } from "../../context/PlayerContext";


export const Playlist = ({ match: { params: { id } } }) => {


    const [playlist, setPlaylist] = useState(null);

    const getPlaylist = async () => {

        let result = []

        await fetch(`${config.apiRoot}/api/playlist/${id}`, {
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
        setPlaylist(result.playlist.playlist);
    }

    const removeFromPlaylist = async (idSong) => {
        let result = []
        if (idSong == null)
            return;
        await fetch(`${config.apiRoot}/api/SongToPlaylist/${id}/${idSong}`, {
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
        console.log(result)
        if (!result.succeeded)
            return;
    }

    const ConvertDuration = (durationTmp) => {
        const duration = durationTmp.replace(",", ".");
        const time = (Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2));
        return time;
    }


    useEffect(() => {
        getPlaylist();
    }, [id])

    useEffect(() => {

    }, [playlist])

    return (
        <PlayerContext.Consumer>
            {context => (
                <div className="user__view playlist ">
                    {playlist && <>
                        <div className="playlist__top ">
                            <div className="playlist__row playlist__row--center" draggable="true">
                                <img className="playlist__cover" src={``} />
                                <div className="playlist__top--text-field">
                                    <div className="playlist__text">Playlista</div>
                                    <div className="playlist__text">{playlist.name}</div>
                                    <div className="playlist__text playlist__text--playlist-name">
                                        <Link className="playlist__text playlist__text--playlist-name " to={`/artist/${playlist.artistIdString}`}>{playlist.artistName}</Link>
                                    </div>
                                    <div onClick={() => { context.setPlaylist(playlist.idString); context.play() }} className="playlist__text playlist__button playlist__button--play-playlist">ODTWÓRZ</div>
                                </div>
                            </div>
                            <div onDoubleClick={() => { context.setPlaylist(playlist.idString); context.play() }} className="playlist__main">

                                {playlist.songs && playlist.songs.map((x, index) => (
                                    <div key={`fav${index}`} draggable="true" onDoubleClick={x => { context.changeSong(index); context.play() }} className="playlist__song">
                                        <div className="playlist__row ">
                                            <div>
                                                <i onClick={() => { context.setPlaylist(playlist.idString); context.changeSong(index); context.play() }} className="fas playlist__ico "></i>
                                            </div>
                                            <div>
                                                <i onClick={() => removeFromPlaylist(x.idString)} className="fas playlist__ico playlist__ico--remove"></i>
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