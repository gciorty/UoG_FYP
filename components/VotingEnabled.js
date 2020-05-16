import React, { Component } from "react";
import { Message, Button, Segment, Loader } from "semantic-ui-react";
import Election from "../ethereum/election";

export default class VotingEnabled extends Component {
  state = {
    loading: false,
    errorMsg: "",
  };

  async openElectionHandler(publicAddress, refresh) {
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(publicAddress);

      const getVoteOptionsLength = await election.methods
        .getVoteOptionsLength()
        .call();

      if (parseInt(getVoteOptionsLength) === 0) {
        throw new Error(
          "You must select at least 2 voting options to open the election!"
        );
      }

      await election.methods.enableElection().send({ from: accounts[0] });
      refresh();
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  }

  async finalizeElectionHandler(publicAddress, refresh) {
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(publicAddress);
      await election.methods.finalizeElection().send({ from: accounts[0] });
      refresh();
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  }

  render() {
    const { enabled, finalized } = this.props;
    const { errorMsg } = this.state;
    if (!finalized && !enabled) {
      <Loader inverted>Loading</Loader>;
    }
    if (finalized) {
      return (
        <Segment stacked>
          <Message
            icon="checkmark"
            header="The election is completed"
            content="Result are available"
          />
        </Segment>
      );
    }
    if (enabled) {
      return (
        <Segment stacked>
          <Message
            icon="x"
            negative
            header="Want to conclude the election?"
            content="Click the button below to finalize the polling stations and stop the election. Once closed, the election cannot be re-opened and only tallying will be possible."
          />
          <Button
            content="Close Election"
            color="red"
            fluid
            loading={this.state.loading}
            onClick={() =>
              this.finalizeElectionHandler(this.props.ID, this.props.refresh)
            }
          />
        </Segment>
      );
    }
    return (
      <div>
        <Segment stacked>
          <Message
            icon="folder open"
            success
            header="Want to open the election?"
            content="Click the button below to open the polling stations and start the election. No changes will be allowed once the election is open. Ensure to have at least two voting options and one voting station."
          />
          <Button
            content="Open Election"
            color="green"
            fluid
            loading={this.state.loading}
            onClick={() =>
              this.openElectionHandler(this.props.ID, this.props.refresh)
            }
          />
          {errorMsg !== "" ? (
            <Message error header="Error!" content={errorMsg} />
          ) : null}
        </Segment>
      </div>
    );
  }
}
