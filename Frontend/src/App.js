
import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state, useContext } from "react";


import Cookies from 'js-cookie';


import { Main } from "./component/Main/Main"
import { NavBar } from "./component/Main/NavBar"
import { Header } from "./component/Main/Header"
import { Favorit } from "./component/Main/Favorit"
import { Login } from "./component/Account/Login"
import { AuthContext } from './context/AuthContext';
import { Player } from './component/Player/Player';
import { AuthProvider } from "./contextProvider/AuthProvider";
import { PlayerProvider } from "./contextProvider/PlayerProvider";
import { PlaylistProvider } from "./contextProvider/PlaylistProvider";
import { ArtistAdmin } from "./component/Admin/Music/ArtistAdmin";
import { NavBarAdmin } from "./component/Admin/NavBarAdmin";
import { EditorAlbumAdmin } from "./component/Admin/Music/EditorAlbumAdmin";
import { Album } from "./component/Main/Album";
import { Artist } from "./component/Main/Artist";
import { PlaylistContext } from "./context/PlaylistContext"
import { PlaylistCreate } from "./component/Box/PlaylistCreate";
import { Playlist } from "./component/Main/Playlist"
import { InfoBoxProvider } from "./contextProvider/InfoBoxProvider"

import { PlaylistAddSong } from "./component/Box/PlaylistAddSong"





const RequireLogin = ({path, component, ...rest }) => {
    const authContext = useContext(AuthContext);
    return (
        console.log(authContext.checkIsLogin()) ||
        authContext.checkIsLogin() ? <UserRoute path={path} component={component} /> : <Route render={() => (<Redirect to='/login' />)} />
    )
}

const RequireAdmin= ({path, component, ...rest }) => {
    const authContext = useContext(AuthContext);
    return (
        authContext.isAdmin ? <AdminRoute path={path} component={component} /> : <Route render={() => (<Redirect to='/login' />)} />
    )
}




const UserRoute = ({ component: Component, ...rest }) => (
    <PlaylistContext.Consumer>
        {contextPlaylistBox => (
            <Route {...rest} render={(props) => (
                <div className="user__root">
                    <Header />
                    <div className="user__container">
                        <NavBar />
                        <Component {...props} />

                    </div>
                    {contextPlaylistBox.showCreatePlaylist && <PlaylistCreate />}
                    {contextPlaylistBox.showAddSongPlaylist && <PlaylistAddSong />}

                    <Player />
                </div>
            )}
            />
        )}
    </PlaylistContext.Consumer>
)

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        <div className="user__root">
            <Header />
            <div className="user__container">
                <NavBarAdmin />
                <Component {...props} />
            </div>
        </div>
    )} />
)


export const App = () => {


    return (

        <BrowserRouter>
            <InfoBoxProvider>
                <AuthProvider >
                    <PlayerProvider >
                        <PlaylistProvider >

                            <Switch>

                                <UserRoute path="/" exact component={Main} />
                                <UserRoute path="/login" component={Login} />
                                <UserRoute path="/Album/:id" component={Album} />
                                <UserRoute path="/artist/:id" component={Artist} />
                                <UserRoute path="/playlist/:id" component={Playlist} />
                                <RequireLogin path="/favorit/" component={Favorit} />
                                <AdminRoute path="/admin/artist" component={ArtistAdmin} />
                                <AdminRoute path="/admin/Album/:id" component={EditorAlbumAdmin} />
                                <AdminRoute path="/admin/Editor/Album/" component={EditorAlbumAdmin} />
                            </Switch>
                        </PlaylistProvider>
                    </PlayerProvider>
                </AuthProvider>
            </InfoBoxProvider>
        </BrowserRouter>

    );
}


