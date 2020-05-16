import React, { Component } from "react";
import { Chart } from "react-google-charts";
import { Grid } from "semantic-ui-react";

export default class ElectionResults extends Component {
  render() {
    const { votes } = this.props;

    // create set of single occurances
    const options = new Set(votes);

    // create an array of object format {option:name, votes:count} and store it to the array results for the chart
    let results = [];
    results.push(["Option", "Count"]);
    options.forEach((opt) => {
      let occurances = 0;
      for (let i = 0; i < votes.length; i++) {
        if (opt === votes[i]) occurances++;
      }
      const result = [opt, occurances];
      results.push(result);
    });

    return (
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Chart
            width={"40rem"}
            height={"40rem"}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={results}
            options={{
              title: "Results",
            }}
            rootProps={{ "data-id": "1" }}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
