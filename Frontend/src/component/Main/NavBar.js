
import React, { useState, useEffect, state, useReducer } from "react";
import { Link } from 'react-router-dom';
import { PlaylistContext } from "../../context/PlaylistContext"


export const NavBar = () => {

    const [hiddeMenu, setHiddeMenu] = useState(false);

    return (
        <PlaylistContext.Consumer>
            {contextPlaylist => (
                <>

                    <div className={`NavBar__move ${hiddeMenu ? "NavBar__move--open" : ""}`} >
                        <div className={`NavBar__move--icon ${hiddeMenu ? "NavBar__move--icon-rotate" : ""}`} onClick={x => setHiddeMenu(!hiddeMenu)}>
                            <i className="fas fa-arrow-circle-left" ></i>
                        </div>
                    </div>
                    <div className={`NavBar--wrap ${hiddeMenu ? "NavBar--hidden" : ""}`} >
                        <div className={`NavBar`}>

                            <ul className="NavBar__menu">

                                <li className="NavBar__menu-element">
                                    <div>
                                        <Link to={"/"} className="NavBar__menu-element--link">
                                            <i className="fas fa-home NavBar__menu-element--icon"></i>
                                            Home
                        </Link>
                                    </div>
                                </li>
                                <li className="NavBar__menu-element">
                                    <div>
                                        <Link to={"/"} className="NavBar__menu-element--link">
                                            <i className="fas fa-search NavBar__menu-element--icon"></i>
                                            Szukaj
                        </Link>
                                    </div>
                                </li>
                                <li className="NavBar__menu-element">
                                    <div>
                                        <Link to={"/favorit"} className="NavBar__menu-element--link">
                                            <i className="fas fa-compact-disc NavBar__menu-element--icon"></i>
                                            Ulubione
                        </Link>
                                    </div>
                                </li>
                            </ul>
                            <ul className="NavBar__menu">
                                <li className="NavBar__menu-element">
                                    <div className="NavBar__menu-element--text NavBar__menu-element--center">PLAYLISTY</div>
                                </li>
                                <li className="NavBar__menu-element">
                                    <div onClick={() => contextPlaylist.showPlaylistCreate(true)} className=" NavBar__menu-element--link NavBar__menu-element--text NavBar__menu-element--center">Utwórz Playlistę</div>
                                </li>
                                {contextPlaylist.playlist && contextPlaylist.playlist.map(x => (
                                    !x.isFavorit && 
                                    <li className="NavBar__menu-element">
                                        <Link to={`/playlist/${x.idString}`}className="NavBar__menu-element--text NavBar__menu-element--link  ">{x.name}</Link>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </div>

                </>
            )}
        </PlaylistContext.Consumer>
    )

}