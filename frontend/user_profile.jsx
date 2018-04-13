var React = require('react');

require('./style.css');

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      showProfile: 'showProfile',
      editfield: 'off',
      closeButton : 'closeButton',


    };
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
    this.closeButton = this.closeButton.bind(this);
  }

  handleClick() {
  }


  submitProfile(){
    console.log(this.state.newName, this.state.newPassword, this.state.newEmail, this.state.newSurname);

      fetch('/updateuser/?updatename=' + this.state.newName + '&updatepassword=' + this.state.newPassword + '&updateemail=' + this.state.newEmail + '&updatesurname=' + this.state.newSurname + '&user=' + this.state.user, {
          body: '{}',
          headers: {
              'Content-Type': 'application/json'
          },
          method: 'PUT'
      }).then(function (response) {
          return response.json();
      }).then(function (result) {
          console.log(result);
      }.bind(this));
    }

  toggle() {
    this.setState({editfield: 'on'});
  }
  closeButton() {
    this.setState({toggleButton: 'on'});
  }

    render() {
        return <div class={this.state.showProfile}>
                  <input type="checkbox" onClick={this.handleClick} id="menu-toggle" />
                  <label for="menu-toggle" class="menu-icon"><i class="fa fa-bars"></i></label>
                  <div class="slideout-sidebar">
                    <span><img src="user.jpg" alt="users photo" id="user_foto"></img><h1 class="profile_font">My Profile</h1></span>
                  <ul>
                  <li class="profile_font">Name<li>{this.state.newName}</li></li>
                  <li class="profile_font">Surname<li>{this.state.newSurname}</li></li>
                  <li class="profile_font">Email<li>{this.state.newEmail}</li></li>
                  <li class="profile_font">Age<li>{this.state.newAge}</li></li>
                  </ul>


                  <p class="profile_font">Do you want to change your profile?<button onClick={this.toggle}>Click me</button></p>
                    <div class={this.state.editfield} id="edited_Profile">

                    {this.state.editfield !== 'off' ?  <div>
                      <span class="close" onClick={function(){
                          this.setState({editfield: 'off'}); }.bind(this)}> &times;</span>
                        <div id="input_fields">
                      <p class="editfield_font">Change your name</p>
                          <input  placeholder="New Name" value={this.state.newName} onChange={function(event){
                              this.setState({newName: event.target.value});
                          }.bind(this)}></input><br/>
                        <p class="editfield_font">Change your surname</p>
                        <input  placeholder="New Surname" value={this.state.newSurname} onChange={function(event){
                              this.setState({newSurname: event.target.value});
                          }.bind(this)}></input><br/>
                        <p class="editfield_font">Change your email</p>
                        <input placeholder="New Email" value={this.state.newEmail} onChange={function(event){
                              this.setState({newEmail: event.target.value});
                              }.bind(this)}></input><br/>
                            <p class="editfield_font">Change your age</p>
                            <input placeholder="New Age" value={this.state.newAge} onChange={function(event){
                              this.setState({newAge: event.target.value});
                              }.bind(this)}></input><br/>
                            <p class="editfield_font">Change your password</p>
                            <input  placeholder="New Password" value={this.state.newPassword} onChange={function(event){
                              this.setState({newPassword: event.target.value});
                              }.bind(this)}></input><br/>
                            <button onClick={this.submitProfile} onClick={function(){
                                this.setState({editfield: 'off'}); }.bind(this)}
                          >Submit</button> </div> </div> : <div></div>
                    }
                  </div>
                  </div>
        </div>;
    }
}
module.exports = UserProfile;
