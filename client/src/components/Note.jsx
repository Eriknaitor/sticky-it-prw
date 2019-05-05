import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Axios from 'axios';
import Tippy from '@tippy.js/react';
import { toast } from 'react-toastify';
const formatter = buildFormatter(spanishStrings);



export default class Note extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note,
            userId: 0,
            userName: '',
            isEditing: false,
            title: this.props.note.title,
            content: this.props.note.content,
            editTitle: '',
            editContent: '',

            MAX_LENGTH_CONTENT: 500,
            MAX_LENGTH_TITLE: 35
        }
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
            Axios.put(`http://localhost:8000/api/note/update/${id}`, { hidden: false })
            document.querySelector(`#hidden-${id}`).classList.remove('hidden');
            document.querySelector(`#hidden-${id}`).classList.add('fa-eye');
            document.querySelector(`#hidden-${id}`).classList.remove('fa-eye-slash');

        } else {
            Axios.put(`http://localhost:8000/api/note/update/${id}`, { hidden: true })
            document.querySelector(`#hidden-${id}`).classList.add('hidden');
            document.querySelector(`#hidden-${id}`).classList.add('fa-eye-slash');
            document.querySelector(`#hidden-${id}`).classList.remove('fa-eye');

        }
    }

    deleteNote = (id) => {
        this.props.deleteAction(id)
    }

    _handleEdit = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    _handleChange = (evt) => {
        this.setState({ ...this.state, [evt.target.name]: evt.target.value });
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

    _saveEdited = (id) => {
        if ((this.state.title.length >= 12 && this.state.title.length <= 35) && this.state.content.length <= this.state.MAX_LENGTH_CONTENT) {
            Axios.put(`http://localhost:8000/api/note/update/${id}`, { title: this.state.editTitle, content: this.state.editContent })
                .then(() => {
                    this.setState({ title: this.state.editTitle, content: this.state.editContent }, () => {
                        toast.success('Se ha editado la nota correctamente');
                    });
                }).catch((err) => {
                    toast.error('Ha habido un error al editar la nota');
                });
        } else {
            toast.error('El formato de la nota no es válido');
        }

    }

    _updateTextArea(e) {
        this.setState({ editContent: e.target.value })
    }


    _updateTitle(e) {
        this.setState({ editTitle: e.target.value })
    }

    componentWillMount() {
        if (this.props.currentUser._id !== this.props.note.createdBy)
            this._getUser(this.state.note.createdBy);
    }

    render() {
        const { _id, hidden, savedBy, title, content, editTitle, editContent, createdAt, createdBy, } = this.state.note;

        /**
         *  Hacer que los reports tiren y ocultarlos si es el propio user
         *  Meter para borrar la nota
         */

        if (hidden && this.props.currentUser._id !== createdBy && !savedBy.includes(this.props.currentUser._id)) {
            return (<div><h1>Esta nota es privada <i class="far fa-frown"></i></h1></div>);
        } else {
            return (
                <div className="Note row">
                    <div className="decorator"></div>
                    <div className="body-panel column column-80">
                        <div className="body-info">
                            <strong>{this.state.userName}</strong>
                        </div>
                        {this.state.isEditing ?
                            (<div className="editMode" onChange={this._handleChange.bind(this)}>
                                <input placeholder={title} name="title" type='text' onChange={this._updateTitle.bind(this)} value={editTitle} />
                                <textarea placeholder={content} name="content" onChange={this._updateTextArea.bind(this)} value={editContent}></textarea>
                                <button onClick={() => this._saveEdited(_id)} className="button-blue-dark">Guardar edición</button>
                                <span>{this.state.content.length} / {this.state.MAX_LENGTH_CONTENT}</span>
                            </div>) :
                            (<div className="normalMode">
                                <h5>{title}</h5>
                                <p>{content}</p>
                            </div>)
                        }
                    </div>
                    <div className="left-panel column column-30">
                        <small><TimeAgo date={createdAt} formatter={formatter} /></small>

                        <div className="controllers">
                            {this.props.currentUser._id === createdBy ? (<i onClick={this._handleEdit.bind(this)} className="fas fa-edit"></i>) : null}
                            {this.props.currentUser._id === createdBy ?
                                (<i id={`hidden-${_id}`} onClick={() => this._hideNote(_id)}
                                    className={!hidden ?
                                        ("far fa-eye") :
                                        ("far fa-eye-slash")}></i>) :
                                (<i className="fas fa-flag"></i>)
                            }
                            {this.props.currentUser._id === createdBy ? (<i onClick={() => this.deleteNote(_id)} className="far fa-trash-alt"></i>) : null}
                            <Tippy content={`${savedBy.length} veces guardada`}>
                                <i className="fas fa-user"></i>
                            </Tippy>
                            <Link to={`/note/${_id}`}><i className="fas fa-share-alt"></i></Link>
                            <i id={`liked-${_id}`} onClick={() => this._likeNote(_id)}
                                className={savedBy.includes(this.props.currentUser._id) ?
                                    ("liked fas fa-heart") :
                                    ("far fa-heart")
                                }>
                            </i>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

