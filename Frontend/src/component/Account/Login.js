
import React, { useState, useEffect, state,useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import {AuthContext} from "../../context/AuthContext";
import {AuthorizationFetch} from "../../featchApi/AuthorizationFetch"
import Cookies from 'js-cookie';


export const Login = (props) => {

    const [loginValue, setLoginValue] = useState(null);
    const UpdateLoginValue = (e) => {
        setLoginValue({ ...loginValue, [e.name]: e.value });
    }

    const { onLogin, onAdmin } = useContext(AuthContext);
    const auth = new AuthorizationFetch()

    const SingUp = async (e) => {
        e.preventDefault()
        await auth.SingIn(loginValue.login, loginValue.password)
            .then(x => {
                
                if (x.succeeded == true) {
                    const jwtDecode = require('jwt-decode');
                    const tokenDecode = jwtDecode(x.token)
                    Cookies.set('token', x.token);
                    onLogin(true);
                    if (tokenDecode.isAdmin)
                        onAdmin(true)
                    props.history.push("/");
                }
                else {
                   // setIsError(true)
                }
            })

    }

    return (
        <div className="user__view">
            <div className="sing-in">
                <div className="sing-in__title">Zaloguj się</div>
                <form className="sing-in__field" onSubmit={x => SingUp(x)}>
                    <div className="sing-in__form-field">
                        <input className="sing-in__input" type="txt" name="login" placeholder="nazwa użytkownika"  onChange={x => UpdateLoginValue(x.target)}/>
                    </div>
                    <div className="sing-in__form-field">
                        <input className="sing-in__input" type="password" name="password" placeholder="hasło"  onChange={x => UpdateLoginValue(x.target)}/>
                    </div>
                    <div className="sing-in__form-field">
                        <input className="sing-in__button" type="submit" ></input>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}