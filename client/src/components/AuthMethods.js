import decode from 'jwt-decode';

export default class AuthMethods {
    constructor(domain) {
        this.domain = domain || 'http://localhost:8000';
    }

    login = (email, password) => {
        return this.fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            this.setToken(res.token)
            return Promise.resolve(res);
        });
    };

    loggedIn = () => {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            return (decoded.ext < Date.now() / 1000)
        } catch (err) {
            console.log('Ha fallado la comprobación de la expiración');
            return false;
        }
    };

    setToken = idToken => {
        localStorage.setItem('id_token', idToken);
    };
    
    getToken = () => {
        return localStorage.getItem('id_token');
    };

    logout = () => {
        localStorage.removeItem('id_token');
    };

    getConfirm = () => {
        console.log('Respuesta recibida');
        return decode(this.getToken());
    };

    fetch = (url, options) => {
        const headers = {
            Accept: 'application/json',
            "Content-Type": "application/json"
        };

        if (this.loggedIn()) {
            headers['Authorization'] = "Bearer" + this.getToken();
        }

        return fetch(url, {
            headers,
            ...options
        })
        .then(this._checkStatus)
        .then(response => response.json());
    };

    _checkStatus = response => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.repsonse = response;
            throw error;
        }
    };
}