import React, { Component } from "react";
import Election from "../ethereum/election";
import {
  Header,
  Message,
  Form,
  Button,
  Segment,
  Icon,
} from "semantic-ui-react";
import VotingOptionTable from "./VotingOptionTable/VotingOptionTable";

export default class VotingOptions extends Component {
  constructor(props) {
    super(props);
    this.refreshVotingOptions = this.refreshVotingOptions.bind(this);
  }

  state = {
    newVotingOption: "",
    errorMsg: "",
    loading: false,
    votingOptionsLength: 0,
    VoteOptions: null,
  };

  async componentDidMount() {
    const election = Election(this.props.ID);
    const votingOptionsLength = await election.methods
      .getVoteOptionsLength()
      .call();
    this.setState({ votingOptionsLength });
    const voteOptions = await Promise.all(
      Array(parseInt(votingOptionsLength))
        .fill()
        .map((element, index) => {
          return election.methods.VoteOptions(index).call();
        })
    );
    this.setState({ voteOptions });
  }

  addVotingOptionHandler = async (event) => {
    event.preventDefault();
    const election = Election(this.props.ID); //get instance of the the election
    this.setState({ errorMSg: "", loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await election.methods
        .addVotingOption(this.state.newVotingOption)
        .send({ from: accounts[0] });
      alert("New option added for the election");
      this.setState({ newVotingOption: "" });
      const votingOptionsLength = await election.methods
        .getVoteOptionsLength()
        .call();
      this.setState({ votingOptionsLength });
      const voteOptions = await Promise.all(
        Array(parseInt(votingOptionsLength))
          .fill()
          .map((element, index) => {
            return election.methods.VoteOptions(index).call();
          })
      );
      this.setState({ voteOptions });
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }

    this.setState({ loading: false });
  };

  async refreshVotingOptions() {
    console.log("refresh");
    const election = Election(this.props.ID);
    const votingOptionsLength = await election.methods
      .getVoteOptionsLength()
      .call();
    this.setState({ votingOptionsLength });
    const voteOptions = await Promise.all(
      Array(parseInt(votingOptionsLength))
        .fill()
        .map((element, index) => {
          return election.methods.VoteOptions(index).call();
        })
    );
    console.log(voteOptions);
    this.setState({ voteOptions });
  }

  render() {
    return (
      <div>
        <Segment stacked>
          <div style={{ maxWidth: "32rem", margin: "auto" }}>
            <Form
              name="addOVotingption"
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
              }}
              onSubmit={this.addVotingOptionHandler}
              error={!!this.state.errorMsg}
            >
              <Header as="h3" textAlign="center">
                <Icon name="add" />
                Add Voting Option
              </Header>

              <Form.Input
                value={this.state.newVotingOption}
                onChange={(event) =>
                  this.setState({ newVotingOption: event.target.value })
                }
                placeholder="Type voting option here"
                required
              />
              <Button primary size="large" loading={this.state.loading} fluid>
                Add Option
              </Button>
              <Message error header="Error!" content={this.state.errorMsg} />
            </Form>
          </div>
          <Segment placeholder>
            <Header as="h3" textAlign="center">
              <Icon name="angle down" />
              Available Voting Options
            </Header>
            <VotingOptionTable
              voteOptions={this.state.voteOptions}
              refresh={this.refreshVotingOptions}
              electionAddress={this.props.ID}
            />
          </Segment>
        </Segment>
      </div>
    );
  }
}
