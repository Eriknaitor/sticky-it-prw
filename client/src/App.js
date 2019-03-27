import React from 'react';
import AuthMethods from './components/AuthMethods';
import Login from './components/Login';

const Auth = new AuthMethods();

const App = () => {
  return (
    <div className="App">
      <Login />
    </div>
    // <Note />
  );
}

const _handleLogout = () => {
  Auth.logout()
  this.props.history.replace('/login');
}

export default App;
