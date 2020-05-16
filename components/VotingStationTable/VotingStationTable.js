import React, { Component } from "react";
import { Table, Icon, Button } from "semantic-ui-react";
import VotingStationTableRows from "./VotingStationTableRows";

export default class VotingStationTable extends Component {
  render() {
    const { Row, Header, HeaderCell, Body } = Table;
    const { votingStations, refresh } = this.props;
    let votingStationsRow;

    if (votingStations !== null) {
      votingStationsRow = votingStations.map((station, index) => {
        return (
          <VotingStationTableRows
            key={index}
            address={station.publicAddress}
            electionID={this.props.electionID}
            refresh={refresh}
            electionAddress={this.props.electionAddress}
          />
        );
      });
    }

    if (
      this.props.votingStations === null ||
      this.props.votingStations.length == 0
    ) {
      return (
        <div style={{ textAlign: "center" }}>
          <Icon name="x" size="huge" />
          <p>No voting stations added to the election</p>
        </div>
      );
    }

    return (
      <Table>
        <Header>
          <Row>
            <HeaderCell>Voting Station Address</HeaderCell>
            <HeaderCell>Remove</HeaderCell>
          </Row>
        </Header>
        <Body>{votingStationsRow}</Body>
      </Table>
    );
  }
}
