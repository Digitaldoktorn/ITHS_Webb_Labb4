var React = require('react');
var uuidv4 = require('uuid/v4');

class AdminComponent extends React.Component {

  constructor() {
      super();
      this.state = {
        online: [],
        tfmsg: [],
        adminMessages: [],
        adminMail: '',
        adminSubject: ''

      };

      this.adminContact = this.adminContact.bind(this);
      this.adminBan = this.adminBan.bind(this);
      this.adminHistory = this.adminHistory.bind(this);
      this.deleteMsg = this.deleteMsg.bind(this);
      this.adminMail = this.adminMail.bind(this);

  }

  deleteMsg(msg){
    fetch('/deletemessage' + msg._id, {
      method: 'DELETE'
    }).then(this.adminHistory.bind(this, msg.from));
  }

  adminHistory(user){
    fetch('/adminstring?from=' + user).then(function (response) {
        return response.json();
    }).then(function (result) {
        this.setState({adminMessages: result,
        adminAction: 'history',
        adminUser: user });
    }.bind(this));
}

  adminContact(user){
      this.setState({adminAction: 'message',
          adminUser: user});
    }

    adminBan(user){
      fetch('/deleteuser' + user._id, {
        method: 'DELETE'
      });

      this.setState({adminAction: 'delete',
        adminUser: user.name});
      }

      adminMail(){
        console.log(this.state.adminUser._id, this.state.adminSubject, this.state.adminMail);
        if (this.state.adminMail !== '') {

          fetch('/adminmail' + this.state.adminUser._id, {
              body: '{"id": "' + uuidv4() + '", "subject": "' + this.state.adminSubject + '", "message": "' + this.state.adminMail + '", "status": "unread"}',
              headers: {
                  'Content-Type': 'application/json'
              },
              method: 'PUT'
          });

          this.setState({adminMail: 'MESSAGE SENT',
              adminSubject: ''});

          setTimeout(function(){
            this.setState({adminMail: ''});
          }.bind(this), 1000);

        }else{

          this.setState({adminMail: 'PLEASE ENTER A MESSAGE'});

          setTimeout(function(){
            this.setState({adminMail: ''});
          }.bind(this), 1000);

      }
    }


      componentDidMount(){

        setInterval(function(){

            var online = this.props.users.filter(function(ol){
              return ol.status === 'online';
            });
            this.setState({online: online});

          fetch('/tfmsg?time=' + Number(Date.now() - 86400000)).then(function (response) {
            return response.json();
          }).then(function (result) {
            this.setState({tfmsg: result});
          }.bind(this));

        }.bind(this), 500);
    }

    render() {
        return  <div class="admin-page">
        <div id="admin-users">
        <h1>users</h1>
        <table class="admin-list"><tbody>
          {this.props.users.map(function(user){
            return <tr>
              <td onClick={this.adminHistory.bind(this, user.name)} key={user._id}> {user.name} </td>
              <td>
                <button onClick={this.adminContact.bind(this, user)}>contact</button>
              </td>
              <td>
                <button onClick={this.adminBan.bind(this, user)}>delete</button>
              </td>
            </tr>;
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
            <h1>contact {this.state.adminUser.name}</h1>
              <input id="admin-subject" value={this.state.adminSubject} onChange={function(e){
                  this.setState({adminSubject: e.target.value});
                }.bind(this)}>
              </input>
            <textarea value={this.state.adminMail} onChange={function(e){
                this.setState({adminMail: e.target.value});
              }.bind(this)}>
            </textarea>
            <button onClick={this.adminMail}>send</button>
          </div>}

          {this.state.adminAction === 'delete' && <div>
            <h1><b>{this.state.adminUser}</b> has been deleted</h1>
          </div>
        }

        </div>

        <div id="admin-info">

          <h1>admin info</h1>
            <h2>stats</h2>
            <p>total users: <b> {this.props.users.length}</b></p>
            <p>users online: <b>{this.state.online.length > 0 ? this.state.online.length - 1 : 0}</b></p>
            <p>messages last 24h: <b>{this.state.tfmsg.length}</b></p>
          <h2>messages</h2>

        </div>


      </div>;
    }
}

module.exports = AdminComponent;
