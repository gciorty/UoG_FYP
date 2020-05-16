import React, { Component } from "react";
import { Header, Icon } from "semantic-ui-react";
import Election from "../../ethereum/election";

export default class ElectionHeader extends Component {
  state = {
    title: "",
  };

  async componentDidMount() {
    const { electionAddress } = this.props;
    try {
      const election = Election(electionAddress);
      const title = await election.methods.title().call();
      this.setState({ title });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { electionAddress } = this.props;
    const { title } = this.state;
    return (
      <div>
        <Header as="h2" icon>
          <Icon name="boxes" />
          {title}
          <Header.Subheader>
            Election Unique Address: {electionAddress}
          </Header.Subheader>
        </Header>
      </div>
    );
  }
}
