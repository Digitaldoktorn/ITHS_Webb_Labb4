var React = require('react');
require('./style.css');

class ChatAppComponent extends React.Component {
    //building component, setting initial state 'user', possible to bind functions from here
    constructor() {
        super();
        this.state = {
            user: undefined,
            loginScreen: 'show',
            login: 'login',
            register: 'register',
            login: 'on',
        };
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.passwordConfChangeHandler = this.usernameSubmitHandler.bind(this);
        this.emailChangeHandler = this.usernameSubmitHandler.bind(this);
        this.emailConfChangeHandler = this.usernameSubmitHandler.bind(this);
        this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.regName = this.regName.bind(this);

    }

    //here we can add all our other functions
    saveMsg(event) {
        this.setState({msg: event.target.value});
    }

    sendMsg() {
        console.log(this.state.msg);
        fetch('/message', {
            body: '{"msg": "' + this.state.msg + '"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }
    //Good place to load data from database that will be avaliable when component has loaded. Note! render will run once before this function, so you might need to either set initial state or make the render conditional!
    componentDidMount(){

        // Checks if there are any new friend requests every second.
        setInterval(function(){
            var user1 = this.state.users.filter(function(user){
                return user.name === this.state.user;
            }.bind(this));

            fetch('/message').then(function (response) {
                return response.json();
            }).then(function (result) {
                console.log(result);
            });

            fetch('/user').then(function (response) {
                return response.json();
            }).then(function (result) {
                this.setState({users: result});
            }.bind(this));

        }.bind(this), 1000);
    }

    reqFind(){
        if (user1.length > 0 && user1[0].friends){
            var friendrequests = x[0].friends.map(function(value){
                return Object.entries(value);
            }).filter(function(count){
                if(count.length == 2){
                    return count[1][1] === 'pending';
                }
            });
        }
        this.setState({req: friendrequests}, this.findFriends);
    }


    confirmFriend(req){ // recieves the object
        this.setState({showReq: 'hide-req' });
        fetch('/confirm?name='+ this.state.user +'&name2=' + req[0][1], {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        fetch('/confirm?name='+ req[0][1] +'&name2=' + this.state.user, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
    }

    // Updating statuses of friend requests
    friendRequest(user){
        fetch('/user' + this.state.user, {
            body:'{"name":} "' + user.name + '", "status": "sent"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        fetch('/user/' + user.name, {
            body: '{"name": "' + this.state.user + '", "status": "pending"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        /*fetch('/user').then(function (response) {
            return response.json();
        }).then(function (result) {
        console.log(result);
        response.send({"name": result} === {this.state.username} && {"password": result} === {this.state.password}  );
    }*/

    register(){
        this.setState({user: this.state.regName,
                      password: this.state.passwordChangeHandler }, function(){
            var occupied = this.state.allUsers.filter(function(user){
                return user.name == this.state.regName;
            }.bind(this));

            this.state.regName !== undefined && occupied.length > 0 ? this.setState({error: <h2>Sorry, username is already taken</h2>}) : this.state.passwordChangeHandler  !== this.state.passwordConfChangeHandler ? this.setState({error: <h2>Passwords does not match</h2>}) :
                fetch('/user', {
                    body: '{"name":"' + this.state.user + '", "password":"' + this.state.password + '"}',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then( this.setState({login: 'off'}));
});

    submitLogin() {
        console.log(this.state.username, this.state.password);
    }

    submitSignUp(){
        console.log(this.state.username, this.state.password, this.state.passwordConf, this.state.email, this.state.emailConf);
    }

    usernameChangeHandler(event) {
        this.setState({ username: event.target.value });
    }

    regName(event) {
        this.setState({ regname: event.target.value });
    }

    passwordChangeHandler(e) {
        this.setState({ password: e.target.value });
    }

    passwordConfChangeHandler(event) {
        this.setState({ passwordConf: event.target.value });
    }

    emailChangeHandler(event) {
        this.setState({ email: event.target.value });
    }

    emailConfChangeHandler(event) {
        this.setState({ emailConf: event.target.value });
    }

    usernameSubmitHandler(event) {event.preventDefault();
        this.setState({ submitted: true, username: this.state.username });}

    //Function runs when exiting component, we can use this to toggle user as offline or see last time user signed in
    componentWillUnmount() {
        console.log('shutting down');
    }

    //What will show up in the browser
    render() {
        return <div>
          <div id={this.state.login}>
            <h1>Izas updates</h1>
            <form className="username-container">
                <h1>Log in</h1>
                <div>
                    <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required /> </div>
                <div>
                    <input type="password" onChange={this.passwordChangeHandler} placeholder="Enter a password..." required /> </div>


                <button type="submit" onClick={function(){this.setState({login: 'none'}, this.submitLogin);}.bind(this)}>Log in</button></form>

            <p>Don't have an account?</p>
            <button type="submit" onClick={function(){this.setState({register: 'block', login: 'none'});}.bind(this)}>Sign up here</button>
        </div>

        <div id={this.state.register}>
            <form className="username-container">
                <h1>Register</h1>
                <div>
                    <input type="text" onChange={this.regName} placeholder="Enter a username..." required /> </div>
                <div>
                    <input type="email" onChange={this.emailChangeHandler} placeholder="Enter an email..." required /> </div>
                <div>
                    <input type="email" onChange={this.emailConfChangeHandler} placeholder="Confirm an email..." required /> </div>
                <div>
                    <input type="password" onChange={this.passwordChangeHandler} placeholder="Enter a password..." required /> </div>
                <div>
                    <input type="password" onChange={this.passwordConfChangeHandler} placeholder="Confirm a password..." required /> </div>
                <button type="submit" onClick={function(){this.setState({register: 'none'}, this.submitSignUp);}.bind(this)}>Register</button></form>
        </div>
        <h1>chatapp!!</h1>
        </div>;
    }


}

//make compone;nt available for import
module.exports = ChatAppComponent;
