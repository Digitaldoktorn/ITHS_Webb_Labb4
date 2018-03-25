var React = require('react');
require('./style.css');

class ChatAppComponent extends React.Component {
//building component, setting initial state 'user', possible to bind functions from here
    constructor() {
        super();
        this.state = {
            user: ''
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
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

    usernameChangeHandler(event) {
        this.setState({ username: event.target.value });}
    usernameSubmitHandler(event) {event.preventDefault();
        this.setState({ submitted: true, username: this.state.username });}

    //Function runs when exiting component, we can use this to toggle user as offline or see last time user signed in
    componentWillUnmount() {
        console.log('shutting down');
    }

	//What will show up in the browser
	render() {
		return <div>
			<h1>ChatApp!</h1>
			<form onSubmit={this.usernameSubmitHandler} className="username-container">
                <h1>React Instant Chat</h1>
                <div>
                    <input type="text" onChange={this.usernameChangeHandler} placeholder="Enter a username..." required />
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    }
}

//make component available for import
module.exports = ChatAppComponent;
