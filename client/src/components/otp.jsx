import React from 'react';
import httpClient from '../httpClient';
import Axios from 'axios';

class Otp extends React.Component {

    submitOTP(evt) {
        evt.preventDefault();

        Axios.request({
            url: 'http://localhost:8000/api/authenticate',
            method: 'POST',
            data: {
                email: document.getElementsByName('email')[0].value,
                password: document.getElementsByName('password')[0].value
            }, headers: {
                'x-otp': document.getElementsByName('otp')[0].value
            }
        }).then(res => {
            // Hay que controlar los errores aquí, watchout
            if (res.status === 200 && res.data.ok) {
                const isValidLogin = httpClient.validLogin(res.data.token);
                console.log(isValidLogin);
                if (isValidLogin) {
                    this.props.onLoginSuccess(isValidLogin)
                    this.props.history.push('/')
                }
            }
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <form onSubmit={this.submitOTP.bind(this)}>
                <span>Tengo que meter aquí una imagen o algo yo que se, a ver si me mato o me corto el nabo con un machete, yo que se</span>
                <label htmlFor="otp">Introduce el código de verificación</label>
                <input type="text" name="otp" />
                <button className="button-blue-dark">Comprobar</button>
            </form>
        )
    }
}

export default Otp;