import React from 'react';
import httpClient from '../httpClient';
import Otp from '../components/otp';

class LogIn extends React.Component {
	state = {
		fields: {
			email: '',
			password: ''
		},
		remember: false,
		status: false
	}

	handleCheck() {
		this.setState({ remember: !this.state.fields.remember });
	}

	onInputChange(evt) {
		this.setState({
			fields: {
				...this.state.fields,
				[evt.target.name]: evt.target.value
			}
		})
	}

	onFormSubmit(evt) {
		evt.preventDefault()
		httpClient.logIn(this.state.fields).then(user => {
			if (user === 206) {
				this.setState({ fields: { email: '', password: '' }, status: true });
			} else {
				if (user) {
					this.props.onLoginSuccess(user)
					this.props.history.push('/')
				}
			}
		})
	}

	render() {
		const { email, password, remember } = this.state.fields
		return (
			<div className='LogIn'>
				<div className='row'>
					<div className='column column-33 column-offset-33'>
						<h1>Iniciar sesión</h1>
						<form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
							<input type="text" placeholder="Correo electrónico" name="email" defaultValue={email} />
							<input type="password" placeholder="Contraseña" name="password" defaultValue={password} />

							<div className="float-right">
								<input type="checkbox" defaultChecked={remember} id="remember" name="remember" />
								<label className="label-inline" htmlFor="remember">Recuérdame</label>
							</div>
							<button className='button-blue-dark'>Iniciar sesión</button>
						</form>
						<div className='OTP'>
							{this.state.status ? (<Otp />) : null}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default LogIn;