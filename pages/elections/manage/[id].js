import React, { Component, Fragment } from "react";
import AuthContext from "../../../context/AuthContext";
import VotingOptions from "../../../components/VotingOptions";
import VotingStations from "../../../components/VotingStations";
import VotingEnabled from "../../../components/VotingEnabled";
import Election from "../../../ethereum/election";
import VotingOngoing from "../../../components/VotingOngoing";
import VotingFinalized from "../../../components/VotingFinalized";
import NotAuthArea from "../../../components/NotAuthArea";
import AddElectionManager from "../../../components/AddElectionManager";

export default class ElectionManagement extends Component {
  constructor(props) {
    super(props);
    this.refreshElectionStatus = this.refreshElectionStatus.bind(this);
  }
  state = {
    title: "",
    enabled: false,
    finalized: false,
  };

  static contextType = AuthContext;

  static async getInitialProps(props) {
    const ID = props.query.id;

    return { ID };
  }

  async componentDidMount(props) {
    try {
      const election = Election(this.props.ID);
      const title = await election.methods.title().call();
      const enabled = await election.methods.enabled().call();
      const finalized = await election.methods.finalized().call();
      this.setState({ enabled });
      this.setState({ finalized });
      this.setState({ title });
    } catch (err) {
      alert("error loading election: " + err);
    }
  }

  async refreshElectionStatus() {
    try {
      const election = Election(this.props.ID);
      const enabled = await election.methods.enabled().call();
      const finalized = await election.methods.finalized().call();
      this.setState({ enabled });
      this.setState({ finalized });
    } catch (err) {
      alert("error updating election: " + err);
    }
    console.log("refresh");
  }

  render() {
    if (this.context.auth === false) {
      return <NotAuthArea />;
    }

    const { ID } = this.props;
    const { title, enabled, finalized } = this.state;

    if (finalized) {
      return (
        <Fragment>
          <h3>Admnistration of Election: {title}</h3>
          <p>Public address: {ID}</p>
          <VotingEnabled
            enabled={enabled}
            finalized={finalized}
            ID={ID}
            refresh={this.refreshElectionStatus}
          />
          <br />
          <VotingFinalized />
        </Fragment>
      );
    }

    if (enabled) {
      return (
        <Fragment>
          <h3>Admnistration of Election: {title}</h3>
          <p>Public address: {ID}</p>
          <VotingEnabled
            enabled={enabled}
            finalized={finalized}
            ID={ID}
            refresh={this.refreshElectionStatus}
          />
          <br />
          <VotingOngoing />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <h3>Admnistration of Election: {title}</h3>
        <p>Public address: {ID}</p>
        <VotingEnabled
          enabled={enabled}
          finalized={finalized}
          ID={ID}
          refresh={this.refreshElectionStatus}
        />
        <br />
        <VotingOptions ID={ID} />
        <br />
        <VotingStations ID={ID} />
        <br />
        <AddElectionManager electionAddress={ID} />
        <br />
      </Fragment>
    );
  }
}
