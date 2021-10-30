import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        if(auth.loggedIn)
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = function () {
        async function getLoggedInn(){
            const response = await api.getLoggedIn().then((response)=>{
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        //work plz
                        user: response.data.user
                    }
                });
            }, ()=>{
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: false,
                        //work plz
                        user: null
                    }
            })
        });
    }
        getLoggedInn();    
    }
    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }
    auth.loginUser = async function(userData, store) {
        console.log("loginUser", userData)
        const response = await api.loginUser(userData);     
        console.log("loginUser", response); 
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }else{
            console.log("error occurred")
        }
    }
    
    
    // function(userData, store){
    //     async function login(){
    //         console.log(userData);
    //         const response = await api.loginUser(userData).then((response)=>{
    //             authReducer({
    //                 type: AuthActionType.LOGIN_USER,
    //                 payload: {
    //                     user: response.data.user
    //                 }
    //             });
    //             history.push("/");
    //             store.loadIdNamePairs();
    //         }, ()=>"error occurred");
    //     }
    //     login();
    // }
    auth.logoutUser = async function(){
        api.logoutUser();
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false
            }
        });
        history.push('/');
    }
    
    
    
    
    // function(){
    //     async function logUser(userData, store){
    //         const response = await api.loginUser(userData).then((response)=>{
    //             authReducer({
    //                 type: AuthActionType.LOGIN_USER,
    //                 payload: {
    //                     user: response.data.user
    //                 }
    //             })
    //             history.push("/");
    //             store.loadIdNamePairs();
    //         }, ()=>{
    //             authReducer({
    //                 type: AuthActionType.GET_LOGGED_IN,
    //                 payload: {
    //                     user: null,
    //                     loggedIn: false
    //                 }
    //         });
    //     });
    // }
    // logUser();
    // }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };