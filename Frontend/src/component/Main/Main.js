
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Link } from 'react-router-dom';
import config from '../../config.json'
import { PlayerContext } from "../../context/PlayerContext";

export const Main = (props) => {

    const [albumList, setAlbumList] = useState(null)
   
    const getAlbums = async () => {
        const query = `${config.apiRoot}/api/album`;
        await fetch(query, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded == true) {
                    setAlbumList(res.album);

                }

            })
    }
    useEffect(() => {
        getAlbums()
    }, []);




    return (

        <PlayerContext.Consumer>
            {context => (
                <div className="user__view">
                    <div className="cover-box__row">
             
                        {albumList != null && albumList.map(x =>
                            <div  key={x.name} className="cover-box cover-box__margin">

                                <div onClick={() => context.setAlbum(x.idString)} className="cover-box__image">
                                    <img className="cover-box__image--src" src={`${config.apiRoot}/${x.cover.path}`} />
                                    <div className="cover-box__play">
                                        <i className="cover-box__play--font far fa-arrow-alt-circle-right"></i>
                                    </div>

                                </div>
                                <Link to={`album/${x.idString}`} className="cover-box__link">
                                    <div className="cover-box__title">
                                        {x.name}
                                    </div>
                                    <div className="cover-box__artist">
                                        {x.artistName}
                                    </div>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </PlayerContext.Consumer>
    )

}