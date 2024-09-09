import React from "react";
import { isSilentSigninRequired, SilentSignin } from "casdoor-react-sdk";
import * as Setting from "../Setting";
import LoginPage from "./LoginPage";
import {Link} from "react-router-dom";


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: undefined,
    };
  }

  componentDidMount() {
    if (Setting.isLoggedIn()) {
      Setting.getUserinfo().then((res) => {
        if (res?.status === "ok") {
          this.setState({
            account: {
              username: res.data.name,
            },
          });
        } else {
          Setting.showMessage(res?.status);
        }
      });
    }
  }

  logout() {
    Setting.logout();
    Setting.showMessage("logout successfully");
    Setting.goToLink("/");
  }

  render() {
    if (Setting.isLoggedIn()) {
      if (this.state.account) {
        return (
            <div
                style={{
                  marginTop: 200,
                  textAlign: "center",
                  alignItems: "center",
                }}
            >
              <img
                  width={200}
                  height={100}
                  src="/addons/o4b_logo.png"
                  alt="Logo"
              />
              <br/>
              <p>Welcome {this.state.account.username}!</p>
              <br/>
              <Link to="/articles">
                <button>View Articles</button>
              </Link>
              <br/>
              <Link to="/manage-articles">
                <button>Manage Articles</button>
              </Link>
              <br/>
              <Link to="/casbinmanager">
                <button>Casbin Manager</button>
              </Link>
              <br/>
              <button onClick={this.logout}>Logout</button>
            </div>
        );
      } else {
        return <p>Loading...</p>;
      }
    }

    if (isSilentSigninRequired()) {
      return (
          <div
              style={{ marginTop: 200, textAlign: "center", alignItems: "center" }}
          >
            <SilentSignin
                sdk={Setting.CasdoorSDK}
                isLoggedIn={Setting.isLoggedIn}
                handleReceivedSilentSigninSuccessEvent={() => Setting.goToLink("/")}
                handleReceivedSilentSigninFailureEvent={() => {}}
            />
            <p>Logging in...</p>
          </div>
      );
    }

    return (
        <div style={{ marginTop: 200 }}>
          <LoginPage />
        </div>
    );
  }
}

export default HomePage;
