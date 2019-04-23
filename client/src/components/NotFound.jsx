import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="_404">
        <i class="far fa-frown"></i>
        <h1>404: Lo que estabas buscando ya no existe </h1>
        <center><Link to="/">Volver a la página de inicio</Link></center>
    </div>
);

export default NotFound;