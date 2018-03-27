var React = require('react');
require('./style.css');

class ChatAppComponent extends React.Component {
    //building component, setting initial state 'user', possible to bind functions from here
    constructor() {
        super();
        this.state = {
            user: '',
            msg: ''
        };
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
        this.saveMsg = this.saveMsg.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
    }

    //here we can add all our other functions
    saveMsg(event) {
        this.setState({msg: event.target.value});
    }

    sendMsg() {    // from:   to:
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
    }

    usernameChangeHandler(event) {
        this.setState({ username: event.target.value });
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
                <div className="login">
                    <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required />
                </div>
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
                    <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required /> </div>
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
        <div>
            <h1>ChatApp!</h1>
            <div className="login-pop">
                <form onSubmit={this.usernameSubmitHandler} className="username-container">
                    <h1>React Instant Chat</h1>
                    <div>
                        <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>

            <h1>ChatApp!</h1>
            <form onSubmit={this.usernameSubmitHandler} className="username-container">
                <h1>React Instant Chat</h1>
                <div>
                    <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required />
                </div>
                <input type="submit" value="Submit" />
            </form>

            <div>
                <input className="textrutan" type="text" value={this.state.msg} onChange={this.saveMsg}></input><button onClick={this.sendMsg}>Send</button>
            </div>

            // Checks if this.state.users is defined. If it is defined, the array is mapped and returns a list of users. By clicking a name in the list we know who we are and to whom we want to send a request.
            <div class='users'>
                <ul>
                    {this.state.users !== undefined &&
              this.state.users.map(function(users){
                  return <li key={user._id} onClick={this.friendRequest.bind(this, user)}>{user.name}</li>;
              }.bind(this))
                    }
                </ul>
            </div>


        </div>;
    }


}

//make compone;nt available for import
module.exports = ChatAppComponent;
