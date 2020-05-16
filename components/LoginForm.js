import React, { useContext, useState } from "react";
import {
  Grid,
  Form,
  Segment,
  Message,
  Button,
  Loader,
} from "semantic-ui-react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import web3 from "../ethereum/web3";

const LoginForm = (props) => {
  const { signIn } = useContext(AuthContext);

  // The login process is broken in three functions for the three steps required
  // oneClickLoginHandler verifies if the user has metamask enabled and an address was passed
  // if a valid address was passed the client will send a HTTP GET request to obtain the code
  // and it will then pass it to the signChallange function
  const oneClickLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const address = props.address[0];
      const res = await axios.get(
        `http://localhost:3000/auth/challengeRequest/${address.toLowerCase()}`
      );
      signChallenge(res.data);
    } catch (err) {
      console.log(err.response);
      alert(
        "Please open Metamask and login with an election admin account - " + err
      );
    }
  };

  // This function takes the challenge message that needs to be signed and opens metamask
  // to sign it. IF the signature process is successfull it passes the challenge message
  // and the signed message to verify signature
  const signChallenge = async (challenge) => {
    if (challenge) {
      const address = props.address[0];
      web3.currentProvider.sendAsync(
        {
          method: "eth_signTypedData",
          params: [challenge, address],
          from: address,
        },
        async (error, res) => {
          if (error) return console.error(error);
          await verifySignature(challenge, res.result);
        }
      );
    } else {
      alert("Something went wrong, could not sign the challenge. Try again!");
    }
  };

  // The function sends a HTTP GET request with the challenge and the signed challenge
  // If they matched with the cached address that sends the request it will send back
  // a 200 OK status and an object containing a JWT Token will be passed to signIn
  // in the React context.
  const verifySignature = async (challenge, signature) => {
    const address = props.address[0];
    const res = await axios.get(
      `http://localhost:3000/auth/challengeVerify/${challenge[1].value}/${signature}`
    );
    const resMsg = await res.data;
    console.log(res.data);
    if (res.status === 200 && resMsg.address === address.toLowerCase()) {
      signIn(res.data);
    } else {
      alert("Signature not verified, login not allowed!");
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="top">
      <Grid.Column>
        <Segment stacked>
          <Message
            icon="info"
            header="Blockchain E-Vote - Admin Login"
            content="Ensure you are logged in to Metamask with an admin address, then click login."
          />
          <Form onSubmit={oneClickLoginHandler}>
            <Button primary content="Login" disabled={!props.valid} fluid />
          </Form>
          <br />
          {props.valid === null ? (
            <Loader active inline="centered">
              {" "}
              Loading Metamast (check internet connection or Metamask if it
              takes to long to load!)
            </Loader>
          ) : props.valid === true ? (
            <Message compact positive>
              Success! Valid account admin found on metaMask, please login.
            </Message>
          ) : (
            <Message compact negative>
              Error! No Valid admin account found on metaMask, ensure to select
              a valid account on metaMask.
            </Message>
          )}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
