import React, { Component } from "react";
import { Segment, Icon, Header } from "semantic-ui-react";

export default class VotingStationNotAuth extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="x" />
          Area not Authorized
        </Header>
      </Segment>
    );
  }
}
