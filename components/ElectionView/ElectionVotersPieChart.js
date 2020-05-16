import React, { Component } from "react";
import { Chart } from "react-google-charts";
import { Grid } from "semantic-ui-react";

export default class ElectionVotersPieChart extends Component {
  render() {
    const { voters, elegibleCitizens } = this.props;
    if (voters && elegibleCitizens) {
      return (
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Chart
              width={"40rem"}
              height={"35rem"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Voter", "Votes"],
                ["Voters", parseInt(voters)],
                ["Eligible", parseInt(99)],
              ]}
              options={{
                title: "Percetange of participants from population",
              }}
              rootProps={{ "data-id": "1" }}
            />
          </Grid.Column>
        </Grid>
      );
    }
    return <p>Loading</p>;
  }
}
