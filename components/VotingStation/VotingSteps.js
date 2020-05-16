import React, { Component } from "react";
import { Step } from "semantic-ui-react";

export default class VotingSteps extends Component {
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
    } = this.props;
    return (
      <div style={{ margin: "2rem auto", textAlign: "center" }}>
        <Step.Group ordered>
          <Step active={selectElectionActive} completed={selectElectionStatus}>
            <Step.Content>
              <Step.Title>Select Election</Step.Title>
              <Step.Description>
                Select from on-going elections
              </Step.Description>
            </Step.Content>
          </Step>

          <Step
            active={verificationCodeActive}
            completed={verificationCodeStatus}
          >
            <Step.Content>
              <Step.Title>Verification Code</Step.Title>
              <Step.Description>Enter the verification code</Step.Description>
            </Step.Content>
          </Step>

          <Step active={votingOptionActive} completed={votingOptionStatus}>
            <Step.Content>
              <Step.Title>Select Voting Option</Step.Title>
              <Step.Description>Select the vote option</Step.Description>
            </Step.Content>
          </Step>

          <Step
            active={voteConfirmationActive}
            completed={voteConfirmationStatus}
          >
            <Step.Content>
              <Step.Title>Vote Confirmation</Step.Title>
              <Step.Description>Get your confirmation code</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
      </div>
    );
  }
}
