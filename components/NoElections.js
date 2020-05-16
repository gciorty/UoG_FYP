import React, { Component } from "react";
import { Segment, Icon, Header } from "semantic-ui-react";

export default class NoElections extends Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="x" />
          There are not elections in this voting platform.
        </Header>
      </Segment>
    );
  }
}
