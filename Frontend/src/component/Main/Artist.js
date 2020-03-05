
import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'

import { ArtistFetch } from '../../featchApi/ArtistFetch'
import { PlayerContext } from "../../context/PlayerContext";



export const Artist = (props) => {

    const artistF = new ArtistFetch();

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState(null)
    const getArtist = async () => {
        const id = props.match.params.id;
        const res = await artistF.getArtist(id);
        if (res.succeeded) {
            setArtist({ name: res.artist.name, idString: res.artist.idString })
            if (res.artist.albums) {
                setAlbums(res.artist.albums);
            }
        }
        console.log(res)
    }


    useEffect(() => {
        getArtist();
    }, [])

    return (
        <PlayerContext.Consumer>
            {context => (
                <div className="user__view artist">
                    <div className="artist__album-section ">
                        <div className="artist__text">Albumy </div>
                        {albums && <div className="artist__row">
                            {albums.map((x, index) => (
                                <div className="artist__album-box">
                                    <div onClick={() => { context.setSongs(x.idString); context.play() }} className="artist__album-box--cover-wrap">
                                        <img className="artist__album-box--image" src={`${config.apiRoot}/${x.cover.path}`} />
                                        <div className="artist__album-box--cover "><i class="far fa-arrow-alt-circle-right"></i></div>
                                    </div>
                                    <div className="artist__album-box--album ">
                                        <Link to={`/playlist/${x.idString}`} className="artist__text artist__text--link">{x.name}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>
                </div>
            )}
        </PlayerContext.Consumer>
    )

}