import React, { Component } from "react";
import { Segment, Loader } from "semantic-ui-react";
import NotEnabled from "./ElectionNotEnabled";
import ElectionStats from "./ElectionStats";
import Election from "../../ethereum/election";

export default class ElectionContent extends Component {
  state = {
    enabled: null,
    finalized: null,
  };

  async componentDidMount() {
    const { electionAddress } = this.props;
    try {
      const election = Election(electionAddress);
      const enabled = await election.methods.enabled().call();
      const finalized = await election.methods.finalized().call();
      this.setState({ enabled });
      this.setState({ finalized });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { enabled, finalized } = this.state;
    if (enabled && finalized === false) {
      <Loader active inline="centered" content="Loading" />;
    }
    if (finalized === true) {
      return (
        <ElectionStats
          electionAddress={this.props.electionAddress}
          finalized={true}
        />
      );
    }
    if (enabled === true) {
      return (
        <ElectionStats
          electionAddress={this.props.electionAddress}
          finalized={false}
        />
      );
    }
    return (
      <Segment>
        <NotEnabled />
      </Segment>
    );
  }
}
