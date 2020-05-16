import React, { Component } from "react";
import { Card, Header, Button } from "semantic-ui-react";

export default class VoteCard extends Component {
  render() {
    const { selectedVoteOption, selectedElection } = this.props;
    if (selectedVoteOption) {
      return (
        <Card fluid>
          <Card.Content>
            <Header as="h3">{selectedVoteOption}</Header>
            <Card.Meta>Vote valid for election: {selectedElection}</Card.Meta>
          </Card.Content>
        </Card>
      );
    }
    return (
      <div>
        <p></p>
      </div>
    );
  }
}
