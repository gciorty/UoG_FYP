import React, { Component } from "react";
import VotingStationNotAuth from "./VotingStationNotAuth";
import { Container, Segment, Grid, Button, Message } from "semantic-ui-react";
import VoteCard from "./VoteCard";
import TransactionCard from "./TransactionCard";

export default class VoteConfirmation extends Component {
  render() {
    if (this.context.vote === false) {
      return <VotingStationNotAuth />;
    }
    const {
      voteTransaction,
      selectedVoteOption,
      selectedElection,
    } = this.props;
    return (
      <Container>
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="top"
        >
          <Grid.Column>
            <Segment stacked>
              <Message
                success
                icon="checkmark"
                header="Vote submitted succesfully!"
                content="Please print your vote unique identifier, which will enable you to check that the vote has not been tampered with, and the ballot card to put in the box."
              />
              <TransactionCard
                selectedElection={selectedElection}
                voteTransaction={voteTransaction}
              />
              <br />
              <VoteCard
                selectedElection={selectedElection}
                selectedVoteOption={selectedVoteOption}
              />
              <br />

              <Button
                fluid
                secondary
                content="Print"
                onClick={() => window.print()}
              />
              <br />

              <Button
                fluid
                primary
                content="Finish"
                onClick={() => this.props.handler()}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
