
import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state } from "react";


import Cookies from 'js-cookie';

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
export  const App = () => {
   
  
    return (

            <BrowserRouter>
                
                    <div className="user ">
                        <div className="user-fix">
                            <Switch>
                                <Route exact path="/" component={} />

                             
                              
                            </Switch>

                        </div>
                    
                    </div>
                 
              
            </BrowserRouter>

    );
}




