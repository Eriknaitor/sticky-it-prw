import React from 'react'
import { Link } from 'react-router-dom';
import CreateNote from '../components/NewNote';

const Home = (props) => {
	return (
		<div className='Home'>
			{props.currentUser
				? (
					<CreateNote />
				)
				: (
					<div>
						<div className="bgHome"></div>
						<div className="NotLoggedHome">
							<h1>RemindMe</h1>
							<h5>Administra tus notas y recordatorios fácilmente</h5>
							<Link to="/login">Iniciar sesión</Link>
							<Link to="/signup">Crear una cuenta</Link>
						</div>
					</div>

				)
			}
		</div>
	)
}

export default Home;