var React = require('react');
//var Login = require('./login-component.jsx');
var Admin = require('./admin-component.jsx');


require('./style.css');
var UserProfile = require('./user_profile.jsx');

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
            adminMessages: [],
            widget: 'widget'
        };

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
        this.menuClick = this.menuClick.bind(this);
        /*this.adminContact = this.adminContact.bind(this);
        this.adminBan = this.adminBan.bind(this);
        this.adminHistory = this.adminHistory.bind(this);
        this.deleteMsg = this.deleteMsg.bind(this);*/
        this.callback1 = this.callback1.bind(this);
        this.callback2 = this.callback2.bind(this);
    }

    callback1(){

        return this.setState({widget: 'off'});

    }

    callback2() {

        return this.setState({widget: 'widget'});
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

    menuClick() {

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
                        <h3 id="login-text">Log in</h3>
                        <input placeholder="User name" value={this.state.userInput} onChange={function(event){
                            this.setState({userInput: event.target.value});
                        }.bind(this)}></input><br/>

                      <input type="password" placeholder="Password" value={this.state.passwordInput} onChange={function(event){
                            this.setState({passwordInput: event.target.value});
                          }.bind(this)} onKeyPress={function(e) {
                                  if(e.key === 'Enter'){
                                    this.signIn();
                                  }}.bind(this)}></input><br/>
                                <button onClick={this.signIn}>Log in</button><br/>
                                {this.state.pwError}

                        <p>Not a member? No problem! Easily register in a few clicks!</p>

                        <button onClick={function(){
                            this.setState({register: 'on', signBody: 'off'});
                        }.bind(this)}>Sign up now</button>
                    </div>
    {//register
    }
                    <div class={this.state.register}>
                        <div class="register">
                          <img src="logo.svg"></img>
                            <h3>Thank you for choosing ChatApp!</h3>
                            <p>Just fill out the form and you are good to go!</p>
                            <input placeholder="username" value={this.state.newUserInput} onChange={function(event){
                                this.setState({newUserInput: event.target.value});
                            }.bind(this)}></input><br/>

                            <input type="password" placeholder="password" value={this.state.newPasswordInput} onChange={function(event){
                                this.setState({newPasswordInput: event.target.value});
                            }.bind(this)}></input><br/>

                            <input type="password" placeholder="confirm password" value={this.state.confirmNewPasswordInput} onChange={function(event){
                                this.setState({confirmNewPasswordInput: event.target.value});
                            }.bind(this)} onKeyPress={function(e) {
                              if(e.key === 'Enter'){
                                this.register();
                              }}.bind(this)}></input><br/>

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
        <div class="header-logo"><img src="logo-white.svg"></img></div>
        <div class="search-friends"><p class="instruct">send friend request</p>
        <div class="search-div"><input class="search-bar" placeholder="search users" value={this.state.query} onChange={this.searchFriends}/>
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
    </div>
      <div class="login-and-menu"><p>logged in as: <b>{this.state.user}</b></p>
       <i id="sign-off" class="fas fa-sign-out-alt"></i>
    </div>
    </div>

{//side menu
}
            <div>
              <UserProfile func1={this.callback1} func2={this.callback2} widget={this.state.widget}/>
            </div>

            <div class={this.state.widget}>
              <p>Friend requests: <b>{this.state.reqCount}</b></p>
            <ul>{this.state.req && this.state.req.map(function(req){
                return <li class="requests" onClick={this.confirmFriend.bind(this, req)}>{req[0][1]}</li>;
            }.bind(this))}</ul>

          <p class='missed'>What you've missed: <b>{ this.state.missedMsgCount}</b></p>

            <ul>{this.state.missedMsg && this.state.missedMsg.map(function(missed){
                  return <li onClick={function(){
                      this.setState({rec: missed.from});
                    }.bind(this)}>{missed.from} said: <i>{missed.string}</i></li>;
              }.bind(this))}</ul>

              <div id="friends-list">

                <p onClick={function(){
                    this.setState({rec: 'public'});
                  }.bind(this)}>Private Chat</p>

                {this.state.friends.length > 0 ? <p>Your friends: </p> : <p> No friends yet</p>}

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

              <p>Admin messages</p>
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
                }.bind(this)}>Contact admin</p>

            </div>
{//main body of page
}
            <div class="main">

              {this.state.rec === 'contactAdmin' && <div class="field">
                <h1>Contact admin</h1>
                <input placeholder="Subject" width="45"></input><br/>
                <input placeholder="Report user" width="45"></input><br/>
                <textarea placeholder="Message" width="45"></textarea><br/>
                <button type="button">Submit</button>

              </div>}

            {this.state.rec === 'admin' && <div class="field">
              <h1>{this.state.notification.subject}</h1>
              <p>{this.state.notification.message}</p>
            </div>}

            {this.state.user === undefined || this.state.rec === undefined ? <div class="field"><h1>Welcome to ChatApp!</h1></div> : <div><div class='field'>
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
                    }.bind(this)}>Emojis</div>
                    <div id={this.state.toggleEmo}>
                        {this.state.emojis.map(function(emoji){
                            return <span onClick={function(){
                                this.setState({string: (this.state.string) + emoji });
                            }.bind(this)}>{emoji}</span>;
                        }.bind(this))}
                    </div>
                </div>
                <textarea value={this.state.string} onChange={function(event){
                    this.setState({string: event.target.value});
                }.bind(this)} onKeyPress={function(e){
                    if(e.key === 'Enter'){
                        this.sendString();
                    }}.bind(this)}></textarea>

                <button onClick={this.sendString}

                >send</button>
                </div>
                }


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
