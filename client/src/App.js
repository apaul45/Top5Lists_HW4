import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen, 
    LoginScreen,
    DeleteModal,
    AccountErrorModal,
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store & auth into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        {/* <Route path="/logout/" exact component={HomeWrapper} /> */}
                        {/* When the user presses "Create Account", the server jumps to the register route, which 
                        will handle creating and saving a new account*/}
                        <Route path="/register/" exact component={RegisterScreen} />
                        {/*When the user presses "Login", the server jumps to the login route, which will handle
                        verifying a user account */}
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/top5list/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                    <DeleteModal />
                    <AccountErrorModal />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App