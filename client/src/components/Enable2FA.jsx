import React from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default class Enable2FA extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled2FA: this.props.currentUser.isEnabled2FA,
            img: '',
        }
    }


    getQR = () => {
        Axios.get(`/user/qr/${this.props.currentUser._id}`)
            .then((res) => {
                this.setState({ img: res.data.dataURL });
            }).catch((err) => {
                toast.error('Ha habido un error al procesar el código QR');
            })
    }

    componentWillMount() {
        if (this.state.enabled2FA) this.getQR();
    }


    _regenerateQR() {
        Axios.put(`/user/newSecret/${this.props.currentUser._id}`)
            .then(() => {
                this.getQR();
            })
    }

    _handle2FA(e) {
        if (this.state.enabled2FA) {
            this.getQR();
        } else {
            this.setState({ enabled2FA: e.target.checked }, () => {
                Axios.put(`/user/update/${this.props.currentUser._id}`,
                    { isEnabled2FA: this.state.enabled2FA })
                    .catch((err) => {
                        toast.error('Ha habido un error al activar la 2FA');
                    });
            });
        }

    }

    render() {
        return (
            <div className="comp2FA">
                <label className="label-inline" htmlFor="2fa">Activar autenticación en dos pasos</label>
                <input type="checkbox" onChange={this._handle2FA.bind(this)} name="2fa" checked={this.state.enabled2FA} />
                {this.state.enabled2FA ?
                    (<div>
                        <p>Escanea este código QR para que tu móvil genere códigos de autenticación</p>
                        <img src={this.state.img} alt="" />
                        <div className="clear-fix"></div>
                        <button onClick={() => this._regenerateQR()} className="button-blue-dark">Generar QR</button>
                        <p>En Android puedes usar aplicaciones como <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=es">Google Authenticator</a> o <a href="https://play.google.com/store/apps/details?id=com.authy.authy&hl=es">Authy</a>.<br />
                            En iOS puedes utilizar también <a href="https://itunes.apple.com/es/app/google-authenticator/id388497605?mt=8">Google Authenticator</a> y <a href="https://itunes.apple.com/es/app/authy/id494168017?mt=8">Authy</a>.</p>
                    </div>) : null}
            </div>
        )
    }
}