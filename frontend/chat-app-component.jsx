var React = require('react');
require('./style.css');

class ChatAppComponent extends React.Component {
//building component, setting initial state 'user', possible to bind functions from here
    constructor() {
        super();
        this.state = {
            user: ''
        };

    }

    //here we can add all our other functions

    //Good place to load data from database that will be avaliable when component has loaded. Note! render will run once before this function, so you might need to either set initial state or make the render conditional!
    componentDidMount(){

        fetch('/message').then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
        });
    }
    // Anders kod-kollas
    componentDidMount2(){

        fetch('/user').then(function (response) {
            return response.json();
        }).then(function (result) {
          this.setState({users: result});
        }.bind(this));
        }

    // Anders kod - kollas
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


    //Function runs when exiting component, we can use this to toggle user as offline or see last time user signed in
    componentWillUnmount() {
        console.log('shutting down');
    }

    //What will show up in the browser
    render() {
        return <div>
            <div class='display-window'></div>
            <input></input><button>skicka</button>
        </div>;
    }

    // Anders kod - kollas
    <div class='users'>
      <ul>
        {this.state.users !== undefined &&
          this.state.users.map(function(users){
            return <li key={user._id} onClick={this.friendRequest.bind(this, user)}>{user.name}</li>;
          }.bind(this))
        }
      </ul>
    </div>
}

//make component available for import
module.exports = ChatAppComponent;
