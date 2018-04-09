<<<<<<< current
var React = require('react');
//var Login = require('./login-component.jsx');
var Admin = require('./admin-component.jsx');

require('./style.css');

class ChatAppComponent extends React.Component {

    constructor() {
        super();
  //setting initial states that needs a value (empty arrays works as backup for functions like filter and map to run)
        this.state = {
            user: undefined,
            rec: undefined,
            string: '',
            messages: [],
            tfmsg: [],
            allUsers: [],
            exclude: [],
            login: 'on',
            register: 'off',
            signBody: 'sign-body',
            query: '',
            queryRes: [],
            reqCount: 0,
            showReq: 'hide-req',
            friends: [],
            fullFriends: [],
            emojis: ['😀', '😂', '😊', '😍', '😜', '😎', '😡', '😳' ],
            adminMessages: []
        };
  //binding my functions
        this.sendString = this.sendString.bind(this);
        this.testCall = this.testCall.bind(this);
        this.register = this.register.bind(this);
        this.signIn = this.signIn.bind(this);
        this.searchFriends = this.searchFriends.bind(this);
        this.friendRequest = this.friendRequest.bind(this);
        this.reqFind = this.reqFind.bind(this);
        this.confirmFriend = this.confirmFriend.bind(this);
        this.findFriends = this.findFriends.bind(this);
        this.lastCheck = this.lastCheck.bind(this);
        this.missedChat = this.missedChat.bind(this);
        /*this.adminContact = this.adminContact.bind(this);
        this.adminBan = this.adminBan.bind(this);
        this.adminHistory = this.adminHistory.bind(this);
        this.deleteMsg = this.deleteMsg.bind(this);*/
    }
/*
    deleteMsg(msg){
      console.log(msg);
    }

    adminHistory(user){
      fetch('/adminstring?from=' + user.name).then(function (response) {
              return response.json();
          }).then(function (result) {

              this.setState({adminMessages: result,
              adminAction: 'history',
              adminUser: user.name });
          }.bind(this));

    }

    adminContact(user){
      console.log('contact:', user);
      this.setState({adminAction: 'message'});
    }

    adminBan(user){

      fetch('/deleteuser' + user._id, {
        method: 'DELETE'
      }).then(this.getApts.bind(this));

      console.log('ban:', user);
      this.setState({adminAction: 'delete',
        adminUser: user.name});
    }
    */
//Checking for messages since user last logged out
    missedChat(){
        fetch('/onloadmsg?time=' + Number(this.state.checked) + '&user=' + this.state.user ).then(function (response) {
            return response.json();
        }).then(function (result) {
            this.setState({ missedMsg: result,
                missedMsgCount: result.length});
        }.bind(this));

    }

//switching user status to offline when unmounting component
    lastCheck(){
        if(this.state.user !== undefined){
            fetch('/status?status=offline&user=' + this.state.user, {
                body: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            });
        }

        if(this.state.user !== undefined){
            fetch('/check?date=' + Date.now() + '&user=' + this.state.user, {
                body: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            });
        }
    }

