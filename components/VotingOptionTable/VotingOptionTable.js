import React, { Component } from "react";
import { Table, Icon } from "semantic-ui-react";
import VotingOptionRows from "./VotingOptionRows";

export default class CandidateTable extends Component {
  render() {
    let voteOptionsRows = null;
    if (this.props.voteOptions !== undefined) {
      voteOptionsRows = this.props.voteOptions.map((voteOption, index) => {
        return (
          <VotingOptionRows
            key={index}
            id={++index}
            voteOption={voteOption.option}
            enabled={voteOption.enabled}
            refresh={this.props.refresh}
            electionAddress={this.props.electionAddress}
          />
        );
      });
    }
    const { Row, Header, HeaderCell, Body } = Table;
    if (
      this.props.voteOptions === undefined ||
      this.props.voteOptions.length == 0
    ) {
      return (
        <div style={{ textAlign: "center" }}>
          <Icon name="x" size="huge" />
          <p>No voting options available</p>
        </div>
      );
    }
    return (
      <Table>
        <Header>
          <Row>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>Option</HeaderCell>
            <HeaderCell>Disable/Enable</HeaderCell>
          </Row>
        </Header>
        <Body>{voteOptionsRows}</Body>
      </Table>
    );
  }
}
