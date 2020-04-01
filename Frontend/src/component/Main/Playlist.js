import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { PlayerContext } from "../../context/PlayerContext";
import { PlaylistContext } from "../../context/PlaylistContext";

export const Playlist = ({ match: { params: { id } } }) => {


    const [playlist, setPlaylist] = useState(null);
    const [owner, setOwner] = useState(null);
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
        setOwner(result.playlist.user)
        setPlaylist(result.playlist.playlist);
    }



    const ConvertDuration = (durationTmp) => {
        const duration = durationTmp.replace(",", ".");
        const time = (Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2));
        return time;
    }

    const Remove = async () => {
        let result = []

        await fetch(`${config.apiRoot}/api/playlist/${playlist.idString}`, {
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
    }

    useEffect(() => {
        getPlaylist();
    }, [id])

    useEffect(() => {

    }, [playlist])

    return (
        <PlaylistContext.Consumer>
            {playlistContext => (
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

                                            {Cookies.get('userName') &&
                                                <div className="playlist__text">{owner}</div>
                                            }
                                            {
                                                Cookies.get('userName') == owner &&
                                                <div onClick={() => Remove()} className="playlist__text button playlist__button--remove">Usuń</div>
                                            }
                                            <div className="playlist__text playlist__text--playlist-name">
                                                <Link className="playlist__text playlist__text--playlist-name " to={`/artist/${playlist.artistIdString}`}>{playlist.artistName}</Link>
                                            </div>
                                            <div onClick={() => { context.setPlaylist(playlist.idString); context.play() }} className="playlist__text button playlist__button--play-playlist">ODTWÓRZ</div>
                                        </div>
                                    </div>
                                    <div  className="playlist__main">

                                        {playlist.songs && playlist.songs.map((x, index) => (
                                            <div key={`fav${index}`} draggable="true" onDoubleClick={x => { context.setPlaylist(playlist.idString); context.setSong(index);}} className="playlist__song">
                                                <div className="playlist__row ">
                                                    <div>
                                                        <i onClick={() => {  context.setPlaylist(playlist.idString); context.setSong(index)}} className="fas playlist__ico "></i>
                                                    </div>
                                                    <div>
                                                        <i onClick={() => playlistContext.removeSongPlaylist(playlist.idString,x.idString)} className="fas playlist__ico playlist__ico--remove"></i>
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
            )}
        </PlaylistContext.Consumer>
    )

}