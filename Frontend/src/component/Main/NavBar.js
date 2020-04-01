
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Link } from 'react-router-dom';
import { PlaylistContext } from "../../context/PlaylistContext"
import { AuthContext } from "../../context/AuthContext";

export const NavBar = () => {

    const [hiddeMenu, setHiddeMenu] = useState(false);
    const authContext = useContext(AuthContext);

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
                                {authContext.isLogin && <li className="NavBar__menu-element">
                                    <div>
                                        <Link to={"/favorit"} className="NavBar__menu-element--link">
                                            <i className="fas fa-compact-disc NavBar__menu-element--icon"></i>
                                            Ulubione
                                        </Link>
                                    </div>
                                </li>}
                            </ul>
                            {authContext.isLogin && <ul className="NavBar__menu">
                                <li className="NavBar__menu-element">
                                    <div className="NavBar__menu-element--text NavBar__menu-element--center">PLAYLISTY</div>
                                </li>
                                <li className="NavBar__menu-element">
                                    <div onClick={() => contextPlaylist.showPlaylistCreate(true)} className=" NavBar__menu-element--link NavBar__menu-element--text NavBar__menu-element--center">Utwórz Playlistę</div>
                                </li>
                                {contextPlaylist.playlist && contextPlaylist.playlist.map((x, index) => (
                                    !x.isFavorit &&
                                    <li key={"playn-" + index} className="NavBar__menu-element">
                                        <Link to={`/playlist/${x.idString}`} className="NavBar__menu-element--text NavBar__menu-element--link  ">{x.name}</Link>
                                    </li>

                                ))}
                            </ul>}
                        </div>
                    </div>

                </>
            )}
        </PlaylistContext.Consumer>
    )

}