import React, { Fragment, useContext } from "react";
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import AuthContext from "../context/AuthContext";

export default () => {
  const { auth, vote, signOut, stationOut } = useContext(AuthContext);
  console.log("auth:" + auth);
  console.log("vote:" + vote);
  return (
    <Menu stackable style={{ marginTop: "10px" }}>
      <Menu.Item>
        <Link href="/">
          <a className="icon">
            <Icon name="chain" />
            EVote
          </a>
        </Link>
      </Menu.Item>
      <Menu.Menu position="right">
        {auth ? (
          <Fragment>
            {vote ? (
              <Link href="/">
                <a className="item" onClick={stationOut}>
                  <Icon name="building" color="green" />
                  Remove Station Authorization
                </a>
              </Link>
            ) : (
              <Link href="/authStation">
                <a className="item">
                  <Icon name="building" />
                  Authorize Voting Station{" "}
                </a>
              </Link>
            )}
            <Dropdown item text="Elections Console">
              <Dropdown.Menu>
                <Link href="/elections/createElection">
                  <Dropdown.Item>
                    <a>New Election</a>
                  </Dropdown.Item>
                </Link>
                <Link href="/addAdmin">
                  <Dropdown.Item>
                    <a>Add Admin</a>
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown>
            <Link href="/verifyVoter">
              <a className="item">
                <Icon name="id card" />
                Verify Voter
              </a>
            </Link>
            <Link href="/">
              <a className="item" onClick={signOut}>
                <Icon name="log out" />
                Logout
              </a>
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            {vote && auth ? (
              <Link href="/">
                <a className="item" onClick={stationOut}>
                  <Icon name="building" color="green" />
                  Remove Station Authorization
                </a>
              </Link>
            ) : vote && !auth ? (
              <div>
                <Menu.Item>
                  <Icon name="building" color="green" />
                  Station Authorized
                </Menu.Item>
              </div>
            ) : null}
            {vote && !auth ? (
              <Link href="/vote">
                <a className="item">
                  <Icon name="pencil" />
                  Vote
                </a>
              </Link>
            ) : null}
            <Link href="/checkVote">
              <a className="item">
                <Icon name="check" />
                Check Vote
              </a>
            </Link>
            <Link href="/login">
              <a className="item">
                <Icon name="user" />
                Admin Login
              </a>
            </Link>
          </Fragment>
        )}
      </Menu.Menu>
    </Menu>
  );
};
