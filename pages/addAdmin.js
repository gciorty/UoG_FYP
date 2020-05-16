import React, { Component } from "react";
import AuthContext from "../context/AuthContext";
import { Message, Grid, Segment, Container } from "semantic-ui-react";
import NotAuthArea from "../components/NotAuthArea";
import AddAdminForm from "../components/AddAdminForm";

export default class addAdmin extends Component {
  static contextType = AuthContext;
  render() {
    if (this.context.auth === false) {
      return <NotAuthArea />;
    }
    return (
      <Container>
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="top"
        >
          <Grid.Column>
            <Segment stacked>
              <Message
                icon="info"
                header="Blockchain E-Vote - Add new election manager"
                content="Use this area to add new election managers to the e-voting platform."
              />
              <AddAdminForm />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
