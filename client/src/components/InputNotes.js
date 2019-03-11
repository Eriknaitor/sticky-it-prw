import React, { Component } from 'react';
import axios from 'axios';

class Input extends Component {
    state = {
        title: "",
        content: ""
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    handleContentChange = (e) => {
        this.setState({ content: e.target.value });
    }

    addNote = () => {
        const note = { title: this.state.title, content: this.state.content }
        if (note.title.value && note.value.length > 0) {
            axios.post('/api/note', note)
                .then(res => {
                    if (res.data) {
                        this.props.getNotes();
                        this.setState({ title: "", content: "" })
                    }
                })
                .catch(err => console.log(err));
        } else {
            // Añadir error al input de title o notificación O.O
            alert('uwu');
        }
    }

    render() {
        return (
            <div>
                <input type="text" name="title" onChange={this.handleTitleChange} />
                <textarea name="content" onChange={this.handleContentChange.bind(this)} value={this.handleContentChange.value}></textarea>
                <button onClick={this.addNote}>Añadir nota</button>
            </div>
        );
    }
}

export default Input;