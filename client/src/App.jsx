import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import httpClient from './httpClient';

// Componentes
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';

// Vistas
import LogIn from './views/LogIn';
import LogOut from './views/LogOut';
import SignUp from './views/SignUp';
import Notes from './views/MyNotes';
import SingleNote from './views/Note';
import Home from './views/Home';
import Settings from './views/Settings';

class App extends React.Component {
    state = { currentUser: httpClient.getCurrentUser() }

    onLoginSuccess(user) {
        this.setState({ currentUser: httpClient.getCurrentUser() })
    }

    logOut() {
        httpClient.logOut();
        this.setState({ currentUser: null });
    }

    render() {
        const { currentUser } = this.state
        return (
            <div className='App'>
                <NavBar currentUser={currentUser} />
                <div className='container'>
                    <Switch>
                        <Route path="/login" render={(props) => {
                            return <LogIn {...props} onLoginSuccess={this.onLoginSuccess.bind(this)} />
                        }} />

                        <Route path="/logout" render={(props) => {
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

                        <Route path="/settings" render={() => {
                            return currentUser
                                ? <Settings />
                                : <Redirect to="/login" />
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

export default App