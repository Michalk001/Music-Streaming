import React, { useState, useEffect, state,useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import {AuthContext} from "../../context/AuthContext";

export const Header = () => {
   
    
    return(
        <AuthContext.Consumer>
            { context => (
        <div className="header">
            <div className="header__login-widget">
                { !context.isLogin && <Link to="login" className="header__text"> Zaloguj</Link>}
                {context.isLogin && <div className="header__text"> {context.userName}</div>}
                {context.isLogin && <div className="header__text" onClick={()=>context.LogOut()}> Wyloguj</div>}
            </div>
        </div>
            )}
        </AuthContext.Consumer>
        
    )
 
}