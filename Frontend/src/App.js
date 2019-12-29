
import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state } from "react";


import Cookies from 'js-cookie';


import { Main } from "./component/Main/Main"
import { NavBar } from "./component/Main/NavBar"
import { Header } from "./component/Main/Header"
import { Login } from "./component/Account/Login"
import { AuthContext } from './context/AuthContext';
import { Player } from './component/Player/Player';
import { AuthProvider } from "./contextProvider/AuthProvider";
import { PlayerProvider } from "./contextProvider/PlayerProvider";
import { ArtistAdmin } from "./component/Admin/Music/ArtistAdmin";
import { NavBarAdmin } from "./component/Admin/NavBarAdmin"
import {EditorAlbumAdmin}  from "./component/Admin/Music/EditorAlbumAdmin"
/*
const UserRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        checkIsLogin() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        checkIsAdmin() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)
*/

const UserRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        <div className="user__root">
            <Header />
            <div className="user__container">
                <NavBar />
                <Component {...props}/>
            </div>
            <Player />
        </div>
    )} />
)

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        <div className="user__root">
            <Header />
            <div className="user__container">
                <NavBarAdmin />
                <Component {...props}/>
            </div>
        </div>
    )} />
)


export const App = () => {


    return (

        <BrowserRouter>
            <AuthProvider >
                <PlayerProvider >
                    <Switch>
                        <UserRoute path="/" exact component={Main} />
                        <UserRoute path="/login" component={Login} />
                        <AdminRoute path="/admin/artist" component={ArtistAdmin} />
                        <AdminRoute path="/admin/Album/:id" component={EditorAlbumAdmin} />
                        <AdminRoute path="/admin/Editor/Album/" component={EditorAlbumAdmin} />
                    </Switch>

                </PlayerProvider>
            </AuthProvider>

        </BrowserRouter>

    );
}


