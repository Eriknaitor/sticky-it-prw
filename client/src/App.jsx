import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import httpClient from './httpClient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';

// Vistas
import LogIn from './views/LogIn';
import LogOut from './views/LogOut';
import SignUp from './views/SignUp';
import Notes from './views/MyNotes';
import Saved from './views/SavedNotes';
import SingleNote from './views/Note';
import Admin from './views/Admin';
import Reports from './views/Reports';
import Home from './views/Home';
import Settings from './views/Settings';


export default class App extends React.Component {
    state = { currentUser: httpClient.getCurrentUser() }

    onLoginSuccess() {
        this.setState({ currentUser: httpClient.getCurrentUser() })
    }

    logOut() {
        httpClient.logOut();
        this.setState({ currentUser: null });
    }

    render() {
        const { currentUser } = this.state
        return (
            <div className='App row'>
                {currentUser ? <NavBar className="column column-20" currentUser={currentUser} /> : null}
                <ToastContainer />
                <div className='column column-100 container'>
                    <Switch>
                        <Route path="/login" render={(props) => {
                            return <LogIn {...props} onLoginSuccess={this.onLoginSuccess.bind(this)} />
                        }} />

                        <Route path="/logout" render={() => {
                            return <LogOut onLogOut={this.logOut.bind(this)} />
                        }} />

                        <Route path="/signup" render={(props) => {
                            return <SignUp {...props} onSignUpSuccess={this.onLoginSuccess.bind(this)} />
                        }} />

                        <Route path="/notes" render={() => {
                            return currentUser
                                ? <Notes currentUser={currentUser} />
                                : <Redirect to="/login" />
                        }} />

                        <Route path="/saved" render={() => {
                            return currentUser
                                ? <Saved currentUser={currentUser} />
                                : <Redirect to="/login" />
                        }} />

                        <Route path="/settings" render={() => {
                            return currentUser
                                ? <Settings currentUser={currentUser} />
                                : <Redirect to="/login" />
                        }} />

                        <Route path="/admin" render={(props) => {
                            return currentUser.role === 'admin'
                                ? <Admin {...props} currentUser={currentUser} />
                                : <Redirect to="/" />
                        }} />

                        <Route path="/reports" render={(props) => {
                            return currentUser.role === 'admin'
                                ? <Reports {...props} currentUser={currentUser} />
                                : <Redirect to="/" />
                        }} />

                        <Route path="/note/:noteId" render={(props) => {
                            return currentUser
                                ? <SingleNote {...props} currentUser={currentUser} />
                                : <Redirect to="/login" />
                        }} />

                        <Route exact path="/" render={() => {
                            return <Home currentUser={currentUser} />
                        }} />

                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        )
    }
}