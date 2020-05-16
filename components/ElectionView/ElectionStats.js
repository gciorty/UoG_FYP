import React, { Component } from "react";
import { Segment, Header, Icon, Button, Loader } from "semantic-ui-react";
import ElectionVoters from "./ElectionVoters";
import ElectionElegibleCitizen from "./ElectionElegibleCitizens";
import ElectionVotersPieChart from "./ElectionVotersPieChart";
import ElectionResults from "./ElectionResults";
import Election from "../../ethereum/election";
import axios from "axios";

export default class ElectionStats extends Component {
  state = {
    voters: null,
    elegibleCitizens: null,
    votes: null,
  };

  async componentDidMount() {
    try {
      const election = Election(this.props.electionAddress);
      const voters = await election.methods.getVotesLength().call();
      this.setState({ voters });
      const res = await axios.get("http://localhost:3000/db/citizenCount");
      const { citizens } = res.data;
      this.setState({ elegibleCitizens: citizens });
      if (this.props.finalized) {
        const encodedVotes = await Promise.all(
          Array(parseInt(voters))
            .fill()
            .map((element, index) => {
              return election.methods.Votes(index).call();
            })
        );
        let decodedVotes = [];
        for (let i = 0; i < encodedVotes.length; i++) {
          const decodedVote = await axios.post(
            "http://localhost:3000/vote/decodeVote",
            {
              electionAddress: this.props.electionAddress,
              encodedVote: encodedVotes[i],
            }
          );
          decodedVotes.push(decodedVote.data.decryptedVote);
        }
        this.setState({ votes: decodedVotes });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { voters, elegibleCitizens, votes } = this.state;
    const { finalized } = this.props;

    if (voters !== null && elegibleCitizens !== null) {
      return (
        <Segment>
          {!finalized ? (
            <Header icon>
              <Icon name="circle notched" loading />
              The election is currently ongoing.
            </Header>
          ) : (
            <Header icon>
              <Icon name="calendar check" />
              The election is terminated!
            </Header>
          )}

          <div>
            {!finalized ? null : votes === null ? (
              <Loader
                active
                inline="centered"
                content="Loading Final Results"
              />
            ) : (
              <ElectionResults votes={votes} />
            )}
            <ElectionVoters voters={voters} />
            <ElectionElegibleCitizen elegibleCitizens={elegibleCitizens} />
          </div>
          <div style={{ margin: "auto" }}>
            <ElectionVotersPieChart
              voters={voters}
              elegibleCitizens={elegibleCitizens}
            />
          </div>

          <Button primary fluid onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Segment>
      );
    }
    return (
      <Segment>
        <p>Loading</p>
      </Segment>
    );
  }
}
