import React, { useState, useEffect, useRef, state, useContext, useReducer } from "react";
import config from '../../config.json'
import { PlaylistContext } from "../../context/PlaylistContext"
import Cookies from 'js-cookie';



export const PlaylistCreate = () => {


    const [playlistName, setPlaylistName] = useState("");

    const createPlaylist = async () => {
        if (playlistName.length < 3)
            return;
        let result = null;
        const obj = {
            Name: playlistName
        }
        await fetch(`${config.apiRoot}/api/Playlist`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })
            console.log(result)
        return result
    }


    const inputField = useRef(null);
    useEffect(() => {
        inputField.current.focus();
    }, [])

    return (
        <PlaylistContext.Consumer>
            {contextPlaylist => (
                <div className="playlist-box">
                    <div className="playlist-box--wrap">
                        <div onClick={() => contextPlaylist.showPlaylistCreate(false)} className="playlist-box__cross"><i className="fas fa-times"></i> </div>
                        <div className="playlist-box__text playlist-box__text--title">Utwórz nową playlistę</div>
                        <div className="playlist-box__box">
                            <div className="playlist-box__box--wrap">
                                <div className="playlist-box__box--spacing">
                                    <div className="playlist-box__text playlist-box__text--sub-title">Nazwa Playlisty</div>
                                    <input value={playlistName} onChange={x => setPlaylistName(x.target.value)} ref={inputField} className="playlist-box__text playlist-box--input playlist-box__input" type="text" placeholder="Twoja Nazwa" />
                                </div>
                            </div>
                        </div>
                        <div className="playlist-box__button">
                            <div onClick={() => createPlaylist()} className="button playlist-box__button--element">Utwórz</div>
                            <div onClick={() => contextPlaylist.showPlaylistCreate(false)} className="button playlist-box__button--element  playlist-box__button--cancel">Anuluj</div>
                        </div>
                    </div>
                </div >
            )}
        </PlaylistContext.Consumer>
    )

}