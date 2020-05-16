import React, { Component } from "react";
import {
  Header,
  Message,
  Form,
  Button,
  Segment,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import VotingStationsTable from "./VotingStationTable/VotingStationTable";
import Election from "../ethereum/election";

export default class VotingStations extends Component {
  constructor(props) {
    super(props);
    this.refreshVotingStations = this.refreshVotingStations.bind(this);
  }

  state = {
    errorMsg: "",
    loading: false,
    electionID: null,
    votingStations: null,
    newVotingStation: "",
  };

  async componentDidMount() {
    const { ID } = this.props;
    const auth = JSON.parse(localStorage.getItem("auth"));
    try {
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const resElectionID = await axios.post(
        "http://localhost:3000/db/getElectionID",
        { publicAddress: ID },
        config
      );
      const electionID = resElectionID.data.electionID[0].ID;
      this.setState({ electionID });
      const resVotingStations = await axios.post(
        "http://localhost:3000/db/getAllVotingStations",
        { electionID: electionID },
        config
      );
      const { votingStations } = resVotingStations.data;
      this.setState({ votingStations });
    } catch (err) {
      console.log(err);
    }
  }

  addVotingStationHandler = async (event) => {
    event.preventDefault();
    const election = Election(this.props.ID);
    const auth = JSON.parse(localStorage.getItem("auth"));
    this.setState({ errorMSg: "", loading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await election.methods
        .addVotingStation(this.state.newVotingStation)
        .send({ from: accounts[0] });

      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };

      const resAddStation = await axios.post(
        "http://localhost:3000/db/addVotingStation",
        {
          publicAddress: this.state.newVotingStation,
          electionID: this.state.electionID,
        },
        config
      );

      const resVotingStations = await axios.post(
        "http://localhost:3000/db/getAllVotingStations",
        { electionID: this.state.electionID },
        config
      );

      const { votingStations } = resVotingStations.data;
      this.setState({ votingStations });
      this.setState({ newVotingStation: "" });
      alert("New Voting Station Added");
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  };

  async refreshVotingStations() {
    const { ID } = this.props;
    const auth = JSON.parse(localStorage.getItem("auth"));
    try {
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const resElectionID = await axios.post(
        "http://localhost:3000/db/getElectionID",
        { publicAddress: ID },
        config
      );
      const electionID = resElectionID.data.electionID[0].ID;
      this.setState({ electionID });
      const resVotingStations = await axios.post(
        "http://localhost:3000/db/getAllVotingStations",
        { electionID: electionID },
        config
      );
      const { votingStations } = resVotingStations.data;
      this.setState({ votingStations });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <Segment stacked>
          <div style={{ maxWidth: "32rem", margin: "auto" }}>
            <Form
              name="addVotingStation"
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
              }}
              onSubmit={this.addVotingStationHandler}
              error={!!this.state.errorMsg}
            >
              <Header as="h3" textAlign="center">
                <Icon name="home" />
                Add Voting Station
              </Header>

              <Form.Input
                value={this.state.newVotingStation}
                onChange={(event) =>
                  this.setState({ newVotingStation: event.target.value })
                }
                placeholder="Type voting station address here"
                required
              />
              <Button primary size="large" loading={this.state.loading} fluid>
                Add Voting Station
              </Button>
              <Message error header="Error!" content={this.state.errorMsg} />
            </Form>
          </div>
          <Segment placeholder>
            <Header as="h3" textAlign="center">
              <Icon name="angle down" />
              Voting Stations Enabled
            </Header>
            <VotingStationsTable
              votingStations={this.state.votingStations}
              electionID={this.state.electionID}
              refresh={this.refreshVotingStations}
              electionAddress={this.props.ID}
            />
          </Segment>
        </Segment>
      </div>
    );
  }
}
