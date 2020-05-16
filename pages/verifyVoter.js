import React, { Component } from "react";
import web3 from "../ethereum/web3";
import factory from "../ethereum/factory";
import Election from "../ethereum/election";
import AuthContext from "../context/AuthContext";
import {
  Container,
  Message,
  Button,
  Grid,
  Segment,
  Dropdown,
} from "semantic-ui-react";
import VerifyVoterForm from "../components/VerifyVoter/VerifyVoterForm";
import NotAuthArea from "../components/NotAuthArea";

class authStation extends Component {
  state = {
    accounts: null,
    ongoingElections: [],
    selectedElection: "",
    dropSelection: null,
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

  reloadPage() {
    window.location.reload();
  }

  render() {
    if (this.context.auth === false) {
      return <NotAuthArea />;
    }
    const { dropSelection, ongoingElections, selectedElection } = this.state;
    return (
      <Container>
        <Grid>
          <Grid.Column>
            <Segment stacked style={{ height: "80vh" }}>
              <Message
                warning
                icon="info"
                header="Blockchain E-Vote - Verify citizen identity and generate voting code"
                content="Ensure to verify the citizen identity and check the provided ID for authenticity. Print the one-time use only code to the voter."
              />
              <br />
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
                    <h3>
                      Please select an on-going election from the dropdown menu
                    </h3>
                    {dropSelection}
                    <br />
                  </div>
                )
              ) : null}
              {selectedElection !== "" ? (
                <VerifyVoterForm selectedElection={selectedElection} />
              ) : null}
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default authStation;
