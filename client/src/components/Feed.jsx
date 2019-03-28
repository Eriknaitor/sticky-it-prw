import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

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
        this.setState({isLoading: true}, () => {
            axios.get('url')
            .then((res) => {
                const nextNotes = res.body.notes.map(note => ({
                    
                }))
            })
        })
    }
}

export default Feed;