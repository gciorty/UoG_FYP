import React, { Component } from "react";
import { Statistic, Icon, Loader } from "semantic-ui-react";

export default class ElectionElegibleCitizens extends Component {
  render() {
    const { elegibleCitizens } = this.props;
    if (elegibleCitizens) {
      return (
        <Statistic>
          <Statistic.Value>
            <Icon name="user" />
            {elegibleCitizens.count}
          </Statistic.Value>
          <Statistic.Label>CITIZENS ELEGIBLE</Statistic.Label>
        </Statistic>
      );
    }
    return <Loader>Loading</Loader>;
  }
}
