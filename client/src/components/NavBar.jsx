import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
	console.log(props.currentUser);
	return (
		<div className="Menu">
			<div className='NavBar'>
				<Link to="/"><i className="fas fa-home"></i> Inicio</Link>
				{props.currentUser ? (
						<span>
							<Link to="/notes"><i className="fas fa-sticky-note"></i> Mis notas</Link>
							<Link to="/saved"><i className="fas fa-save"></i> Notas guardadas</Link>
							{props.currentUser === 'admin' ? (<Link to="/admin"><i class="fas fa-user-shield"></i> Admin panel</Link>): null}
							<Link to="/settings"><i className="fas fa-cog"></i> Configuración</Link>
							<Link to="/logout"><i className="fas fa-sign-out-alt"></i> Salir</Link>
						</span>
					) : (
						<span>
							<Link to="/login"><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Link>
							<Link to="/signup"><i className="fas fa-user-circle"></i> Crear una cuenta</Link>
						</span>
					)
				}
			</div>
			<div className="decoratorNavbar"></div>
		</div>

	)
}

export default NavBar;