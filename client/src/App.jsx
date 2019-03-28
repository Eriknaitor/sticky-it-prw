import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import httpClient from './httpClient';

import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import LogIn from './views/LogIn';
import LogOut from './views/LogOut';
import SignUp from './views/SignUp';
import VIP from './views/VIP';
import Home from './views/Home';

class App extends React.Component {
    state = { currentUser : httpClient.getCurrentUser() }

    onLoginSuccess(user) {
        this.setState({ currentUser: httpClient.getCurrentUser() })
    }

    logOut() {
        httpClient.logOut();
        this.setState({ currentUser: null });
    }
    
    render() {
        const {currentUser} = this.state
        return(
            <div className='App container'>
                <NavBar currentUser={currentUser} />

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

                    <Route path="/vip" render={() => {
                        return currentUser
                            ? <VIP />
                            : <Redirect to="/login" />
                    }} />

                    <Route path="/" exact component={Home} />

                    <Route component={NotFound} />
                </Switch>
            </div>
        )
    }
}

export default App