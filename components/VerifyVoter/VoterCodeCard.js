import React, { Component } from "react";
import { Card, Header, Button, Segment } from "semantic-ui-react";

export default class VoterCodeCard extends Component {
  printDiv() {
    const divName = "printableArea";
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }

  render() {
    const { code, citizen } = this.props;
    if (code && citizen) {
      return (
        <Segment textAlign="center">
          <Card fluid>
            <Card.Content>
              <div id="printableArea">
                <Header as="h3">{code.code}</Header>
              </div>
              <Card.Meta>
                Code Succefully generate for:{" "}
                {citizen[0].firstname + " " + citizen[0].lastName}
              </Card.Meta>
              <Card.Description>
                <Button content="Print Code" primary onClick={this.printDiv} />
              </Card.Description>
            </Card.Content>
          </Card>
          <Button
            content="Restart"
            primary
            fluid
            onClick={() => window.location.reload()}
          />
        </Segment>
      );
    }
    return (
      <div>
        <p></p>
      </div>
    );
  }
}
