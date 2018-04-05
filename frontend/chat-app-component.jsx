var React = require('react');
require('./style.css');
//require('./fonts/candy-inc/billy-argel_candy-inc/CANDY___.ttf');
//var logo = require('./images/logo.png');

class ChatAppComponent extends React.Component {
//building component, setting initial state 'user', possible to bind functions from here
    constructor() {
        super();
        this.state = {
            user: '',
            msg: '',
            friend: '',
            allMessages: [],
            loginScreen: 'show',
            login: 'login',
            register: 'register',
            users: [ 	{
	'_id': '5ab63f64d26c7b053ed879df',
	'name': 'user1',
	'password': 'abcd',
	'checkout': 'true',
	'friends': [
		{
			'friendsname': 'user2',
			'status': 'confirmed'
		},
		{
			'friendsname': 'user3',
			'status': 'pending'
		},
		{
			'friendsname': 'edvin',
			'status': 'pending'
		},
		{
			'friendsname': 'edvin',
			'status': 'pending'
		},
		{
			'friendsname': 'edvin',
			'status': 'pending'
		}
	]
}]
        };
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.passwordConfChangeHandler = this.usernameSubmitHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.emailConfChangeHandler = this.emailConfChangeHandler.bind(this);
        this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
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
        this.setState({msg: ''});
    }


    //Good place to load data from database that will be avaliable when component has loaded. Note! render will run once before this function, so you might need to either set initial state or make the render conditional!
    componentDidMount(){

        setInterval(function(){

            fetch('/message').then(function (response) {
                return response.json();
            }).then(function (result) {
                this.setState({allMessages: result});
                document.getElementsByClassName('all-messages')[0].scrollTop = document.getElementsByClassName('all-messages')[0].scrollHeight;
            }.bind(this));

            fetch('/user').then(function (response) {
                return response.json();
            }).then(function (result) {
                return result;
            });
        }.bind(this), 300);

    }

    submitLogin() {
        //console.log(this.state.username, this.state.password);
    }

    submitSignUp(){
        //console.log(this.state.username, this.state.password, this.state.passwordConf, this.state.email, this.state.emailConf);
    }

    usernameChangeHandler(event) {
        this.setState({ username: event.target.value });
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

    usernameSubmitHandler(event) {
          event.preventDefault();
            this.setState({ submitted: true, username: this.state.username });

          }

        /*fetch('/user/' + user.name, {
            body: '{"name": "' + this.state.user + '", "status": "pending"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });*/

        /*fetch('/user').then(function (response) {
            return response.json();
        }).then(function (result) {
        console.log(result);
        response.send({"name": result} === {this.state.username} && {"password": result} === {this.state.password}  );
    }*/

    register(){
        this.setState({user: this.state.username,
                      password: this.state.password }, function(){
            var occupied = this.state.allUsers.filter(function(user){
                return user.name == this.state.username;
            }.bind(this));

            this.state.username !== undefined && occupied.length > 0 ? this.setState({error: <h2>Sorry, username is already taken</h2>}) : this.state.password  !== this.state.passwordConf ? this.setState({error: <h2>Passwords does not match</h2>}) :
                fetch('/user', {
                    body: '{"name":"' + this.state.user + '", "password":"' + this.state.password + '"}',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then( this.setState({login: 'off'}));
});
}


friendRequest(user){
  console.log(user);
}

    //Function runs when exiting component, we can use this to toggle user as offline or see last time user signed in
    componentWillUnmount() {
        console.log('shutting down');
    }


    render() {
        return <div>
                  <div id={this.state.login}>
                    <div><img src="logo.png"/></div>//does not work
                      <div id="welcome_msg">
                   <h1>Welcome to ChatApp!</h1>
                   <h2>The chat for you!</h2>
                   </div>
                    <div className="start_container">
                      <form>
                        <h1>Log in</h1>
                        <div className="login">
                          <input className= "input_start" type="text" onChange={this.usernameChangeHandler} placeholder="Username" required />
                        </div>
                        <div>
                          <input className= "input_start" type="password" onChange={this.passwordChangeHandler} placeholder="Password" required /></div>
                          <button className= "button_start" type="submit" onClick={function(){this.setState({login: 'none'}, this.submitLogin);}.bind(this)}>Log in</button>
                        </form>
                        <p>Don't have an account?</p>
                        <button className="button_start" type="submit" onClick={function(){this.setState({register: 'block', login: 'none'});}.bind(this)}>Sign up here</button>
                      </div>
                    </div>

        <div id={this.state.register}>
            <form className="start_container">
                <h1>Register</h1>
                <div>
                    <input type="text" onChange={this.usernameSubmitHandler} placeholder="Username" required /> </div>
                <div>
                    <input type="email" onChange={this.emailChangeHandler} placeholder="Email" required /> </div>
                <div>
                    <input type="email" onChange={this.emailConfChangeHandler} placeholder="Confirm your email" required /> </div>
                <div>
                    <input type="password" onChange={this.passwordChangeHandler} placeholder="Password" required /> </div>
                <div>
                    <input type="password" onChange={this.passwordConfChangeHandler} placeholder="Confirm your password" required /> </div>
                <button className="button_start" type="submit" onClick={function(){this.setState({register: 'none'}, this.submitSignUp);}.bind(this)}>Register</button></form>
        </div>

        <div id="window">

            <div>
              <div id="profile">
                <div id="profile_box">
                  <div><img id="profile_picture" src="user.jpg"/></div>
                  <p>John Snow</p><p>Arizona, USA</p></div>
                  <div id="profile_list">
                    <h3>Friends</h3>
                    <h3>Notification</h3>
                    <h3>Messages</h3>
                    <h3>Pictures</h3>
                    <h3>Friends</h3>
                    <h3>Groups</h3>
                    <h3>Settings</h3>
                  </div>
              </div>
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

                <div className="all-messages">{this.state.allMessages.map(function(message) {
                    return <p><span></span>{message.msg}</p>;
                })}</div>

                <input className="textbox" type="text" value={this.state.msg} onChange={this.saveMsg} onKeyPress={function(e) {
                    if (e.key === 'Enter'){
                        this.sendMsg();
                    }
                }.bind(this)}/>
                <button type="submit" onClick={this.sendMsg}>Send</button>
            </div>

                <div class='users'>
                <ul>{this.state.users !== undefined &&
              this.state.users.map(function(user){
                  return <li key={user._id} onClick={this.friendRequest.bind(this, user)}>{user.name}</li>;
              }.bind(this))
                    }</ul>
            </div>
        </div>
      </div>;
}
}
//make compone;nt available for import
///använd this.state.user för att skriva ut om det är du som skrivit meddelande
//make compone;nt available for import
module.exports = ChatAppComponent;
