import React from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Axios from 'axios';
import Tippy from '@tippy.js/react';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';
const formatter = buildFormatter(spanishStrings);

//#region Constantes
const MAX_LENGTH_CONTENT = 500;
const MIN_LENGTH_TITLE = 12;
const MAX_LENGTH_TITLE = 35;
//#endregion

export default class Note extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note,
            userName: '',
            isEditing: false,
            _title: this.props.note.title,
            _content: this.props.note.content
        };
    }

    _likeNote = (id) => {
        if (document.querySelector(`#liked-${id}`).classList.contains('liked')) {
            Axios.put(`/note/dislike/${id}`);
            document.querySelector(`#liked-${id}`).classList.remove('liked');
            document.querySelector(`#liked-${id}`).classList.remove('fas');
            document.querySelector(`#liked-${id}`).classList.add('far')
        } else {
            Axios.put(`/note/like/${id}`)
            document.querySelector(`#liked-${id}`).classList.remove('far')
            document.querySelector(`#liked-${id}`).classList.add('liked');
            document.querySelector(`#liked-${id}`).classList.add('fas');
        }
    }

    _hideNote = (id) => {
        if (document.querySelector(`#hidden-${id}`).classList.contains('hidden')) {
            Axios.put(`/note/update/${id}`, { hidden: false })
            document.querySelector(`#hidden-${id}`).classList.remove('hidden');
            document.querySelector(`#hidden-${id}`).classList.add('fa-eye');
            document.querySelector(`#hidden-${id}`).classList.remove('fa-eye-slash');

        } else {
            Axios.put(`/note/update/${id}`, { hidden: true })
            document.querySelector(`#hidden-${id}`).classList.add('hidden');
            document.querySelector(`#hidden-${id}`).classList.add('fa-eye-slash');
            document.querySelector(`#hidden-${id}`).classList.remove('fa-eye');

        }
    }

    deleteNote = (id) => {
        this.props.deleteAction(id)
    }

    _handleEdit = () => {
        this.setState({ isEditing: !this.state.isEditing, editTitle: this.state.title, editContent: this.state.content });
    }

    _handleChange = (evt) => {
        this.setState({ ...this.state, [evt.target.name]: evt.target.value });
    }

    _getUser = (userId) => {
        Axios.get(`/user/${userId}`)
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

    between(val, min, max) {
        return val >= min && val <= max;
    }


    _saveEdited = (id) => {
        if (this.between(this.state._title.length, MIN_LENGTH_TITLE, MAX_LENGTH_TITLE) || this.state._content.length <= this.state.MAX_LENGTH_CONTENT) {
            Axios.put(`/note/update/${id}`, { title: this.state._title, content: this.state._content })
                .then(() => {
                    this.setState({ title: this.state.editTitle, content: this.state.editContent }, () => {
                        this.setState({ isEditing: false });
                        toast.success('Se ha editado la nota correctamente');
                    });
                }).catch((err) => {
                    toast.error('Ha habido un error al editar la nota');
                });
        } else {
            toast.error('El formato de la nota no es válido');
        }

    }

    _handleReport = () => {
        const comboReport = document.getElementsByName('comboReport')[0].value;

        if (comboReport === "") {
            toast.warn('Tienes que especificar un motivo')
        } else {
            Axios.post('/report/create', { reason: comboReport, reportedId: this.props.note._id })
                .then(() => {
                    toast.info('Se ha reportado esta nota');
                }).catch(() => {
                    toast.error('Ha habido un error al enviar el reporte');
                });
        }
    }

    componentWillMount() {
        if (this.props.currentUser._id !== this.props.note.createdBy)
            this._getUser(this.state.note.createdBy);
    }

    render() {
        const { _id, hidden, savedBy, createdAt, createdBy } = this.state.note;
        const { _title, _content } = this.state;

        if (hidden && (this.props.currentUser._id !== createdBy || this.props.currentUser.role !== 'admin') && !savedBy.includes(this.props.currentUser._id)) {
            return (<div><h1>Esta nota es privada <i class="far fa-frown"></i></h1></div>);
        } else {
            return (
                <div className="Note row">
                    <div className="decorator"></div>
                    <div className="body-panel column column-80">
                        {this.state.isEditing ?
                            (<div className="editMode" onChange={this._handleChange.bind(this)}>
                                <input name="_title" type="text" defaultValue={_title} />
                                <textarea name="_content" defaultValue={_content}></textarea>
                                <button onClick={() => this._saveEdited(_id)} className="button-blue-dark">Guardar edición</button>
                                <span className="float-right">{this.state._content.length} / {MAX_LENGTH_CONTENT}</span>
                            </div>) :
                            (<div className="normalMode">
                                <div className="body-info">
                                    <strong>{this.state.userName}</strong>
                                </div>
                                <h5>{_title}</h5>
                                <p>{_content}</p>
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
                                (<Popup closeOnDocumentClick modal trigger={<i className="fas fa-flag"></i>}>
                                    <h1>¿Por qué vas a reportar la nota?</h1>
                                    <select name="comboReport" id="">
                                        <option defaultValue="default"></option>
                                        <option value="No me gusta">No me gusta</option>
                                        <option value="Me ofende">Me ofende</option>
                                        <option value="Tiene contenido ofensivo">Tiene contenido ofensivo</option>
                                    </select>

                                    <button onClick={() => this._handleReport()} className="button-blue-dark">Enviar reporte</button>
                                </Popup>)
                            }
                            {this.props.currentUser._id === createdBy ? (<i onClick={() => this.deleteNote(_id)} className="far fa-trash-alt"></i>) : null}
                            <Tippy content={`${savedBy.length} veces guardada`}>
                                <i className="fas fa-user"></i>
                            </Tippy>
                            <Link to={`/note/${_id}`}><i className="fas fa-share"></i></Link>
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
