import React from 'react';
import ChangePassword from '../components/ChangePassword';
import Enable2FA from '../components/Enable2FA';

export default class Settings extends React.Component {

    render() {
        return (
            <div className='settings'>
                <h1>Cambiar contraseña</h1>
                <ChangePassword currentUser={this.props.currentUser} />
                <hr />

                <h1>2FA</h1>
                <Enable2FA currentUser={this.props.currentUser} />
            </div>
        )
    }
}