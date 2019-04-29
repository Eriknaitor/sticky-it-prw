import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = (props) => {

	return (
		<nav>
			<div className="Logo">
				{props.currentUser ? (<img src="https://via.placeholder.com/150" />) : (<i class="far fa-sticky-note"></i>)}
				<span>{props.currentUser.username}</span>
			</div>

			<div activeClassName="active" className="buttons">
				<NavLink to="/"><i className="fas fa-home"></i> Inicio</NavLink>
				{props.currentUser ? (
					<span>
						<NavLink to="/notes"><i className="fas fa-sticky-note"></i> Mis notas</NavLink>
						<NavLink to="/saved"><i className="fas fa-save"></i> Notas guardadas</NavLink>
						{props.currentUser.role === 'admin' ? (<NavLink to="/admin"><i className="fas fa-user-shield"></i> Admin panel</NavLink>) : null}
						{props.currentUser.role === 'admin' ? (<NavLink to="/reports"><i class="fas fa-flag"></i> Reportes</NavLink>) : null}
						<NavLink to="/settings"><i className="fas fa-cog"></i> Configuración</NavLink>
						<NavLink to="/logout"><i className="fas fa-sign-out-alt"></i> Salir</NavLink>
					</span>
				) : (
						<span>
							<NavLink to="/login"><i className="fas fa-sign-in-alt"></i> Iniciar sesión</NavLink>
							<NavLink to="/signup"><i className="fas fa-user-circle"></i> Crear una cuenta</NavLink>
						</span>
					)
				}
			</div>
		</nav>

	)
}

export default NavBar;