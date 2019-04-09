import React from 'react';
import httpClient from '../httpClient';
import axios from 'axios';

class LogIn extends React.Component {
	state = {
		fields: {
			email: '',
			password: '',
			otp: ''
		},
		otp: '',
		stage: 1
	}

	onInputChange(evt) {
		this.setState({
			fields: {
				...this.state.fields,
				[evt.target.name]: evt.target.value
			}
		})
	}

	onSubmitStageOne = function (evt) {
		evt.preventDefault();
		axios.post('http://localhost:8000/api/authenticate', this.state.fields)
			.then((res) => {
				if (res.status === 200) {
					const isValid = httpClient.validLogin(res.data.token);
					if (isValid) {
						this.props.onLoginSuccess(isValid);
						this.props.history.push('/');
					}
				} else {
					this.setState({ stage: 2 });
				}
			}).catch((err) => {
				console.log(err);
			})
	}

	onSubmitStageTwo = function (evt) {
		evt.preventDefault();
		axios.post('http://localhost:8000/api/authenticate', this.state.fields, { headers: { 'x-otp': this.state.fields.otp } })
			.then((res) => {
				if (res.status === 200) {
					const isValid = httpClient.validLogin(res.data.token);
					if (isValid) {
						this.props.onLoginSuccess(isValid);
						this.props.history.push('/');
					}
				}
				console.log(res);
			}).catch((err) => {
				console.log(err);
			})
	}

	renderStageOne() {
		const { email, password } = this.state.fields;
		return (<div className='row'>
			<div className='column column-33 column-offset-33'>
				<h1>Iniciar sesión</h1>
				<form method='POST' onChange={this.onInputChange.bind(this)} onSubmit={this.onSubmitStageOne.bind(this)}>
					<input type="text" placeholder="Correo electrónico" name="email" defaultValue={email} />
					<input type="password" placeholder="Contraseña" name="password" defaultValue={password} />

					<div className="float-right">
						<input type="checkbox" id="remember" name="remember" />
						<label className="label-inline" htmlFor="remember">Recuérdame</label>
					</div>
					<button className='button-blue-dark'>Iniciar sesión</button>
				</form>
			</div>
		</div>)
	}

	rendetStageTwo() {
		return (<div className='row'>
			<div className='column column-33 column-offset-33'>
				<form onChange={this.onInputChange.bind(this)} onSubmit={this.onSubmitStageTwo.bind(this)}>
					<span>Tengo que meter aquí una imagen o algo yo que se, a ver si me mato o me corto el nabo con un machete, yo que se</span>
					<label htmlFor="otp">Introduce el código de verificación</label>
					<input type="text" name="otp" />
					<button className="button-blue-dark">Comprobar</button>
				</form>
			</div>
		</div>)
	}

	render() {
		return this.state.stage === 1 ?
			this.renderStageOne() :
			this.rendetStageTwo();
	}
}

export default LogIn;