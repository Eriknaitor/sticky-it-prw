import React from 'react';
import Axios from 'axios';
import toaster from 'toasted-notes';
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

    componentDidMount() {
        Axios.get(`http://localhost:8000/api/note/${this.state.noteId}`)
            .then((res) => {
                this.setState({ isLoaded: true, note: res.data });
            }).catch((err) => {
                toaster.notify('Ha habido un error al mostrar la nota');
            })
    }
    // Pa sacar los parámetros de la URL this.props.match.params.noteId


    // Si es el owner editar, si no se come una polla, tan simple como eso
    render() {
        const { error, isLoaded, note } = this.state;

        if (error) {
            return <div>Ha habido un error> {error.message}</div>
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