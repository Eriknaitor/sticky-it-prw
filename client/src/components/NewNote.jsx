import React from 'react';
import ProgressRing from './Progress-ring';
import CustomDatePicker from './DatePicker';
import Axios from 'axios';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

//#region Constantes
const MAX_LENGTH_CONTENT = 500;
const MAX_LENGTH_TITLE = 35;
//#endregion

export default class CreateNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentValue: '',
            titleValue: '',
            progress: 0,
            rememberDate: false,
            private: false,
            setDate: null
        };
    }

    //#region Métodos "privados"
    _updateTextArea = (e) => {
        if (e.target.value.length <= MAX_LENGTH_CONTENT) {
            this.setState({ contentValue: e.target.value, progress: (e.target.value.length * 100 / MAX_LENGTH_CONTENT) })
        }
    }

    _updateTitle = (e) => {
        if (e.target.value.length <= MAX_LENGTH_TITLE) {
            this.setState({ titleValue: e.target.value })
        } else {
            toast.notify('Has llegado al tamaño máximo del título')
        }
    }

    _handleCheck = (e) => {
        this.setState({ rememberDate: e.target.checked })
    }

    _handleChangeDate = (date) => {
        this.setState({ setDate: date });
    }

    _handlePrivate = (e) => {
        this.setState({ private: e.target.checked })
    }

    _createNewNote = () => {
        if (this.state.titleValue.length < 12) {
            toast.notify('El título como mínimo tiene que tener 12 caracteres');
        } else {
            Axios.post('http://localhost:8000/api/note/create', {
                title: document.getElementsByName('title')[0].value,
                content: this.state.contentValue,
                remember: this.state.rememberDate,
                rememberDate: this.state.setDate,
                hidden: this.state.private
            }).then((res) => {
                if (res.data.ok) {
                    toast.notify('Se ha creado la nota correctamente :)');
                    this.setState({ contentValue: '', titleValue: '', progress: 0 });
                }
            }).catch((err) => {
                toast.notify('Ha habido un erorr al crear la nota');
            });
        }

    }
    //#endregion

    render() {
        return (
            <div className="editor-container row">
                <div className="column column-10"></div>

                <div className="column column-80">
                    <input placeholder="Título de la nota" value={this.state.titleValue} onChange={this._updateTitle.bind(this)} type="text" name="title" />
                    <textarea placeholder="Contenido de la nota..." name="contentNote" value={this.state.contentValue} onChange={this._updateTextArea.bind(this)}></textarea>
                    <div className='progress-container'>
                        <ProgressRing radius={8} stroke={2} progress={this.state.progress} strokeColor={'red'} />
                        <span>{this.state.contentValue.length} / {MAX_LENGTH_CONTENT}</span>
                    </div>

                    <label className="label-inline" htmlFor="private">¿Nota privada?No se podrá compartir a no ser que la hagas pública</label>
                    <input type="checkbox" name="private" onChange={this._handlePrivate.bind(this)} checked={this.state.private} />

                    <div className="clear-fix"></div>

                    <label className="label-inline" htmlFor="remember">¿Recordar fecha?</label>
                    <input type="checkbox" name="remember" onChange={this._handleCheck.bind(this)} checked={this.state.rememberDate} />
                    {this.state.rememberDate ? (<CustomDatePicker onChange={this._handleChangeDate.bind(this)} />) : null}

                    <div className="clear-fix"></div>

                    <button className="submitNote" onClick={this._createNewNote}>Crear nota</button>
                </div>
                <div className="column column-10"></div>

            </div>
        )
    }
}