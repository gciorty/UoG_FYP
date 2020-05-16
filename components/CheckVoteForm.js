import React, { Component } from "react";
import { Form, Header, Icon, Button, Message } from "semantic-ui-react";
import Election from "../ethereum/election";
import axios from "axios";

export default class CheckVoteForm extends Component {
  state = {
    errorMsg: "",
    voteCode: "",
    decryptedVote: null,
    title: "",
    electionAddress: "",
  };

  checkVoteHandler = async () => {
    this.setState({
      decryptedVote: null,
      title: "",
      electionAddress: "",
      errorMsg: "",
    });
    this.setState({ loading: true });
    try {
      const resTx = await axios.post(
        "http://localhost:3000/vote/decodeTransaction",
        {
          txHash: this.state.voteCode,
        }
      );
      const { electionAddress, encodedVote } = resTx.data;
      this.setState({ electionAddress });

      const resVote = await axios.post(
        "http://localhost:3000/vote/decodeVote",
        {
          electionAddress,
          encodedVote,
        }
      );
      const { decryptedVote } = resVote.data;
      this.setState({ decryptedVote });

      const election = Election(electionAddress);
      const title = await election.methods.title().call();
      this.setState({ title });
    } catch (err) {
      if (err.response.data.error) {
        this.setState({ errorMsg: err.response.data.error });
      } else {
        this.setState({
          errorMsg: "The unique code type is not valid, please try again!",
        });
      }
    }
    this.setState({ voteCode: "", loading: false });
  };

  render() {
    const { decryptedVote, electionAddress, title } = this.state;
    return (
      <div>
        <Form
          name="checkVote"
          style={{
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
          onSubmit={this.checkVoteHandler}
          error={!!this.state.errorMsg}
        >
          <Header textAlign="center" as="h2">
            <Icon name="checkmark" />
            Check your vote
          </Header>
          <Form.Input
            value={this.state.voteCode}
            onChange={(event) =>
              this.setState({ voteCode: event.target.value })
            }
            placeholder="Type vote unique code"
            required
          />
          <Button primary size="large" loading={this.state.loading} fluid>
            Submit
          </Button>
          <Message error header="Error!" content={this.state.errorMsg} />
        </Form>
        {decryptedVote !== null && title !== null ? (
          <Message info>
            <Message.Header>
              Vote Option Selected: {decryptedVote}
            </Message.Header>
            <Message.Content>
              For the election: <strong>{title}</strong> with address:{" "}
              <strong>{electionAddress}</strong>
            </Message.Content>
          </Message>
        ) : null}
      </div>
    );
  }
}
