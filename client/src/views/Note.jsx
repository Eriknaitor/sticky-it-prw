import React from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import Note from '../components/Note';

export default class SingleNote extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            noteId: props.match.params.noteId,
            note: {}
        }
    }

    // Para sacar los parámetros de la URL this.props.match.params.noteId
    componentDidMount() {
        Axios.get(`http://localhost:8000/api/note/${this.state.noteId}`)
            .then((res) => {
                this.setState({ isLoaded: true, note: res.data });
            }).catch((err) => {
                this.props.history.push('/');
                toast.error('Ha habido un error al mostrar la nota');
            })
    }

    render() {
        const { error, isLoaded, note } = this.state;

        if (error) {
            return <div>Ha habido un error {error.message}</div>
        } else if (!isLoaded) {
            return <div className='lds-dual-ring'></div>;
        } else {
            return (
                <div>
                    <Note currentUser={this.props.currentUser} note={note} />
                </div>
            )
        }
    }
}