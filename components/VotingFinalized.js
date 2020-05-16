import React, { Component } from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

export default class VotingOngoing extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="stop" />
          The election is finalized. see results
        </Header>
        <Button primary>Go Back</Button>
      </Segment>
    );
  }
}
