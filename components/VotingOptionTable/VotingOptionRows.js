import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import Election from "../../ethereum/election";

class ElectionStateRow extends Component {
  state = {
    loading: false,
  };

  async enableVotingOptionhandler(refresh, electionAddress, id) {
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(electionAddress);
      await election.methods.enableVotingOption(id).send({ from: accounts[0] });
      this.setState({ loading: false });
      refresh();
    } catch (err) {
      alert(err);
    }
  }

  async disableVotingOptionhandler(refresh, electionAddress, id) {
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(electionAddress);
      await election.methods
        .disableVotingOption(id)
        .send({ from: accounts[0] });
      this.setState({ loading: false });
      refresh();
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, voteOption, enabled, refresh, electionAddress } = this.props;
    return (
      <Row>
        <Cell>{id}</Cell>
        <Cell>{voteOption}</Cell>
        <Cell>
          {enabled ? (
            <Button
              fluid
              color="red"
              size="tiny"
              content="Disable"
              loading={this.state.loading}
              onClick={() =>
                this.disableVotingOptionhandler(refresh, electionAddress, id)
              }
            />
          ) : (
            <Button
              fluid
              color="green"
              size="tiny"
              content="Enable"
              loading={this.state.loading}
              onClick={() =>
                this.enableVotingOptionhandler(refresh, electionAddress, id)
              }
            />
          )}
        </Cell>
      </Row>
    );
  }
}

export default ElectionStateRow;
