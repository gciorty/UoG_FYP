import React, { Component } from "react";
import {
  Message,
  Form,
  Grid,
  Loader,
  Button,
  Segment,
  Radio,
} from "semantic-ui-react";
import VotingStationNotAuth from "./VotingStationNotAuth";
import Election from "../../ethereum/election";
import axios from "axios";

export default class SelectVotingOption extends Component {
  state = {
    valid: null,
    loading: false,
    value: "",
    errorMsg: "",
  };

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(this.props.selectedElection);
      const valid = await election.methods.votingStations(accounts[0]).call();
      this.setState({ valid });
    } catch (err) {
      console.log(err);
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ value });
  };

  renderVoteRadio() {
    return this.props.voteOptions.map((voteOption) => {
      if (voteOption.enabled) {
        return (
          <Form.Field
            key={voteOption.ID}
            style={{
              margin: "2rem auto",
            }}
          >
            <Radio
              style={{ fontSize: "20px" }}
              key={voteOption.ID}
              control={Radio}
              value={voteOption.option}
              label={voteOption.option}
              checked={this.state.value === voteOption.option}
              onChange={this.handleChange}
              required
            />
          </Form.Field>
        );
      }
    });
  }

  async castVote() {
    const { value } = this.state;
    const election = Election(this.props.selectedElection);

    event.preventDefault();

    // Check if the voting station JWT is still valid and can obtain the 'secret' to hash the vote
    if (!value) {
      return alert("Please select a voting option!");
    }
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const vote = JSON.parse(localStorage.getItem("vote"));

      const config = {
        headers: {
          "x-auth-token": vote.token,
        },
      };

      const res = await axios.post(
        "http://localhost:3000/vote/encodeVote",
        {
          electionAddress: this.props.selectedElection,
          stationAddress: accounts[0],
          votingOption: value,
        },
        config
      );

      const { encryptedVote } = res.data;
      // store vote vote to the blockchain
      const voteTransaction = await election.methods
        .castVote(encryptedVote)
        .send({
          from: accounts[0],
        });
      this.setState({ loading: false });
      this.props.handler(this.state.value, voteTransaction.transactionHash);
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err.message });
    }
  }

  render() {
    if (this.context.vote === false) {
      return <VotingStationNotAuth />;
    }
    const { valid, loading, value, errorMsg } = this.state;
    const { selectedElection, handler } = this.props;
    return (
      <div>
        <h3>
          Select your voting option for the election:
          {selectedElection}
        </h3>
        <Message
          icon="info"
          header="Select one of the options below to vote"
          content="Please from the available voting options, becareful as votes cannot be changed."
        />
        <Grid textAlign="center" style={{ height: "30vh" }} verticalAlign="top">
          <Grid.Column>
            <Segment stacked>
              <h4>Select Vote Option</h4>
              <Form onSubmit={() => this.castVote()}>
                {this.renderVoteRadio()}
                <Button
                  loading={loading}
                  primary
                  content="Vote"
                  fluid
                  disabled={!valid}
                />
                <Message error header="Error!" content={errorMsg} />
              </Form>

              {valid === null ? (
                <Loader active inline="centered" />
              ) : valid === true ? (
                <Message compact positive>
                  Success! Valid voting station account admin found on metaMask,
                  please vote.
                </Message>
              ) : (
                <Message compact negative>
                  Error! No Valid voting station admin account found on
                  metaMask, ensure to select a valid account on metaMask before
                  voting.
                </Message>
              )}
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
