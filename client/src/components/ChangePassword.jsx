import React from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPass: '',
            newPass: '',
            confirmPass: '',
            disabled: true
        }
    }


    samePass = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            if (this.state.newPass === this.state.confirmPass) {
                this.setState({ disabled: false });
            } else {
                this.setState({ disabled: true });
            }
        });
    }

    submitNewPass = (e) => {
        e.preventDefault();
        Axios.put(`http://localhost:8000/api/user/changePass/${this.props.currentUser._id}`, {
            password: this.state.newPass
        })
            .then(() => {
                toast.success("Se ha cambiado la contraseña correctamente");
            });
    }


    render() {
        return (
            <form method="POST" onChange={this.samePass.bind(this)} onSubmit={this.submitNewPass.bind(this)} className="ChangePassword">
                <input type="password" name="newPass" placeholder="Contraseña nueva" />
                <input type="password" name="confirmPass" placeholder="Reptir contraseña nueva" />
                <button disabled={this.state.disabled} className="button-blue-dark">Cambiar contraseña</button>
            </form>
        )
    }
}