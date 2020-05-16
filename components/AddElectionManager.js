import React, { Component } from "react";
import {
  Form,
  Button,
  Header,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import Election from "../ethereum/election";

export default class AddElectionManager extends Component {
  state = {
    admin: "",
    loading: false,
    errorMsg: "",
  };

  addNewAdminHandler = async () => {
    console.log(this.state.admin);
    this.setState({ loading: true, errorMsg: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const election = Election(this.props.electionAddress);
      await election.methods
        .addManager(this.state.admin)
        .send({ from: accounts[0] });
      alert("New Admin account added");
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false, admin: "" });
  };

  render() {
    return (
      <Segment stacked>
        <div style={{ maxWidth: "32rem", margin: "auto" }}>
          <Form
            name="addAdmin"
            style={{
              padding: "1.5rem",
              borderRadius: "1rem",
            }}
            onSubmit={this.addNewAdminHandler}
            error={!!this.state.errorMsg}
          >
            <Header as="h3" textAlign="center">
              <Icon name="user" />
              Add New Election Administrator
            </Header>
            <Form.Input
              value={this.state.admin}
              onChange={(event) => this.setState({ admin: event.target.value })}
              placeholder="Type new Election Admin Address"
              required
            />
            <Button primary size="large" loading={this.state.loading} fluid>
              Submit
            </Button>
            <Message error header="Error!" content={this.state.errorMsg} />
          </Form>
        </div>
      </Segment>
    );
  }
}
