import React, { Component } from "react";
import { Segment, Icon, Header, Button } from "semantic-ui-react";

export default class VoteCompleted extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="checkmark" />
          Completed
        </Header>
        <Button
          primary
          fluid
          content="Next Vote"
          onClick={() => window.location.reload()}
        />
      </Segment>
    );
  }
}
