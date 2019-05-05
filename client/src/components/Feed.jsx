import React, { Component, Fragment } from 'react';
import Note from './Note';
import Axios from 'axios';
import { toast } from 'react-toastify';
import _ from 'underscore';


class Feed extends Component {
    constructor() {
        super();

        this.state = {
            error: false,
            hasMore: true,
            isLoading: false,
            counter: 0,
            Notes: [],
        };

        // Establece el evento onscroll
        window.onscroll = () => {
            const {
                loadNotes,
                state: { error, isLoading, hasMore },
            } = this;

            // Si hay un error, está cargando o no hay mas termina
            if (error || isLoading || !hasMore) return;

            // Comprueba que ha hecho scroll hasta abajo
            if (
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight
            ) {
                loadNotes();
            }
        };
    }

    componentWillMount() {
        this.loadNotes();
    }

    _deleteNote = (id) => {
        Axios.delete(`http://localhost:8000/api/note/delete/${id}`)
            .then(() => {
                this.setState({
                    Notes: _.reject(this.state.Notes, function (element) {
                        return element._id === id;
                    }), counter: 0
                }, () => {
                    toast.info('Se ha borrado la nota correctamente');
                });
            })
            .catch(err => {
                toast.error(err.response.data.err);
            })
    }

    /**
     * Hace la comprobación de los elementos dentro del array de las notas
     * y suma en caso de que sea menor al número obtenido de la API
     */
    checkPages = (numElements) => {
        if (this.state.Notes.length < numElements) {
            this.setState({
                counter: this.state.counter + 10
            });
            return true;
        }
        return false;
    }

    loadNotes = () => {
        this.setState({ isLoading: true }, () => {
            Axios.get(`${this.props.url}${this.state.counter}`)
                .then((res) => {
                    /**
                     * Mapeo los objetos obtenidos por la API a un array 
                     * y compruebo si hay mas
                     */
                    const nextNotes = res.data.notes.map(note => ({
                        _id: note._id,
                        likes: note.likes,
                        savedBy: note.savedBy,
                        hidden: note.hidden,
                        title: note.title,
                        content: note.content,
                        createdAt: note.createdAt,
                        createdBy: note.createdBy
                    }));
                    this.setState({
                        hasMore: this.checkPages(res.data.count),
                        isLoading: false,
                        Notes: [...this.state.Notes, ...nextNotes]
                    });
                })
                .catch((err) => {
                    toast.error(err.response.data.err);
                    this.setState({
                        error: err.message,
                        isLoading: false
                    });
                });
        });
    }

    render() {
        const { error, hasMore, isLoading, Notes } = this.state;

        return (
            <div className="Feed">
                {Notes.map(noteMap => (
                    <Fragment key={noteMap._id}>
                        <Note deleteAction={this._deleteNote.bind(this)} currentUser={this.props.currentUser} note={noteMap} />
                    </Fragment>
                ))}
                {error &&
                    <div style={{ color: '#900' }}>
                        {error}
                    </div>
                }
                {isLoading &&
                    <div className='lds-dual-ring'></div>
                }
                {!hasMore && null}
            </div>
        );
    }
}

export default Feed;
