import React, { Component } from 'react';
import axios from 'axios';

import ListNotes from './ListNotes';
import Input from './InputNotes';

class Note extends Component {
    state = {
        notes: []
    }

    componentDidMount() {
        this.getNotes();
    }

    getNotes = () => {
        axios.get('/api/notes')
            .then(res => {
                if (res.data) {
                    this.setState({
                        notes: res.data
                    })
                }
            })
            .catch(err => console.log(err));
    }

    deleteNote = (id) => {
        axios.delete(`/api/note/${id}`)
            .then(res => {
                if (res.data) {
                    this.getNotes()
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        let { notes } = this.state;
        return (
            <div>
                <h1>Mis notas</h1>
                <Input getNotes={this.getNotes} />
                <ListNotes todos={notes} deleteNote={this.deleteNote} />
            </div>
        )
    }
}

export default Note;