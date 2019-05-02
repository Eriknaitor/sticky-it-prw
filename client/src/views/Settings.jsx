import React from 'react';
import ChangePassword from '../components/ChangePassword';

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='settings'>
                <h1>Cambiar contraseña</h1>
                <ChangePassword currentUser={this.props.currentUser} />
                <hr />

                <h1>2FA</h1>

            </div>
        )
    }
}

export default Settings;