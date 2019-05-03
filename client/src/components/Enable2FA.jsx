import React from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default class Enable2FA extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled2FA: true,
            img: '',

        }
    }


    getQR = () => {
        Axios.get(`http://localhost:8000/api/user/qr/${this.props.currentUser._id}`)
        .then((res) => {
            this.setState({img: res.data.dataURL});
        }).catch((err) => {
            console.log(err);
            toast.error('Ha habido un error al procesar el QR');
        })
    }

    componentWillMount() {
        if (this.state.enabled2FA) this.getQR();
    }

    render() {
      return (
        <div>
            <img src={this.state.img} alt=""/>

        </div>
      )
    }
}