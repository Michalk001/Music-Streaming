
import React, { useState, useEffect, state, useReducer } from "react";
import { Link } from 'react-router-dom';



export const NavBar = () =>{

    const [hiddeMenu, setHiddeMenu] = useState(false);

    return(
        <>
         <div className={`NavBar__move ${hiddeMenu ? "NavBar__move--open" : ""}`} >
            <div className={`NavBar__move--icon ${hiddeMenu ? "NavBar__move--icon-rotate" : ""}`} onClick={x => setHiddeMenu(!hiddeMenu)}>
                <i className="fas fa-arrow-circle-left" ></i>
            </div>
        </div>
        <div className={`NavBar--wrap ${hiddeMenu ? "NavBar--hidden" : ""}`} >
            <div  className={`NavBar`}>
           
            <ul className="NavBar__menu">
                
                <li className="NavBar__menu-element">
                    <div>
                        <a href="#" className="NavBar__menu-element--link">
                            <i className="fas fa-home NavBar__menu-element--icon"></i>
                            Home
                        </a>
                    </div>
                </li>
                <li className="NavBar__menu-element">
                    <div>
                        <a href="#" className="NavBar__menu-element--link">
                            <i className="fas fa-search NavBar__menu-element--icon"></i>
                            Szukaj
                        </a>
                    </div>
                </li>
                <li className="NavBar__menu-element">
                    <div>
                        <a href="#" className="NavBar__menu-element--link">
                            <i className="fas fa-compact-disc NavBar__menu-element--icon"></i>
                            Biblioteka  
                        </a>
                    </div>
                </li>
            </ul>
            </div>
        </div>
        </>
    )

}