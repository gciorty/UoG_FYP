import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import LoginForm from "../components/LoginForm";
import web3 from "../ethereum/web3";
import factory from "../ethereum/factory";

class Login extends Component {
  state = {
    accounts: null,
    valid: null,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts });

    if (accounts.length > 0) {
      let valid = await factory.methods.admins(accounts[0]).call();
      if (!valid) {
        const superAdmin = await factory.methods.superAdmin().call();
        if (superAdmin === accounts[0]) valid = true;
      }
      this.setState({ valid });
    }
  }

  render() {
    return (
      <Container>
        <LoginForm address={this.state.accounts} valid={this.state.valid} />
      </Container>
    );
  }
}

export default Login;
