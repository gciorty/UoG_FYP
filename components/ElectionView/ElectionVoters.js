import React, { Component } from "react";
import { Statistic, Icon, Loader } from "semantic-ui-react";

export default class ElectionVoters extends Component {
  render() {
    const { voters } = this.props;
    if (voters) {
      return (
        <Statistic key="1">
          <Statistic.Value>
            <Icon name="pencil alternate" />
            {voters}
          </Statistic.Value>
          <Statistic.Label>TOTAL VOTERS</Statistic.Label>
        </Statistic>
      );
    }
    return <Loader>Loading</Loader>;
  }
}
