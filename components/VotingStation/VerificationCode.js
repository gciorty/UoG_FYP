import React, { Component } from "react";
import {
  Button,
  Segment,
  Message,
  Grid,
  Form,
  Loader,
} from "semantic-ui-react";
import VotingStationNotAuth from "./VotingStationNotAuth";
import web3 from "../../ethereum/web3";
import Election from "../../ethereum/election";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

export default class VerificationCode extends Component {
  state = {
    code: "",
    cardID: "",
    valid: null,
    errorMsg: "",
  };

  static contextType = AuthContext;

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      const election = Election(this.props.selectedElection);
      const valid = await election.methods.votingStations(accounts[0]).call();

      this.setState({ valid });
    }
  }

  checkIfValidCode = async (event) => {
    event.preventDefault();
    const { handler, selectedElection } = this.props;
    const { code, cardID } = this.state;

    try {
      const vote = JSON.parse(localStorage.getItem("vote"));
      const config = {
        headers: {
          "x-auth-token": vote.token,
        },
      };
      const res = await axios.post(
        "http://localhost:3000/db/checkCode",
        {
          code: code,
          cardID: cardID,
          electionAddress: selectedElection,
        },
        config
      );
      //console.log(code, cardID, selectedElection, vote.token);
      const { valid } = res.data;
      if (!valid) {
        throw new Error("Code not valid or already used");
      }
      handler();
    } catch (err) {
      console.log(err.response);
      if (err.response.data.error) {
        return this.setState({ errorMsg: err.response.data.error });
      }
      this.setState({ errorMsg: "You have type an invalid code or cardID!" });
    }
  };

  render() {
    if (this.context.vote === false) {
      return <VotingStationNotAuth />;
    }
    const { code, valid, errorMsg, cardID } = this.state;
    return (
      <Segment stacked style={{ height: "70vh" }}>
        <h3>
          Insert Verification code for the election ID:
          {this.props.selectedElection}
        </h3>
        <Message
          icon="info"
          header="Enter your verification code for the election"
          content="The code will unlock the voting stationa and will enable the selection of a voting option"
        />
        <Grid textAlign="center" style={{ height: "30vh" }} verticalAlign="top">
          <Grid.Column>
            <Segment stacked>
              <h4>Enter your Card ID and Authorization Code</h4>
              <Form onSubmit={this.checkIfValidCode} error={!!errorMsg}>
                <Form.Input
                  value={cardID}
                  onChange={(event) =>
                    this.setState({ cardID: event.target.value })
                  }
                  placeholder="Type your card ID here"
                  required
                />
                <Form.Input
                  value={code}
                  onChange={(event) =>
                    this.setState({ code: event.target.value })
                  }
                  placeholder="Type your authorization code here"
                  required
                />
                <Button primary content="Submit" fluid disabled={!valid} />
                <Message error header="Error!" content={errorMsg} />
              </Form>

              {this.state.valid === null ? (
                <Loader active inline="centered" />
              ) : this.state.valid === true ? (
                <Message compact positive>
                  Success! Valid voting station account admin found on metaMask,
                  please login.
                </Message>
              ) : (
                <Message compact negative>
                  Error! No Valid voting station admin account found on
                  metaMask, ensure to select a valid account on metaMask.
                </Message>
              )}
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
