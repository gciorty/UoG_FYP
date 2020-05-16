// This is the file that every page in the application includes
// It is essential for operations which require to handle authentication
// the componentDidMount function check if the page is authenticated as admin, voting station or not authenticated at all

import "semantic-ui-css/semantic.min.css";
import React from "react";
import { Container } from "semantic-ui-react";
import App from "next/app";
import Navbar from "../components/Navbar";
import Router from "next/router";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default class _app extends App {
  state = {
    auth: false,
    vote: false,
  };

  componentDidMount = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const vote = JSON.parse(localStorage.getItem("vote"));
    if (auth) {
      const now = Date.now().valueOf() / 1000;
      const decoded = jwt_decode(auth.token);
      if (typeof decoded.exp !== "undefined" && decoded.exp > now) {
        try {
          const config = {
            headers: {
              "x-auth-token": auth.token,
            },
          };
          const res = await axios.get(
            "http://localhost:3000/auth/checkAccess",
            config
          );
          if (res.data.decoded.publicAddress === decoded.publicAddress) {
            this.setState({
              auth: true,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      this.setState({
        auth: false,
      });
    }

    if (vote) {
      const now = Date.now().valueOf() / 1000;
      const decoded = jwt_decode(vote.token);
      if (typeof decoded.exp !== "undefined" && decoded.exp > now) {
        try {
          const config = {
            headers: {
              "x-auth-token": vote.token,
            },
          };
          const res = await axios.get(
            "http://localhost:3000/auth/checkAccess",
            config
          );
          if (res.data.decoded.publicAddress === decoded.publicAddress) {
            this.setState({
              vote: true,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      this.setState({
        vote: false,
      });
    }
  };

  signIn = (token) => {
    localStorage.setItem("auth", JSON.stringify(token));

    this.setState(
      {
        auth: true,
      },
      () => {
        Router.push("/");
      }
    );
  };

  stationIn = (token) => {
    localStorage.setItem("vote", JSON.stringify(token));

    this.setState(
      {
        vote: true,
      },
      () => {
        Router.push("/");
      }
    );
  };

  signOut = () => {
    localStorage.removeItem("auth");
    this.setState({
      auth: false,
    });
    Router.push("/");
    location.reload();
  };

  stationOut = () => {
    localStorage.removeItem("vote");
    this.setState({
      auth: false,
    });
    Router.push("/");
    location.reload();
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <AuthContext.Provider
          value={{
            auth: this.state.auth,
            vote: this.state.vote,
            signIn: this.signIn,
            signOut: this.signOut,
            stationIn: this.stationIn,
            stationOut: this.stationOut,
          }}
        >
          <Container>
            <Navbar />
            <Component {...pageProps} />
          </Container>
        </AuthContext.Provider>
      </React.Fragment>
    );
  }
}
