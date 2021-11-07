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
        loggedIn: false,
        errorMessage: "",
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    },[auth.errorMessage]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage,
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                })
            }
            default:
                return auth;
        }
    }

    // auth.getLoggedIn = function () {
    //     async function getLoggedInn(){
    //         const response = await api.getLoggedIn().then((response)=>{
    //             authReducer({
    //                 type: AuthActionType.GET_LOGGED_IN,
    //                 payload: {
    //                     loggedIn: response.data.loggedIn,
    //                     //work plz
    //                     user: response.data.user,
    //                     errorMessage: "",
    //                 }
    //             });
    //         }, ()=>{
    //             authReducer({
    //                 type: AuthActionType.GET_LOGGED_IN,
    //                 payload: {
    //                     loggedIn: false,
    //                     //work plz
    //                     user: null,
    //                     errorMessage: "AN ERROR OCCURRED",
    //                 }
    //         })
    //     });
    // }
    //     getLoggedInn();    
    // }
    auth.getLoggedIn = async function () {
        try{
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: auth.errorMessage,
                    }
                });
            }
        }
        catch{
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: false,
                    //work plz
                    user: null,
                    errorMessage: auth.errorMessage,
                }
            })
        }
    }
    auth.registerUser = async function(userData, store) {
        try{
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                //MAKE SURE THE ACCOUNT MODAL DOESNT APPEAR IF THE RESPONSE IS SUCCESSFUL
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        errorMessage: "",
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }   
        //IF AN ERROR OCCURS, UPDATE THE ERROR MESSAGE SO THAT ACCOUNT MODAL CAN DISPLAY IT
        catch(response){
            console.log(response.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: response.response.data.errorMessage,
                }
            });
        }
    }
    auth.loginUser = async function(userData, store) {
        console.log("loginUser", userData);
        try{
            const response = await api.loginUser(userData);     
            console.log("loginUser", response); 
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        errorMessage: "",
                    }
                });
                history.push("/");
                store.loadIdNamePairs();
             }
        }
        //IF AN ERROR OCCURS, UPDATE THE ERROR MESSAGE SO THAT ACCOUNT MODAL CAN DISPLAY IT
        catch(response){
            console.log(response.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: response.response.data.errorMessage,
                }
            });
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
                loggedIn: false,
                errorMessage: "",
            }
        });
        history.push('/');
    }
    //Use this auth store function to hide the account error modal when user presses ok
    auth.unmarkError = function(){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                errorMessage: "", 
            }
        });
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