import React, { Component } from "react";
import factory from "../ethereum/factory";
import ElectionCards from "../components/ElectionCards";
import { Loader, Header, Icon } from "semantic-ui-react";
import NoElections from "../components/NoElections";

export default class index extends Component {
  static async getInitialProps(props) {
    try {
      let elections = await factory.methods.getDeployedElections().call();
      elections = elections.reverse();
      return { elections };
    } catch (err) {
      console.log(err);
    }
    return {};
  }

  render() {
    if (!this.props.elections) {
      return (
        <Loader active inline="centered">
          Loading cards (check internet connection if it takes too long)
        </Loader>
      );
    }
    return (
      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="list" circular />
          <Header.Content>List of Elections</Header.Content>
        </Header>
        {this.props.elections.length === 0 ? (
          <NoElections />
        ) : (
          <ElectionCards elections={this.props.elections} />
        )}
      </div>
    );
  }
}
