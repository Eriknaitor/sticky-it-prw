import React from 'react'
import httpClient from '../httpClient'

class LogIn extends React.Component {
	state = {
		fields: { email: '', password: '', remember: false, rememberField: localStorage.getItem('remember') || '' }
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
			this.setState({ fields: { email: '', password: '' } })
			if (user) {
				localStorage.setItem('remember', this.state.fields.email);
				this.props.onLoginSuccess(user)
				this.props.history.push('/')
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
							<input type="text" placeholder="Correo electrónico" name="email" value={email} />
							<input type="password" placeholder="Contraseña" name="password" value={password} />

							<div className="float-right">
								<input type="checkbox" defaultChecked={remember} id="remember" name="remember" />
								<label className="label-inline" htmlFor="remember">Recuérdame</label>
							</div>

							<button className='button-blue-dark'>Iniciar sesión</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default LogIn