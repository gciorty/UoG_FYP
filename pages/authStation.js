import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import factory from "../ethereum/factory";
import Election from "../ethereum/election";
import AuthContext from "../context/AuthContext";
import { Message, Button, Grid, Segment, Dropdown } from "semantic-ui-react";
import axios from "axios";

class authStation extends Component {
  state = {
    accounts: null,
    ongoingElections: [],
    selectedElection: "",
    dropSelection: null,
    errorMsg: "",
  };

  static contextType = AuthContext;

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts });

    const elections = await factory.methods.getDeployedElections().call();
    const ongoingElections = [];
    elections.forEach(async (electionAddress) => {
      const election = Election(electionAddress);
      const enabled = await election.methods.enabled().call();
      const finalized = await election.methods.finalized().call();
      if (enabled && !finalized) ongoingElections.push(electionAddress);
    });
    this.setState({ ongoingElections });
  }

  async getElectionTitle(electionAddress) {
    const election = Election(electionAddress);
    const title = await election.methods.title().call();
    const electionDetails = {
      electionAddress,
      title,
    };
    return electionDetails;
  }

  async renderAsyncOngoingElections(ongoingElections) {
    const functionWithPromise = (item) => {
      //a function that returns a promise
      return Promise.resolve(item);
    };

    const anAsyncFunction = async (item) => {
      const detailedItem = this.getElectionTitle(item);
      return functionWithPromise(detailedItem);
    };

    const getData = async () => {
      return Promise.all(ongoingElections.map((item) => anAsyncFunction(item)));
    };

    getData().then((data) => {
      const items = data.map((election) => {
        return {
          key: election.electionAddress,
          text: election.title,
          description: election.electionAddress,
          value: election.electionAddress,
        };
      });
      const dropSelection = (
        <Dropdown
          placeholder="Select an election"
          fluid
          selection
          options={items}
          onChange={this.selectionDropDownHandler}
        />
      );
      this.setState({ dropSelection: dropSelection });
    });
  }

  selectionDropDownHandler = async (e, data) => {
    this.setState({ selectedElection: data.value });
  };

  oneClickLoginHandler = async (e) => {
    e.preventDefault();
    const { selectedElection, accounts } = this.state;
    this.setState({ error: "" });
    try {
      const res = await axios.get(
        `http://localhost:3000/auth/stationchallengeRequest/${accounts[0].toLowerCase()}&${selectedElection}`
      );
      this.signChallenge(res.data);
    } catch (err) {
      this.setState({
        errorMsg:
          "Select a valid ongoing election for the selected address (it is likely that the selected address is not an authorised voting station).",
      });
    }
  };

  signChallenge = async (challenge) => {
    if (challenge) {
      const { accounts } = this.state;
      web3.currentProvider.sendAsync(
        {
          method: "eth_signTypedData",
          params: [challenge, accounts[0]],
          from: accounts[0],
        },
        async (error, res) => {
          if (error) return console.error(error);
          await this.verifySignature(challenge, res.result);
        }
      );
    } else {
      this.setState({
        errorMsg:
          "Something went wrong, could not sign the challenge. Try again!",
      });
    }
  };

  verifySignature = async (challenge, signature) => {
    const { accounts } = this.state;
    const res = await axios.get(
      `http://localhost:3000/auth/challengeVerify/${challenge[1].value}/${signature}`
    );
    const resMsg = await res.data;
    console.log(res.data);
    if (res.status === 200 && resMsg.address === accounts[0].toLowerCase()) {
      this.context.stationIn(res.data);
    } else {
      alert("Signature not verified, login not allowed!");
      this.setState({
        errorMsg: "Signature not verified, login not allowed!",
      });
    }
  };

  render() {
    const { dropSelection, ongoingElections, errorMsg } = this.state;
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
                header="Blockchain E-Vote - Authorize Voting Station"
                content="Ensure you are logged in to Metamask with the address of the desired voting station, then click the display button below to show the on-going elections and finally select the election. The system will check if the station is enabled for the ongoing election and will authorize the machine."
              />
              <Button
                fluid
                primary
                content="Display on-going elections"
                onClick={() =>
                  this.renderAsyncOngoingElections(ongoingElections)
                }
              />
              <br />
              {dropSelection !== null ? (
                ongoingElections.length === 0 ? (
                  <Message
                    warning
                    icon="info"
                    header="No on-going elections"
                    content="There are no on-going elections at the moment, stations can only be activated when there are on-going elections!"
                  />
                ) : (
                  <div>
                    <h4>
                      Please select an on-going election from the dropdown menu
                    </h4>
                    {dropSelection}
                    <br />
                    <Button
                      fluid
                      content="Authorize Station"
                      primary
                      onClick={this.oneClickLoginHandler}
                    />
                  </div>
                )
              ) : null}
              {errorMsg !== "" ? (
                <Message error header="Error!" content={this.state.errorMsg} />
              ) : null}
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default authStation;
