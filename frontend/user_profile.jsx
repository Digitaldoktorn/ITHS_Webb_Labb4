var React = require('react');

require('./style.css');

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {

      editProfile: 'editProfile',
      editfield: 'off'
    };
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleClick() {

  }

  toggle() {
    this.setState({editfield: 'on'});
  }

    render() {
      console.log('test', this.state.editfield);
        return <div class={this.state.editProfile}>
                  <input type="checkbox" onClick={this.handleClick} id="menu-toggle" />
                  <label for="menu-toggle" class="menu-icon"><i class="fa fa-bars"></i></label>

                  <div class="slideout-sidebar">
                  <ul>
                  <li onClick={this.toggle}>Name</li>

                  {this.state.editfield !== 'off' ?  <li>
                        <input placeholder="New Name" value={this.state._id} onChange={function(event){
                            this.setState({newName: event.target.value});
                        }.bind(this)}></input><br/>
                      <button onClick={function(){
                          console.log('success!');
                        }}
                        >Submit</button> </li> : <li></li>
                  }

                  <li>Surname</li>
                  <li>Email</li>
                  <li>Age</li>
                  <li>Change password</li>
                  </ul>
                  </div>
        </div>;
    }
}
module.exports = UserProfile;
