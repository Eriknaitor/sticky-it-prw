import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = (props) => {

	return (
		<nav>
			<div className="Logo">
				<i className="far fa-sticky-note"></i>
				<span>{props.currentUser ? props.currentUser.username : 'RemindMe'}</span>
			</div>

			<div className="buttons">
				<NavLink to="/"><i className="fas fa-home"></i> <span>Inicio</span></NavLink>
				{props.currentUser ? (
					<span>
						<NavLink to="/notes"><i className="fas fa-sticky-note"></i> <span>Mis notas</span></NavLink>
						<NavLink to="/saved"><i className="fas fa-save"></i> <span>Notas guardadas</span></NavLink>
						{props.currentUser.role === 'admin' ? (<NavLink to="/admin"><i className="fas fa-user-shield"></i> <span>Admin panel</span></NavLink>) : null}
						{props.currentUser.role === 'admin' ? (<NavLink to="/reports"><i className="fas fa-flag"></i> <span>Reportes</span></NavLink>) : null}
						<NavLink to="/settings"><i className="fas fa-cog"></i> <span>Configuración</span></NavLink>
						<NavLink to="/logout"><i className="fas fa-sign-out-alt"></i> <span>Salir</span></NavLink>
					</span>
				) : (
						<span>
							<NavLink to="/login"><i className="fas fa-sign-in-alt"></i> <span>Iniciar sesión</span></NavLink>
							<NavLink to="/signup"><i className="fas fa-user-circle"></i> <span>Crear una cuenta</span></NavLink>
						</span>
					)
				}
			</div>
		</nav>

	)
}

export default NavBar;