import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { login } from "./Login.thunks";
import { useHistory } from "react-router-dom";
import { PATH } from "../../constants/paths";
import "./Login.scss";
import logo from "./../../assets/images/thumbnail-login.svg";

const mapStateToProps = (state: any) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  login,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {}

const Login = (props: Props) => {
  const { login, loading } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      const payload = { username, password };
      login(payload)
        .then((res) => {
          history.push(PATH.HOME);
        })
        .catch((err) => {
          setError(err.payload.message);
        });
    }
  };

  return (
    <div className="container">
      <div className="main-login">
        <div className="main-left">
          <img src={logo} />
        </div>
        <div className="main-right">
          <div className="login-title">Login to your account</div>
          <div className="container-login-form">
            <form onSubmit={submit}>
              <div className="input-login">
                <div className="label-input">Username</div>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={handleUsername}
                />
              </div>
              <div className="input-login">
                <div className="label-input">Password</div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handlePassword}
                />
              </div>
              {error && <div>{error}</div>}
              <div className="container-btn-login">
                <button className="btn-login" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Login);
