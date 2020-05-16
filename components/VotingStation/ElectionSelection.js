import React, { Component } from "react";
import { Button, Dropdown, Segment, Message } from "semantic-ui-react";
import VotingStationNotAuth from "./VotingStationNotAuth";
import factory from "../../ethereum/factory";
import Election from "../../ethereum/election";
import AuthContext from "../../context/AuthContext";

export default class ElectionSelection extends Component {
  state = {
    ongoingElections: [],
    dropSelection: null,
    selectedElection: "",
  };
  static contextType = AuthContext;
  async componentDidMount() {
    try {
      const elections = await factory.methods.getDeployedElections().call();
      const ongoingElections = [];
      elections.forEach(async (electionAddress) => {
        const election = Election(electionAddress);
        const enabled = await election.methods.enabled().call();
        const finalized = await election.methods.finalized().call();
        if (enabled && !finalized) ongoingElections.push(electionAddress);
      });
      this.setState({ ongoingElections });
    } catch (err) {
      console.log(err);
    }
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

  render() {
    const { ongoingElections, dropSelection, selectedElection } = this.state;
    if (this.context.vote === false) {
      return <VotingStationNotAuth />;
    }
    return (
      <Segment stacked style={{ height: "70vh" }}>
        <Message
          icon="info"
          header="Welcome to the voting station"
          content="Before you proceed, ensure you have your voting authorization code. If you do not have one, obtain it from the election agents. If you have a code click the display button delow"
        />
        <Button
          fluid
          primary
          content="Display on-going elections"
          onClick={() => this.renderAsyncOngoingElections(ongoingElections)}
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
              <h4>Please select an election from the dropdown menu</h4>
              {dropSelection}
              <br />
              <Button
                fluid
                content="Submit"
                primary
                onClick={() => this.props.handler(selectedElection)}
              />
            </div>
          )
        ) : null}
      </Segment>
    );
  }
}
