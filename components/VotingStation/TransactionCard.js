import React, { Component } from "react";
import { Card, Header, Button } from "semantic-ui-react";

export default class TransactionCard extends Component {
  render() {
    const { voteTransaction, selectedElection } = this.props;
    return (
      <Card fluid>
        <Card.Content>
          <Header as="h3">Your unique code: {voteTransaction}</Header>
          <Card.Meta>Vote valid for election: {selectedElection}</Card.Meta>
          <Card.Description>
            Keep this code if you want to check that your vote was not tampered
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
