import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Axios from 'axios';
import Tippy from '@tippy.js/react';
const formatter = buildFormatter(spanishStrings);

class Note extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note,
            userId: 0,
            userName: '',
            isEditing: false,
        }

        console.log(this.state.note);
    }

    _likeNote = (id) => {
        if (document.querySelector(`#liked-${id}`).classList.contains('liked')) {
            Axios.put(`http://localhost:8000/api/note/dislike/${id}`);
            document.querySelector(`#liked-${id}`).classList.remove('liked');
            document.querySelector(`#liked-${id}`).classList.remove('fas');
            document.querySelector(`#liked-${id}`).classList.add('far')
        } else {
            Axios.put(`http://localhost:8000/api/note/like/${id}`)
            document.querySelector(`#liked-${id}`).classList.remove('far')
            document.querySelector(`#liked-${id}`).classList.add('liked');
            document.querySelector(`#liked-${id}`).classList.add('fas');
        }
    }

    _hideNote = (id) => {
        if (document.querySelector(`#hidden-${id}`).classList.contains('hidden')) {
            Axios.put(`http://localhost:8000/api/note/update/${id}`, {hidden: false})
            .then(res => console.log(res))
            .catch(err => console.log(err));
        } else {
            Axios.put(`http://localhost:8000/api/note/update/${id}`, {hidden: true})
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }
    }


    _getUser = (userId) => {
        Axios.get(`http://localhost:8000/api/user/${userId}`)
            .then((res) => {
                this.setState({
                    userId: res.data.user._id,
                    userName: res.data.user.username,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentWillMount() {
        if (this.props.currentUser._id !== this.props.note.createdBy)
            this._getUser(this.state.note.createdBy);
    }

    render() {
        const randomColor = {
            background: `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
        };

        const { _id, hidden, savedBy, title, content, createdAt, createdBy, } = this.state.note;

        /**
         *  Hacer que los reports tiren y ocultarlos si es el propio user
         *  Meter el toggle del hidden
         *  Meter para borrar la nota
         */

        if (hidden && this.props.currentUser._id !== createdBy) {
            return (<div>Esta nota es privada :(</div>);
        } else {
            return (
                <div className="Note row">
                    <div className="decorator" style={randomColor}></div>
                    <div className="body-panel column column-60">
                        <div className="body-info">
                            <strong>{this.state.userName}</strong>
                        </div>
                        {this.state.isEditing ?
                            (<div>
                                <input type='text' value={title} />
                                <textarea value={content}></textarea>
                                <button>Guardar edición</button>
                            </div>) :
                            (<div>
                                <h5>{title}</h5>
                                <p>{content}</p>
                            </div>)
                        }
                    </div>
                    <div className="left-panel column column-30">
                    <small><TimeAgo date={createdAt} formatter={formatter} /></small>

                        <div className="controllers">
                            {this.props.currentUser._id === createdBy ? (<i className="fas fa-edit"></i>) : null }
                            {this.props.currentUser._id === createdBy ? 
                                (<i id={`hidden-${_id}`} onClick={() => this._hideNote(_id)} 
                                    className={hidden ? 
                                        ("far fa-eye") : 
                                        ("far fa-eye-slash")}></i>) : 
                                (<i className="fas fa-flag"></i>)
                            }
                            <Tippy content={`${savedBy.length} veces guardada`}>
                                <i className="fas fa-user"></i>
                            </Tippy>

                            <i id={`liked-${_id}`} onClick={() => this._likeNote(_id)}
                                className={savedBy.includes(this.props.currentUser._id) ?
                                    ("liked fas fa-heart") :
                                    ("far fa-heart")
                                }> </i></div>
                        </div>
                    </div>
            );
        }

    }
}

export default Note;

