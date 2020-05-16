import React, { Component } from "react";
import { Segment, Container, Grid } from "semantic-ui-react";
import ElectionHeader from "../../components/ElectionView/ElectionHeader";
import VotingOptionsView from "../../components/ElectionView/VotingOptionsView";
import ElectionContent from "../../components/ElectionView/ElectionContent";

export default class displayIdea extends Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(props) {
    const electionAddress = props.query.id;
    return { electionAddress };
  }

  render() {
    const { electionAddress } = this.props;
    return (
      <Container>
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="top"
        >
          <Grid.Column>
            <Segment stacked>
              <ElectionHeader electionAddress={electionAddress} />
              <VotingOptionsView electionAddress={electionAddress} />
              <ElectionContent electionAddress={electionAddress} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
