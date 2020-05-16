import React, { Component } from "react";
import { Container, Grid, Segment, Message } from "semantic-ui-react";
import CheckVoteForm from "../components/CheckVoteForm";

export default class checkVote extends Component {
  render() {
    return (
      <Container>
        <Grid>
          <Grid.Column>
            <Segment
              stacked
              textAlign="center"
              style={{ height: "50vh" }}
              verticalAlign="top"
            >
              <Message
                icon="info"
                header="Blockchain E-Vote - Verify your vote"
                content="Type your unique vote code identifier and check your vote to ensure it has been tampered."
              />
              <CheckVoteForm />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
