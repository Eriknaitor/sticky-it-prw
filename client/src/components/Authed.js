import React, {Component} from 'react';
import AuthMethods from "./AuthMethods";

export default function Authed(AuthComponent) {
    const Auth = new AuthMethods();

    return class AuthWrapped extends Component {
        state = {
            confirm: null,
            loaded: false
        };

        componentDidMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace("/login");
            } else {
                try {
                    const confirm = Auth.getConfirm();
                    console.log(`La confirmación es ${confirm}`);
                    this.setState({
                        confirm: confirm,
                        loaded: true
                    });
                } catch (err) {
                    console.log(err);
                    Auth.logout();
                    this.props.history.replace("/login");
                }
            }
        }

        render() {
            if (this.state.loaded) {
                if (this.state.confirm) {
                    return (
                        <AuthComponent
                          history={this.props.history}
                          confirm={this.state.confirm}
                        />
                    );
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
}