import React, { Component } from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

export default class VotingOngoing extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="dont" />
          The election is not enabled at the moment. Verify with your
          organisation/public entity when it is activated.
        </Header>
        <Button primary fluid onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Segment>
    );
  }
}
