var React = require('react');
require('./style.css');

class ChatAppComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            user: undefined,
            rec: undefined,
            string: '',
            messages: [],
            allUsers: []
        };
        this.sendString = this.sendString.bind(this);
        this.testCall = this.testCall.bind(this);
        this.register = this.register.bind(this);
        this.signIn = this.signIn.bind(this);
    }
    register(){
        this.setState({user: this.state.userInput});
        fetch('/user', {
            body: '{"name": "' + this.state.user + '"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }
    signIn(){
        this.setState({user: this.state.userInput});
    }

    sendString() {
        fetch('/string', {
            body: '{"from": "' + this.state.user + '", "to": "' + this.state.rec + '", "string": "' + this.state.string + '"}',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(this.testCall.bind(this));
    }
    testCall() {
        this.setState({string: ''});
        document.getElementsByClassName('field')[0].scrollTop = document.getElementsByClassName('field')[0].scrollHeight;

    }

    componentDidMount(){

        fetch('/user').then(function (response) {
            return response.json();
        }).then(function (result) {
            this.setState({allUsers: result});
        }.bind(this));

        setInterval(function(){
            if(this.state.user != undefined && this.state.rec != undefined){
                fetch('/string?from=' + this.state.user + '&to=' + this.state.rec ).then(function (response) {
                    return response.json();
                }).then(function (result) {
                    this.setState({messages: result});
                }.bind(this));


            }
        }.bind(this), 500);
    }

    render() {
        console.log('git update');
        return <div>
            <div id="header"><img src="logo.png"></img>
                <div id="login">
                    <input placeholder="sign in" value={this.state.userInput} onChange={function(event){
                        this.setState({userInput: event.target.value});
                    }.bind(this)}></input><br/>
                    <button onClick={this.signIn}>log in</button>
                    <button onClick={this.register}>register</button>
                </div>
            </div>
            <select onChange={function(event) {
                this.setState({rec: event.target.value});
            }.bind(this)}>
                <option value="all">select user</option>
                {this.state.allUsers.map(function(user) {
                    return <option key={user._id} value={user.name}>{user.name}</option>;
                })}
            </select>


            {this.state.user == undefined || this.state.rec == undefined ? <div class="field"><h1>welcome to ChatApp!</h1><p>To  get started, sign in or register a new user. Then, take your pick from our user and chat away! </p></div> : <div><div class='field'>
                {this.state.messages.map(function(msg) {
                    var marker = msg.from === this.state.user ? 'send': 'rec';
                    var sender = msg.from === this.state.user ? 'you': msg.from;
                    return <p class={marker}><span>{sender}: </span>{msg.string}</p>;
                }.bind(this))}
            </div>
            <div id="post">
                <input value={this.state.string} onChange={function(event){
                    this.setState({string: event.target.value});
                }.bind(this)}></input>
                <button onClick={this.sendString}>send</button>
            </div>
            </div>
            }

        </div>;
    }
}
module.exports = ChatAppComponent;
