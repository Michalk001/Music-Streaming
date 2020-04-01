import React from "react";

export const AuthContext = React.createContext({
    isLogin: false,
    isAdmin: false,
    userName: null,
    onAdmin: () =>{},
    onLogin: () => { },
    LogOut: () => { },
    checkIsLogin: () =>{},
    singUp: async () => {}
 
})

