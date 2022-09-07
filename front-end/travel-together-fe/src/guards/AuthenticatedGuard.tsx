import React from "react";
import {
  Route,
  RouteProps,
  Redirect,
  RouteComponentProps,
} from "react-router-dom";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";

interface ReduxProps {
  isAuthenticated: boolean;
}
interface Props extends ReduxProps, RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

function AuthenticatedGuard(props: Props) {
  const { isAuthenticated, component: Component, ...rest } = props;
  const [isAuthenticatedState, setIsAuthenticatedState] =
    React.useState<any>(null);
  React.useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      let tokenExpiration: any = jwtDecode(token);
      let dateNow = new Date();
      if (tokenExpiration.exp < dateNow.getTime() / 500) {
        setIsAuthenticatedState(false);
      } else {
        setIsAuthenticatedState(true);
      }
    } else {
      setIsAuthenticatedState(false);
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticatedState && !localStorage.getItem("token")) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.app.isAuthenticated,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedGuard);
