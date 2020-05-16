import React, { Component } from "react";
import Election from "../../ethereum/election";
import {
  Card,
  Loader,
  Segment,
  Header,
  Icon,
  Message,
} from "semantic-ui-react";

export default class VotingOptions extends Component {
  state = {
    voteOptions: null,
  };

  async componentDidMount() {
    const { electionAddress } = this.props;
    try {
      const election = Election(electionAddress);
      const voteOptionsLength = await election.methods
        .getVoteOptionsLength()
        .call();
      const voteOptions = await Promise.all(
        Array(parseInt(voteOptionsLength))
          .fill()
          .map((element, index) => {
            return election.methods.VoteOptions(index).call();
          })
      );
      this.setState({ voteOptions });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { voteOptions } = this.state;
    if (voteOptions === null) {
      return <Loader inverted>Loading</Loader>;
    }
    return (
      <Segment placeholder>
        <Header as="h2">
          <Icon name="list" />
          <Header.Content>Voting Options/Candiates</Header.Content>
        </Header>
        {voteOptions ? (
          voteOptions.length > 0 ? (
            voteOptions.map((opt) => (
              <Card key={opt.ID} fluid color="grey" header={opt.option} />
            ))
          ) : (
            <Message compact warning>
              There are no voting options available at the moment. The
              organisers will add them before the election start.
            </Message>
          )
        ) : null}
      </Segment>
    );
  }
}
