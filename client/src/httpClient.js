import axios from 'axios';
import jwtDecode from 'jwt-decode';

const httpClient = axios.create();


// Sacamos el token del LocalStorage
httpClient.getToken = function() {
    return localStorage.getItem('token');
}

// Metemos el token en el LocalStorage y lo devolvemos
httpClient.setToken = function(token) {
    localStorage.setItem('token', token);
    return token;
}

// Obtenemos el usuario actual según el token guardado
httpClient.getCurrentUser = function() {
    const token = this.getToken();
    if (token) return jwtDecode(token);
    return null;
}

// Nos logueamos
httpClient.logIn = function(credentials) {
    return this({ method: 'POST', url: 'http://localhost:8000/api/authenticate', data: credentials })
        .then((serverResponse) => {
            const token = serverResponse.data.token;
            // Añade el token a los encabezados
            if (token) {
                this.defaults.headers.common.token = this.setToken(token);
                return jwtDecode(token);
            } else {
                return false
            }
        });
}

// Creamos un usuario
httpClient.signUp = function(userInfo) {
    return this({method: 'POST', url: 'http://localhost:8000/api/user/create', data: userInfo})
        .then((serverResponse) => {
            const token = serverResponse.data.token;
            // Añade el token a los encabezados
            if (token) {
                this.defaults.headers.common.token = this.setToken(token);
            } else {
                return false;
            }
        })
}

// Cerramos sesión
httpClient.logOut = function() {
    localStorage.removeItem('token');
    delete this.defaults.headers.common.token;
    return true;
}

/**
 * Se intenta añadir el token a los encabezados al iniciar 
 * la aplicación en caso de existir
 */
httpClient.defaults.headers.common.token = httpClient.getToken();

export default httpClient;