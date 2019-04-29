import React, { Fragment, Component } from 'react';
import Axios from 'axios';


export default class Admin extends Component {
    constructor() {
        super();

        this.state = {
            error: false,
            isLoading: false,
            userPerPage: 10,
            counter: 0,
            tab: "0",
            users: []
        };
    }

    componentWillMount() {
        this._loadUsers();
    }

    _loadUsers() {
        Axios.get(`http://localhost:8000/api/users?index=${this.state.counter}`)
            .then((res) => {
                const nextUsers = res.data.users.map(user => ({
                    _id: user._id,
                    role: user.role,
                    isEnabled2FA: user.isEnabled2FA,
                    email: user.email,
                    username: user.username
                }));
                this.setState({
                    users: [...nextUsers],
                    isLoading: false,
                    totalUsers: res.data.count
                });
            }).catch((err) => {
                this.setState({
                    error: err.message,
                    isLoading: false
                })
            });
    }

    _handleClick(e) {
        this.setState({
            counter: e.target.id * 10,
            currentPage: Number(e.target.id)
        }, () => {
            this._loadUsers();
        });
    }

    _handleBan(id) {
        if (window.confirm('Vas a banear a este usuario, esta opción no se puede deshacer, ¿estas seguro?')) {
            Axios.delete(`http://localhost:8000/api/user/delete/${id}`)
                .then(() => {
                    this._loadUsers();
                })
        }
    }

    _handleTabs(e) {
        this.setState({ tab: e.target.id });
    }

    render() {

        const { error, users, totalUsers, userPerPage } = this.state;

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalUsers / userPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(n => {
            return (<li key={n - 1} id={n - 1} onClick={this._handleClick.bind(this)} > {n}</li >)
        });


        return (
            <div className="AdminPanel">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre de usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>2FA</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <Fragment key={user._id}>
                                <tr>
                                    <td>{user._id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.isEnabled2FA ? (<i className="fas fa-lock"></i>) : (<i className="fas fa-lock-open"></i>)}</td>
                                    <td className="controller">
                                        <i onClick={() => this._handleBan(user._id)} className="fas fa-gavel"></i>
                                    </td>
                                </tr>
                            </Fragment>
                        ))}
                        {error &&
                            <div style={{ color: '#900' }}>
                                {error}
                            </div>
                        }
                    </tbody>
                </table>
                <ul id="paginator">
                    {renderPageNumbers}
                </ul>

            </div >
        )
    }
}