import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { AuthorizationFetch } from "../featchApi/AuthorizationFetch"
import { InfoBoxContext } from "../context/InfoBoxContext"
import { Redirect } from 'react-router-dom';

export const AuthProvider = (props) => {

    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(null)
    const [correctlogin, setCorrectLogin] = useState(true)
    const auth = new AuthorizationFetch()
    const contextInfoBox = useContext(InfoBoxContext)


    const checkIsAdmin = () => {

        if (Cookies.get('token')) {
            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            const role = decoded.role.find((x) => { return x == "Admin" })
            console.log(role)
            if (role == "Admin") {
                setIsAdmin(true);
            }
            else
                setIsAdmin(false)
        }

    }

    const checkIsLogin = () => {
        if (Cookies.get('token')) {
            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            if (decoded.exp > (new Date() / 1000)) {
                setIsLogin(true)
                return true
            }
            else {
                setIsLogin(false)
                return false
            }
        }
    }

    const getUserName = () => {
        if (!isLogin) {
            setUserName(null);
            return;
        }
        if (!Cookies.get('token')) {
            setUserName(null)
            return;
        }
        const jwtDecode = require('jwt-decode');
        const tokenDecode = jwtDecode(Cookies.get('token'));
        setUserName(tokenDecode.sub)
    }


    const singUp = async (loginValue) => {
        await auth.SingIn(loginValue.login, loginValue.password)
            .then(x => {

                if (x.succeeded == true) {
                    Cookies.set('token', x.token);
                    checkIsLogin();
                    checkIsAdmin();
                    getUserName();
                    setCorrectLogin(false);
                }
                else {
                 
                    setCorrectLogin(true);
                    contextInfoBox.addInfo("Błędne hasło lub login")
                }
            })

    }

    const LogOut = () =>{
        setIsLogin(false)
        setIsAdmin(false)
        setUserName(null)
        Cookies.remove('token');
    }

    useEffect(() => {
        console.log(111)
        checkIsLogin();
        checkIsAdmin();
    }, []);
    useEffect(() => {
        getUserName()
    }, [isLogin,userName]);

    useEffect(() => {

    }, [correctlogin, userName]);

    return (
        <AuthContext.Provider
            value={
                {
                    isLogin,
                    isAdmin,
                    userName,
                    checkIsLogin,
                    checkIsAdmin,
                    LogOut,
                    singUp
                }
            }
        >
            {!correctlogin && <Redirect to="/" />}
            {props.children}
        </AuthContext.Provider>
    );
}
