import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
	return (
		<div className='NavBar'>
			<Link to="/">Inicio</Link>
			{props.currentUser
				? (
					<span>
						<Link to="/notes">Mis notas</Link>
						<Link to="/logout">Salir</Link>
					</span>
				)
				: (
					<span>
						<Link to="/login">Iniciar sesión</Link>
						<Link to="/signup">Crear una cuenta</Link>
					</span>
				)
			}
		</div>
	)
}

export default NavBar;