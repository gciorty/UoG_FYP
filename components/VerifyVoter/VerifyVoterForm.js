import React, { Component } from "react";
import { Form, Header, Button, Icon, Message } from "semantic-ui-react";
import axios from "axios";
import VoterCodeCard from "./VoterCodeCard";

export default class VerifyVoterForm extends Component {
  state = {
    loading: false,
    cardID: "",
    errorMsg: "",
    citizen: null,
    code: null,
  };

  verifyCardIDHandler = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMsg: "" });
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const res = await axios.post(
        "http://localhost:3000/db/checkCitizen",
        {
          cardID: this.state.cardID,
          electionAddress: this.props.selectedElection,
        },
        config
      );
      const { citizen, code } = res.data;
      if (citizen.length === 0) throw Error;
      this.setState({ citizen });
      this.setState({ code });
    } catch (err) {
      this.setState({
        errorMsg:
          "User might not be authorised to vote or has already requested a code for the election!",
      });
    }
    this.setState({ loading: false });
  };

  render() {
    const { loading, cardID, errorMsg, citizen, code } = this.state;
    return (
      <div>
        <div style={{ maxWidth: "32rem", margin: "auto" }}>
          <Form
            name="cardIDForm"
            style={{
              padding: "1.5rem",
              borderRadius: "1rem",
            }}
            onSubmit={this.verifyCardIDHandler}
            error={!!errorMsg}
          >
            <Header as="h3" textAlign="center">
              <Icon name="user" />
              Type citizen Card ID
            </Header>

            <Form.Input
              value={cardID}
              onChange={(event) =>
                this.setState({ cardID: event.target.value })
              }
              placeholder="Type Card ID here"
              required
            />
            <Button primary size="large" loading={loading} fluid>
              Generate Code
            </Button>
            <br />
            <Message error header="Error!" content={errorMsg} />
          </Form>
        </div>
        <VoterCodeCard citizen={citizen} code={code} />
      </div>
    );
  }
}
