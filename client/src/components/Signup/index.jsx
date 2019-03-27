import AuthMethods from "../AuthMethods";

const Auth = new AuthMethods();

axios.post('/signup', {
    email: this.state.email,
    password: this.state.password
}).then(data => {
    console.log(data);
    this.props.history.replace("/login");
});