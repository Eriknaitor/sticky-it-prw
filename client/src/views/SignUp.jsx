import React from 'react'
import httpClient from '../httpClient';
import { SliderPicker } from 'react-color';
const colors = [];

// sign up form behaves almost identically to log in form. We could create a flexible Form component to use for both actions, but for now we'll separate the two:
class SignUp extends React.Component {
	state = {
		fields: { username: '', email: '', password: '' }
	}

	onInputChange(evt) {
		this.setState({
			fields: {
				...this.state.fields,
				[evt.target.name]: evt.target.value
			}
		})
	}


	componentDidMount() {
		for (let i = 0; i <= 7; i++) {
			colors.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));			
		}
		console.log('yoquese')
	}

	onFormSubmit(evt) {
		evt.preventDefault()
		httpClient.signUp(this.state.fields).then(user => {
			this.setState({ fields: { username: '', email: '', password: '' } })
			if (user) {
				this.props.onSignUpSuccess(user)
				this.props.history.push('/')
			}
		})
	}

	render() {
		const { username, email, password } = this.state.fields
		return (
			<div className='SignUp'>
				<div className='row'>
					<div className='column column-33 column-offset-33'>
						<h1>Crear una cuenta</h1>
						<form onChange={this.onInputChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
							<input type="text" placeholder="Nombre de usuario" name="username" defaultValue={username} />
							<input type="text" placeholder="Correo electrónico" name="email" defaultValue={email} />
							<input type="password" placeholder="Contraseña" name="password" defaultValue={password} />
							<SliderPicker />
							<button>Registrar cuenta</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default SignUp