import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import axios from "axios";
import Election from "../../ethereum/election";

class VotingStationRow extends Component {
  state = {
    loading: false,
  };

  async removeVotingStationHandler(
    address,
    electionID,
    refresh,
    electionAddress
  ) {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const election = Election(electionAddress);
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await election.methods
        .removeVotingStation(address)
        .send({ from: accounts[0] });

      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const resRemove = await axios.post(
        "http://localhost:3000/db/removeVotingStation",
        {
          publicAddress: address,
          electionID: electionID,
        },
        config
      );
      refresh();
    } catch (err) {
      alert(err);
    }
    this.setState({ loading: false });
  }

  render() {
    const { Row, Cell } = Table;
    const { address, electionID, refresh, electionAddress } = this.props;
    return (
      <Row>
        <Cell>{this.props.address}</Cell>
        <Cell>
          <Button
            color="red"
            size="tiny"
            content="Remove"
            loading={this.state.loading}
            onClick={() =>
              this.removeVotingStationHandler(
                address,
                electionID,
                refresh,
                electionAddress
              )
            }
          />
        </Cell>
      </Row>
    );
  }
}

export default VotingStationRow;
