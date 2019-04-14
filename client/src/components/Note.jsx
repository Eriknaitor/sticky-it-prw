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
            id: props.id,
            likes: props.likes,
            savedBy: props.savedBy,
            title: props.title,
            content: props.content,
            createdAt: props.createdAt,
            createdBy: props.createdBy,
            userId: 0,
            userName: '',
            avatar: ''
        }
    }



    getUser = (userId) => {
        Axios.get(`http://localhost:8000/api/user/${userId}`)
            .then((res) => {
                this.setState({
                    userId: res.data.user._id,
                    userName: res.data.user.username,
                    avatar: res.data.user.avatar
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
        const randomColor = {
            background: `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
        };

        const likes = document.querySelectorAll('.like');

        likes.forEach(like => {
            like.addEventListener('mouseover', () => {
                like.classList.remove('far');
                like.classList.add('fas');
            });

            like.addEventListener('mouseout', () => {
                like.classList.remove('fas');
                like.classList.add('far');
            });
        });

        return (
            <div className="Note row slide-in-right">
                <div className="decorator" style={randomColor}></div>
                <div className="right-panel column column-20">
                    <div className="controllers">
                        <i className="fas fa-edit"></i>
                        <Tippy content={`${this.state.savedBy} veces guardada`}>
                            <i className="fas fa-user"></i>
                        </Tippy><br />
                        <i className="like far fa-heart"></i>
                        <i className="fas fa-flag"></i>
                    </div>
                </div>
                <div className="body-panel column column-70">
                    <div className="body-info">
                        <Link to={`/profile/${this.state.createdBy}`}><strong>{this.state.userName}</strong></Link>
                        <small><TimeAgo date={this.state.createdAt} formatter={formatter} /></small>
                    </div>
                    <h5>{this.state.title}</h5>
                    <p>{this.state.content}</p>
                </div>
            </div >
        )
    }
}

export default Note;

