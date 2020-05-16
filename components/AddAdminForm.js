import React, { Component } from "react";
import { Form, Button, Header, Message } from "semantic-ui-react";
import factory from "../ethereum/factory";

export default class AddAdminForm extends Component {
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
      await factory.methods
        .addAdmin(this.state.admin)
        .send({ from: accounts[0] });
      alert("New Admin account added");
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }
    this.setState({ loading: false, admin: "" });
  };

  render() {
    return (
      <div>
        <Form
          name="addAdmin"
          style={{
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
          onSubmit={this.addNewAdminHandler}
          error={!!this.state.errorMsg}
        >
          <Header as="h2" textAlign="center">
            Add New Admin
          </Header>
          <Form.Input
            value={this.state.admin}
            onChange={(event) => this.setState({ admin: event.target.value })}
            placeholder="Type new Admin Address"
            required
          />
          <Button primary size="large" loading={this.state.loading} fluid>
            Submit
          </Button>
          <Message error header="Error!" content={this.state.errorMsg} />
        </Form>
      </div>
    );
  }
}
