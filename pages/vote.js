import React, { Component } from "react";
import VotingSteps from "../components/VotingStation/VotingSteps";
import ElectionSelection from "../components/VotingStation/ElectionSelection";
import VerificationCode from "../components/VotingStation/VerificationCode";
import SelectVotingOption from "../components/VotingStation/SelectVotingOption";
import VoteConfirmation from "../components/VotingStation/VoteConfirmation";
import Election from "../ethereum/election";
import VoteCompleted from "../components/VotingStation/VoteCompleted";

export default class vote extends Component {
  constructor(props) {
    super(props);
    this.selectElectionHandler = this.selectElectionHandler.bind(this);
    this.verificationCodeHandler = this.verificationCodeHandler.bind(this);
    this.votingOptionHandler = this.votingOptionHandler.bind(this);
    this.voteConfirmationHandler = this.voteConfirmationHandler.bind(this);
  }

  state = {
    selectElectionActive: true,
    selectElectionStatus: false,
    verificationCodeActive: false,
    verificationCodeStatus: false,
    votingOptionActive: false,
    votingOptionStatus: false,
    voteConfirmationActive: false,
    voteConfirmationStatus: false,
    voteCompleted: false,

    selectedElection: "",
    voteOptionsLength: 0,
    voteOptions: null,
    selectedVoteOption: "",
    voteTransaction: "",
  };

  selectElectionHandler(selectedElection) {
    this.setState({ selectElectionActive: false });
    this.setState({ selectElectionStatus: true });
    this.setState({ verificationCodeActive: true });
    this.setState({ selectedElection });
  }

  async verificationCodeHandler() {
    this.setState({ verificationCodeActive: false });
    this.setState({ verificationCodeStatus: true });

    const election = Election(this.state.selectedElection);
    const voteOptionsLength = await election.methods
      .getVoteOptionsLength()
      .call();
    const voteOptions = await Promise.all(
      Array(parseInt(voteOptionsLength))
        .fill()
        .map((element, index) => {
          return election.methods.VoteOptions(index).call();
        })
    );
    this.setState({ voteOptionsLength });
    this.setState({ voteOptions });

    this.setState({ votingOptionActive: true });
  }

  votingOptionHandler(selectedVoteOption, voteTransaction) {
    this.setState({ selectedVoteOption });
    this.setState({ voteTransaction });
    this.setState({ votingOptionActive: false });
    this.setState({ votingOptionStatus: true });
    this.setState({ voteConfirmationActive: true });
  }

  voteConfirmationHandler() {
    this.setState({ voteConfirmationActive: false });
    this.setState({ voteConfirmationStatus: true });
    this.setState({ voteCompleted: true });
  }

  render() {
    const {
      selectElectionActive,
      selectElectionStatus,
      verificationCodeActive,
      verificationCodeStatus,
      votingOptionActive,
      votingOptionStatus,
      voteConfirmationActive,
      voteConfirmationStatus,
      voteCompleted,
      selectedElection,
      voteOptionsLength,
      voteOptions,
      selectedVoteOption,
      voteTransaction,
    } = this.state;

    return (
      <div>
        <h3>Voting Station</h3>
        <VotingSteps
          selectElectionActive={selectElectionActive}
          selectElectionStatus={selectElectionStatus}
          verificationCodeActive={verificationCodeActive}
          verificationCodeStatus={verificationCodeStatus}
          votingOptionActive={votingOptionActive}
          votingOptionStatus={votingOptionStatus}
          voteConfirmationActive={voteConfirmationActive}
          voteConfirmationStatus={voteConfirmationStatus}
        />
        {selectElectionActive ? (
          <ElectionSelection handler={this.selectElectionHandler} />
        ) : null}
        {verificationCodeActive ? (
          <VerificationCode
            selectedElection={selectedElection}
            handler={this.verificationCodeHandler}
          />
        ) : null}
        {votingOptionActive ? (
          <SelectVotingOption
            selectedElection={selectedElection}
            voteOptions={voteOptions}
            voteOptionsLength={voteOptionsLength}
            handler={this.votingOptionHandler}
          />
        ) : null}
        {voteConfirmationActive ? (
          <VoteConfirmation
            selectedVoteOption={selectedVoteOption}
            voteTransaction={voteTransaction}
            selectedElection={selectedElection}
            handler={this.voteConfirmationHandler}
          />
        ) : voteCompleted ? (
          <VoteCompleted />
        ) : null}
      </div>
    );
  }
}