    //
    findFriends(){
//get object of current user and look up the 'friends'-key
        var friends = this.state.allUsers.filter(function(me){
            return me.name === this.state.user;
        }.bind(this)).filter(function(friends){
            return friends.friends;
        });
//check which of those friends has status 'confirmed'
        var confirmed = friends[0].friends.filter(function(confirmed){
            return confirmed.status === 'confirmed';
        });
//save those friends under this.state.friends
        this.setState({ friends: confirmed });

var newFriends = '';

confirmed.map(function(user){
    return newFriends = newFriends + user.name + '/';
  });
//add the names of friends,separated by / as a string. Use the string to fetch users matching the name of the friends
            fetch('/friends?friend=' + newFriends).then(function (response){
              return response.json();
            }).then(function(result){

              this.setState({ fullFriends: result });

            }.bind(this));

  }

//update status of friend request on user and friend
    confirmFriend(req){
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

    reqFind(){

        setInterval(function(){
//set state checked to see when user logged out
            var checked = this.state.allUsers.filter(function(checked){
                return checked.name == this.state.user;
            }.bind(this)).map(function(since){
                return since.checkout;
            });

            this.setState({
                checked: checked[0]
            }, this.missedChat);

            if(this.state.user && this.state.password != undefined ) {
//Check for friend requests every second
                var x = this.state.allUsers.filter(function(user){
                    return user.name === this.state.user;
                }.bind(this));

                if (x.length > 0 && x[0].friends) {
                    var count = x[0].friends.map(function(value){
                        return Object.entries(value);
                    }).filter(function(count){
                        if(count.length == 2){
                            return count[1][1] === 'pending';
                        }
                    });

                    this.setState({reqCount: count.length,
                        req: count}, this.findFriends);
                }
            }
        }.bind(this), 1000);

    }

    friendRequest(user){
//set friend requests
        this.setState({query: '' });

        fetch('/user/' + this.state.user, {
            body: '{"name": "' + user + '", "status": "sent"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        fetch('/user/' + user, {
            body: '{"name": "' + this.state.user + '", "status": "pending"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
    }
//match search against friends with whom you are not friends or have a pending request
    searchFriends(event){
        this.setState({query: event.target.value}, function(){

            var myFriends = this.state.allUsers.filter(function(me){
                return me.name === this.state.user;
            }.bind(this)).filter(function(friends){
                if (friends.friends){
                    return friends.friends;
                }
                return;
            });

            if (myFriends.length > 0){

                var exclude = myFriends[0].friends.filter(function(exclude){
                    return exclude.status === 'sent' || exclude.status === 'pending' || exclude.status === 'confirmed';
                });
            }

            var resObj = {};
            this.state.allUsers.map(function(result){
                return resObj[result.name] = '';
            });
            if(exclude != undefined){
                exclude.map(function(ex){
                    return delete resObj[ex.name];
                });
            }

            delete resObj[this.state.user];

            var match = Object.keys(resObj).filter(function (user){
                return user.includes(this.state.query);
            }.bind(this));

            this.setState({queryRes: match});

        }.bind(this));
    }
//register a new user if name is not taken and passwords matches
    register(){
        this.setState({user: this.state.newUserInput,
            password: this.state.newPasswordInput }, function(){

            var liam = this.state.allUsers.filter(function(name){
                return name.name == this.state.newUserInput;
            }.bind(this));

            this.state.newUserInput !== undefined && liam.length > 0 ? this.setState({error: <h2>Sorry, username is already taken</h2>}) : this.state.newPasswordInput !== this.state.confirmNewPasswordInput ? this.setState({error: <h2>Passwords does not match</h2>}) :
                fetch('/user', {
                    body: '{"name":"' + this.state.user + '", "password":"' + this.state.password + '", "status": "online"}',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then( this.setState({login: 'off'}));
        });
    }

//sign in if username matches the password
    signIn(){
        this.setState({user: this.state.userInput,
            password: this.state.passwordInput }, function(){
            var check = this.state.allUsers.filter(function(test){
                return  test.name === this.state.user;
            }.bind(this));

            check.length > 0  && check[0].password === this.state.password ? this.setState({login: 'off' }) : this.setState({pwError: <h2>wrong password or username</h2>});
        });
}
//send string with to and from
    sendString() {
        fetch('/string', {
            body: '{"from": "' + this.state.user + '", "to": "' + this.state.rec + '", "string": "' + this.state.string + '", "stamp":' + Date.now() + '}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(this.testCall.bind(this));
    }
//reset input and scroll to bottom of chat
    testCall() {
        this.setState({string: ''});
        document.getElementsByClassName('field')[0].scrollTop = document.getElementsByClassName('field')[0].scrollHeight;

    }

    componentDidMount(){
//fetch states we need from the beginning
        window.addEventListener('beforeunload', this.lastCheck);

        setInterval(function(){

          var adminMsg = this.state.allUsers.filter(function(me){
              return me.name === this.state.user;
          }.bind(this));

          if(adminMsg[0] && adminMsg[0].mail){
            this.setState({ adminMessages: adminMsg[0].mail });
          }
/*
            var online = this.state.allUsers.filter(function(ol){
              return ol.status === 'online';
            });

            this.setState({online: online});
*/
          if (this.state.user && this.state.login === 'off') {
            fetch('/status?status=online&user=' + this.state.user, {
              body: {},
              headers: {
                  'Content-Type': 'application/json'
              },
              method: 'PUT'
          });
        }
/*
        if(this.state.user === 'admin'){
          fetch('/tfmsg?time=' + Number(Date.now() - 86400000)).then(function (response) {
            return response.json();
          }).then(function (result) {
            this.setState({tfmsg: result});
          }.bind(this));
          }
*/
            fetch('/user').then(function (response) {
                return response.json();
            }).then(function (result) {
                this.setState({allUsers: result});
            }.bind(this));

            if(this.state.user != undefined && this.state.rec === 'public'){
                fetch('/public').then(function (response) {
                    return response.json();
                }).then(function (result) {
                    this.setState({messages: result});
                }.bind(this));
            }else if(this.state.user != undefined && this.state.rec != undefined){
                fetch('/string?from=' + this.state.user + '&to=' + this.state.rec ).then(function (response) {
                    return response.json();
                }).then(function (result) {
                    this.setState({messages: result});
                }.bind(this));
            }
        }.bind(this), 500, this.reqFind());

    }
//set logout key to user when signing out
    componentWillUnmount() {
        this.lastCheck();
        window.removeEventListener('beforeunload', this.lastCheck);
    }


    render() {

        return <div>
{//login
}
          <div class={this.state.login}>
                <div class="sign-in">

                    <div class={this.state.signBody}>
                      <img src="logo.svg"></img>
                        <h3>log in</h3>
                        <input placeholder="user name" value={this.state.userInput} onChange={function(event){
                            this.setState({userInput: event.target.value});
                        }.bind(this)}></input><br/>

                        <input type="password" placeholder="password" value={this.state.passwordInput} onChange={function(event){
                            this.setState({passwordInput: event.target.value});
                        }.bind(this)}></input><br/>
                        <button onClick={this.signIn}>log in</button><br/>
                        {this.state.pwError}

                        <p>Not a member? No problem, you can register in just a few clicks!</p>

                        <button onClick={function(){
                            this.setState({register: 'on', signBody: 'off'});
                        }.bind(this)}>Sign Up Now</button>
                    </div>
    {//register
    }
                    <div class={this.state.register}>
                        <div class="register">
                          <img src="logo.svg"></img>
                            <h3>Thank you for choosing chatApp</h3>
                            <p>Just fill out the form and you are good to go!</p>
                            <input placeholder="username" value={this.state.newUserInput} onChange={function(event){
                                this.setState({newUserInput: event.target.value});
                            }.bind(this)}></input><br/>

                            <input type="password" placeholder="password" value={this.state.newPasswordInput} onChange={function(event){
                                this.setState({newPasswordInput: event.target.value});
                            }.bind(this)}></input><br/>

                            <input type="password" placeholder="confirm password" value={this.state.confirmNewPasswordInput} onChange={function(event){
                                this.setState({confirmNewPasswordInput: event.target.value});
                            }.bind(this)}></input><br/>

                            <button onClick={this.register}>register</button>
                        </div>
                        {this.state.error}
                    </div>
                </div>
            </div>

{//user page
}
            {this.state.user !=='admin' ? <div>
              <div id="header">
                <img src="logo-white.svg"></img>
                <p>logged in as: <b>{this.state.user}</b></p>
                <p class="instruct">send friend request</p>
                <input placeholder="search users" value={this.state.query} onChange={this.searchFriends}/>


                <div class="search-result">
                    <ul>
                        {this.state.query !=='' &&
                         this.state.queryRes.map(function(res){
                             return <li key={res} onClick={this.friendRequest.bind(this, res)}>{res}
                             </li>;
                         }.bind(this))}
                    </ul>
                </div>
            </div>
{//side menu
}
            <div class="widget">
              <p>friend requests: <b>{this.state.reqCount}</b></p>
            <ul>{this.state.req && this.state.req.map(function(req){
                return <li onClick={this.confirmFriend.bind(this, req)}>{req[0][1]}</li>;
            }.bind(this))}</ul>

            <p class='missed'>what you missed: <b>{ this.state.missedMsgCount}</b></p>

            <ul>{this.state.missedMsg && this.state.missedMsg.map(function(missed){
                  return <li onClick={function(){
                      this.setState({rec: missed.from});
                    }.bind(this)}>{missed.from} said: <i>{missed.string}</i></li>;
              }.bind(this))}</ul>

              <div id="friends-list">

                <p onClick={function(){
                    this.setState({rec: 'public'});
                  }.bind(this)}>Public Chat</p>

                {this.state.friends.length > 0 ? <p>your friends: </p> : <p> No friends yet</p>}

                <ul>

                  {this.state.fullFriends.map(function(user) {
                    if(user.status === 'online'){
                      return <li class="active" key={user._id} value={user.name}  onClick={function() {
                          this.setState({rec: user.name});
                      }.bind(this)}>{user.name} ({user.status})</li>;
                    }else {
                      return <li key={user._id} value={user.name}  onClick={function() {
                          this.setState({rec: user.name});
                      }.bind(this)}>{user.name} ({user.status})</li>;
                    }
                  }.bind(this))}
                </ul>

              </div>

              <p>admin messages</p>
              <ul>{this.state.adminMessages.length > 0 && this.state.adminMessages.map(function(msg){
                  if(msg.status === 'unread'){
                    return <li class="active" onClick={function(){

                      this.setState({rec: 'admin',
                                notification: msg});

                      fetch('/adminmail?user='+ this.state.user +'&mail=' + msg.id, {
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          method: 'PUT'
                      });
                      }.bind(this)
                    }>{msg.subject}</li>;
                  } else {
                    return <li onClick={function(){
                      this.setState({rec: 'admin',
                                notification: msg});
                      }.bind(this)
                      }>{msg.subject}</li>;
                  }

                }.bind(this))}

              </ul>

              <p onClick={function(){
                  this.setState({rec: 'contactAdmin'});
                }.bind(this)}>contact admin</p>

            </div>
{//main body of page
}
            <div class="main">

              {this.state.rec === 'contactAdmin' && <div class="field">
                <h1>Contact admin</h1>
                <input placeholder="Subject"></input><br/>
                <input placeholder="Report user"></input><br/>
                <textarea placeholder="Message"></textarea><br/>
              </div>}

            {this.state.rec === 'admin' && <div class="field">
              <h1>{this.state.notification.subject}</h1>
              <p>{this.state.notification.message}</p>
            </div>}

            {this.state.user === undefined || this.state.rec === undefined ? <div class="field"><h1>welcome to ChatApp!</h1></div> : <div><div class='field'>
                {this.state.messages.map(function(msg) {
                    var message = msg.string.replace(/hora|fitta|skit|jävla|kurwa|spierdalaj/gi, function(string){
                      var ret = '';
                      for(var i = 0; i < string.length; i++){
                        ret = ret + '*';
                      }
                      return ret;
                    });

                    var marker = msg.from === this.state.user ? 'send': 'rec';
                    var sender = msg.from === this.state.user ? 'you': msg.from;
                    return <p class={marker}><span>{sender}: </span>{message}</p>;
                }.bind(this))}
            </div>

            {this.state.rec !== undefined && this.state.rec !== 'admin' && this.state.rec !== 'contactAdmin' && <div id="post">

                <div id="emoji-cont">
                    <div id="emoji-menu" onClick={function(){
                        if(this.state.toggleEmo === 'hide-emos'){
                            this.setState({toggleEmo: 'show-emos'});
                        }else{
                            this.setState({toggleEmo: 'hide-emos'});
                        }
                    }.bind(this)}>emojis</div>
                    <div id={this.state.toggleEmo}>
                        {this.state.emojis.map(function(emoji){
                            return <span onClick={function(){
                                this.setState({string: (this.state.string) + emoji });
                            }.bind(this)}>{emoji}</span>;
                        }.bind(this))}
                    </div>
                </div>
                <input value={this.state.string} onChange={function(event){
                    this.setState({string: event.target.value});
                }.bind(this)} onKeyPress={function(e){
                    if(e.key === 'Enter'){
                        this.sendString();
                    }}.bind(this)}></input>

                <button onClick={this.sendString}
                >send</button>
            </div>}


            </div>
            }

          </div>
{//admin page
}
        </div> : <Admin users={this.state.allUsers}></Admin>

        /* <div class="admin-page">
        <div id="admin-users">
        <h1>users</h1>
        <table class="admin-list"><tbody>
          {this.state.allUsers.map(function(user){
            return <tr><td onClick={this.adminHistory.bind(this, user)} key={user._id}> {user.name} </td><td><button onClick={this.adminContact.bind(this, user)}>contact</button></td><td><button onClick={this.adminBan.bind(this, user)}>ban</button></td></tr>;
          }.bind(this))}
        </tbody></table>
        </div>

        <div id="admin-action">

          {this.state.adminAction === 'history' && <div>
            <h1>history ({this.state.adminUser})</h1>
            <ul class='admin-ul'>
              {this.state.adminMessages.length > 0 && this.state.adminMessages.map(function(msg){
                return <li>{msg.string} ({msg.to}) <button onClick={this.deleteMsg.bind(this, msg)}>delete</button></li>;
              }.bind(this))}
            </ul>
          </div>}

          {this.state.adminAction === 'message' && <div>
            <h1>contact</h1>
            <textarea>
            </textarea>
            <button>send</button>
          </div>}

          {this.state.adminAction === 'delete' && <div>
            <h2>User has been deleted</h2>
          </div>
        }

        </div>

        <div id="admin-info">
          <h1>admin info</h1>
            <h2>stats</h2>
            <p>total users: <b> {this.state.allUsers.length}</b></p>
            <p>users online: <b>{this.state.online.length}</b></p>
            <p>messages last 24h: <b>{this.state.tfmsg.length}</b></p>
          <h2>messages</h2>

        </div>

        </div>
        */

      }

        </div>;
    }
}
module.exports = ChatAppComponent;
=======
var React = require('react');
var emoji = require('react-easy-emoji');

require('./style.css');

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
			'friendname': 'edvin',
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
        this.emailChangeHandler = this.usernameSubmitHandler.bind(this);
        this.emailConfChangeHandler = this.usernameSubmitHandler.bind(this);
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

          <div id={this.state.login}>
            <h1>Welcome to ChatApp!</h1>
            <h2>The universal chat, for you!</h2>
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
        <div id="window">
            <h1>ChatApp!</h1>
            <div className="login-pop">
                <form onSubmit={this.usernameSubmitHandler} className="username-container">
                    <h1>React Instant Chat</h1>
                    <div>

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

            {    // Checks if this.state.users is defined. If it is defined, the array is mapped and returns a list of users. By clicking a name in the list we know who we are and to whom we want to send a request.

                <div class='users'>
                <ul>
                    {this.state.users !== undefined &&
              this.state.users.map(function(user){
                  return <li key={user._id} onClick={this.friendRequest.bind(this, user)}>{user.name}</li>;
              }.bind(this))
                    }
                </ul>
            </div>}
        </div>;
    }
}
//make compone;nt available for import
///använd this.state.user för att skriva ut om det är du som skrivit meddelande
//make compone;nt available for import
module.exports = ChatAppComponent;
>>>>>>> before discard
