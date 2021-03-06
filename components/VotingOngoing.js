import React, { Component } from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

export default class VotingOngoing extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="circle notched" loading />
          The election is on-going. No changes are allowe
        </Header>
        <Button primary>Go Back</Button>
      </Segment>
    );
  }
}
