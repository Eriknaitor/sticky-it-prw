import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthMethods from '../AuthMethods';

const Auth = new AuthMethods();

class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    _handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();

        this.Auth.login(this.state.email, this.state.password)
            .then(res => {
                if (res === false) {
                    return alert('Error al introducir los datos');
                }
                this.props.history.replace("/");
            })
            .catch(err => {
                alert(err);
            })
    }

    componentWillMount() {
        if (Auth.loggedIn()) {
            this.props.history.replace('/');
        }
    }

    render() {
      return (
        <React.Fragment>
            <form>
                <input
                    className='form-item'
                    placeholder='Correo electrónico'
                    name='email'
                    type='text'
                    onChange={this._handleChange}
                />
                <input
                    className='form-item'
                    placeholder='Contraseña'
                    name='password'
                    type='password'
                    onChange={this._handleChange}
                />
                <button className='form-submit' onClick={this.handleFormSubmit}>Iniciar sesión</button>
            </form>
            <Link className='link' to='/signup'>¿No tienes cuenta? <span className='link-signup'>Registrate</span></Link>
        </React.Fragment>
      );
    }
}

export default Login;