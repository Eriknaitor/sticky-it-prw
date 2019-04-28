import React from 'react';
import { Link } from 'react-router-dom';



const NavBar = (props) => {

	const _handleClick = (e) => {
		// arreglar para hacer click on active
		const active = document.querySelectorAll('.activeNav');
		Array.from(active).forEach(
			e => e.classList.remove('activeNav')
		);

		console.log(active);
		e.classList.add('activeNav');
	}

	return (
		<div className="Menu">
			<div className='NavBar'>
				<Link onClick={() => _handleClick.bind(this)} to="/"><i className="fas fa-home"></i> Inicio</Link>
				{props.currentUser ? (
					<span>
						<Link onClick={() => _handleClick.bind(this)} to="/notes"><i className="fas fa-sticky-note"></i> Mis notas</Link>
						<Link onClick={() => _handleClick.bind(this)} to="/saved"><i className="fas fa-save"></i> Notas guardadas</Link>
						{props.currentUser.role === 'admin' ? (<Link onClick={() => _handleClick.bind(this)} to="/admin"><i className="fas fa-user-shield"></i> Admin panel</Link>) : null}
						{props.currentUser.role === 'admin' ? (<Link onClick={() => _handleClick.bind(this)} to="/reports"><i class="fas fa-flag"></i> Reportes</Link>) : null}
						<Link onClick={() => _handleClick.bind(this)} to="/settings"><i className="fas fa-cog"></i> Configuración</Link>
						<Link onClick={() => _handleClick.bind(this)} to="/logout"><i className="fas fa-sign-out-alt"></i> Salir</Link>
					</span>
				) : (
						<span>
							<Link onClick={() => _handleClick.bind(this)} to="/login"><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Link>
							<Link onClick={() => _handleClick.bind(this)} to="/signup"><i className="fas fa-user-circle"></i> Crear una cuenta</Link>
						</span>
					)
				}
			</div>
			<div className="decoratorNavbar"></div>
		</div>

	)
}

export default NavBar;