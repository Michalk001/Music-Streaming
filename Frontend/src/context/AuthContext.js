import React from "react";

export const AuthContext = React.createContext({
    isLogin: false,
    isAdmin: false,
    Name: "",
    onAdmin: () =>{},
    onLogin: () => { },
    onLogout: () => { }
 
})

