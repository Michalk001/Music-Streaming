import {AuthContext} from '../context/AuthContext';
import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer } from "react";


export const AuthProvider = (props) => {

    const [isLogin, setIsLogin] = useState(checkIsLogin);
    const [isAdmin, setIsAdmin] = useState(checkIsAdmin);
    const [userName, setUserName] = useState(getUserName)

    const checkIsAdmin = () => {
       
        if (Cookies.get('token')) {
            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            if (decoded.isAdmin) {
                return true
            }
        }
        return false
    }

    const checkIsLogin = () => {
        if (Cookies.get('token'))
            return true
        else
            return false
    }

    const getUserName = () => {
        if (!Cookies.get('token'))
            return null;
        const jwtDecode = require('jwt-decode');
        const tokenDecode = jwtDecode(Cookies.get('token'));
        return tokenDecode.sub;
    }

    useEffect(()=>{
        setIsLogin(checkIsLogin());
        setIsAdmin(checkIsAdmin());
        setUserName(getUserName());
    },[]);
    return (
        <AuthContext.Provider
            value={
                {
                    isLogin,
                    isAdmin,
                    Name: userName,
                    onAdmin: setIsAdmin,
                    onLogin: setIsLogin,
                    onLogout: () => { setIsLogin(false); setIsAdmin(false) }
                }
            }
        >
            {props.children}
        </AuthContext.Provider>
    );
}
