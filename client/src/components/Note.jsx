import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import spanishStrings from 'react-timeago/lib/language-strings/es';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Tippy from '@tippy.js/react'
import Axios from 'axios';
const formatter = buildFormatter(spanishStrings);

class Note extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            visitors: props.visitors,
            savedBy: props.savedBy,
            title: props.title,
            content: props.content,
            createdAt: props.createdAt,
            createdBy: props.createdBy,
            userId: 0,
            userName: ''
        }
    }

    getUser = (userId) => {
        Axios.get(`http://localhost:8000/api/user/${userId}`)
            .then((res) => {
                this.setState({
                    userId: res.data._id,
                    userName: res.data.username
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentWillMount() {
        this.getUser(this.state.createdBy);
    }

    render() {
        return (
            <div className='Note row'>
                <div className='column column-20'></div>
                <div className='column'>
                    <hr />
                    <h4><img alt='' src="https://via.placeholder.com/50" /><span>{this.state.userName}</span></h4>
                    <h6>{this.state.title}</h6>
                    <pre>{this.state.content}</pre>
                    <p className='infoNote'>

                        <Tippy content='Visitas'>
                            <span><i className="fas fa-eye"></i> {this.state.visitors}</span>
                        </Tippy>
                        <Tippy content='Veces guardada'>
                            <span><i className="fas fa-save"></i> {this.state.savedBy}</span>
                        </Tippy>
                        <em>Creado <TimeAgo date={this.state.createdAt} formatter={formatter} /></em>
                    </p>
                </div>
                <div className='column column-20'></div>
            </div>
        )
    }
}

export default Note