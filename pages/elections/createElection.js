import React, { Component } from "react";
import {
  Form,
  Button,
  TextArea,
  Message,
  Header,
  Segment,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Router from "next/router";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import NotAuthArea from "../../components/NotAuthArea";

export default class createElection extends Component {
  state = {
    title: "",
    description: "",
    errorMsg: "",
    loading: false,
  };

  static contextType = AuthContext;

  onSubmit = async (event) => {
    event.preventDefault(); //keeps the browser from attempting to submit the form
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = await factory.methods
        .createElection(this.state.title, this.state.description)
        .send({
          from: accounts[0],
        });

      const deployedElectionsLenght = await factory.methods
        .getDeployedElectionsLength()
        .call();
      const newElectionAddress = await factory.methods
        .deployedElections(deployedElectionsLenght - 1)
        .call();

      try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const config = {
          headers: {
            "x-auth-token": auth.token,
          },
        };
        const res = await axios.post(
          "http://localhost:3000/db/createElection",
          {
            publicAddress: newElectionAddress,
          },
          config
        );
        console.log(res);
      } catch (err) {
        this.setState({ errorMsg: err.message });
      }
      alert(
        "Election successfully created, you are going to be redirected to the management page."
      );

      Router.push(`/elections/manage/${newElectionAddress}`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    if (this.context.auth === false) {
      return <NotAuthArea />;
    }
    return (
      <Segment stacked>
        <div style={{ maxWidth: "32rem", margin: "auto" }}>
          <Form
            name="createElection"
            style={{
              padding: "1.5rem",
              borderRadius: "1rem",
            }}
            onSubmit={this.onSubmit}
            error={!!this.state.errorMsg}
          >
            <Header as="h2" textAlign="center">
              Create a New Election
            </Header>
            <Form.Input
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
              placeholder="Election Title"
              required
            />
            <Form.Field
              control={TextArea}
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
              placeholder="Election Description"
              required
            />
            <Button primary size="large" loading={this.state.loading} fluid>
              Create Election
            </Button>
            <Message error header="Error!" content={this.state.errorMsg} />
          </Form>
          <Message
            warning
            icon="warning"
            header="Warning!"
            content="Once an election is created it cannot be deleted - make sure to type correctly."
          />
        </div>
      </Segment>
    );
  }
}
