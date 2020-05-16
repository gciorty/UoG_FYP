import React, { Component } from "react";
import { Card, Button, Message, Loader } from "semantic-ui-react";
import Election from "../ethereum/election";
import Link from "next/link";
import AuthContext from "../context/AuthContext";
import { Pagination } from "semantic-ui-react";

export default class ElectionCard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedPage: 1,
    numberOfPages: 1,
    pageSize: 5,
    cards: null,
  };

  static contextType = AuthContext;

  async componentDidMount() {
    const { elections } = this.props;
    const { selectedPage, pageSize } = this.state;
    const numberOfPages = Math.ceil(elections.length / pageSize);
    this.setState({ numberOfPages });
    this.renderAsyncElections(selectedPage);
  }

  async getElectionDetails(electionAddress) {
    const election = Election(electionAddress);
    const title = await election.methods.title().call();
    const description = await election.methods.description().call();
    const finalized = await election.methods.finalized().call();
    const enabled = await election.methods.enabled().call();
    const electionDetails = {
      electionAddress,
      title,
      description,
      finalized,
      enabled,
    };
    return electionDetails;
  }

  setPageNum = async (event, { activePage }) => {
    this.setState({ selectedPage: activePage });
    this.renderAsyncElections(activePage);
  };

  async renderAsyncElections(activePage) {
    const { pageSize } = this.state;
    const items = this.props.elections.slice(
      (activePage - 1) * pageSize,
      activePage * pageSize
    );

    const functionWithPromise = (item) => {
      //a function that returns a promise
      return Promise.resolve(item);
    };

    const anAsyncFunction = async (item) => {
      const details = await this.getElectionDetails(item);
      return functionWithPromise(details);
    };

    const getData = async () => {
      return Promise.all(items.map((item) => anAsyncFunction(item)));
    };

    getData().then((data) => {
      const items = data.map((item, index) => {
        const titleBody = (
          <div>
            <div style={{ float: "left" }}>
              <h3>{item.title}</h3>
            </div>
            <div style={{ float: "right" }}>
              {item.finalized ? (
                <Message positive compact>
                  The election is concluded!
                </Message>
              ) : item.enabled ? (
                <Message color="blue" compact>
                  The election is on-going!
                </Message>
              ) : (
                <Message color="yellow" compact>
                  The election is not open yet!
                </Message>
              )}
            </div>
          </div>
        );

        const descriptionBody = (
          <div style={{ color: "black", fontSize: "16px" }}>
            <p>{item.description}</p>
            {this.context.auth ? (
              <div>
                <Link href={`/elections/manage/${item.electionAddress}`}>
                  <Button
                    size="tiny"
                    icon="cog"
                    content="Manage Election"
                    primary
                  />
                </Link>
                <Link href={`/elections/${item.electionAddress}`}>
                  <Button
                    icon="bars"
                    size="tiny"
                    content="View Election"
                    primary
                  />
                </Link>
              </div>
            ) : (
              <Link href={`/elections/${item.electionAddress}`}>
                <Button
                  icon="bars"
                  size="tiny"
                  content="View Election"
                  primary
                />
              </Link>
            )}
          </div>
        );

        const color =
          item.finalized === true ? "green" : item.enabled ? "blue" : "yellow";

        return {
          key: index,
          color: color,
          header: titleBody,
          extra: descriptionBody,
          fluid: true,
        };
      });
      const cards = <Card.Group items={items} />;
      this.setState({ cards });
    });
  }

  render() {
    const { selectedPage, numberOfPages, cards } = this.state;
    return (
      <div>
        {cards !== null ? cards : <Loader active inline="centered" />}

        <div style={{ margin: "2rem auto", textAlign: "center" }}>
          <Pagination
            activePage={selectedPage}
            totalPages={numberOfPages}
            siblingRange={1}
            onPageChange={this.setPageNum}
          />
        </div>
      </div>
    );
  }
}
