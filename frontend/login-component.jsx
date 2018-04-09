var React = require('react');

class LoginComponent extends React.Component {

  constructor() {
      super();
      this.state = {
          header: 'login component'
      };
      this.change = this.change.bind(this);
  }

  change(){
    this.setState({header: 'updated'});
  }

  componentDidMount(){
    console.log('mounted');

  }

    render() {
        return  <div>
        <h2 onClick={this.change}>{this.state.header}</h2>
      </div>;
    }
}

module.exports = LoginComponent;
