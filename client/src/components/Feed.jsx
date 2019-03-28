// https://alligator.io/react/react-infinite-scroll/
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import '../styles.css';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            hasMore: true,
            isLoading: false,
            Notes: []
        }

        window.onscroll = () => {
            const {
                loadNotes,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;

            // Si hay un error, está cargando o no hay mas, sale
            if (error || isLoading || !hasMore) return;

            // Si ha llegado al final de la página
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) loadNotes();
        }
    }

    componentWillMount() {
        this.loadNotes();
    }

    loadNotes = () => {
        this.setState({ isLoading: true }, () => {
            axios.get('http://localhost:8000/api/notes')
                .then((res) => {
                    const nextNotes = res.data.notes.map(note => ({
                        id: note._id,
                        visitors: note.visitors,
                        title: note.title,
                        content: note.content,
                        created: note.createdAt
                        // Hay que añadir el resto de vainas
                    }));

                    this.setState({
                        hasMore: (this.state.Notes.length < res.data.count),
                        isLoading: false,
                        Notes: [
                            ...this.state.Notes,
                            ...nextNotes,
                        ]
                    });
                })
                .catch((err) => {
                    this.setState({
                        error: err.message,
                        isLoading: false
                    });
                });

        })
    }

    render() {
        const {
            error,
            hasMore,
            isLoading,
            Notes
        } = this.state;

        return (
            <div>
                {Notes.map(note => (
                    <Fragment key={note.id}>
                        <hr />
                        <div>
                            <p>{note.title}</p>
                            <p>{note.content}</p>
                            <p>{note.visitors}</p>
                            <p>{note.createdAt}</p>
                        </div>
                    </Fragment>
                ))}
                <hr />
                {error &&
                    <div style={{ color: '#900' }}>
                        {error}
                    </div>
                }
                {isLoading &&
                    <div class="lds-dual-ring"></div>
                }
                {!hasMore &&
                    <div>You did it! You reached the end!</div>
                }
            </div>
        )
    }
}

export default Feed;