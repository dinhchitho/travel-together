import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { io, Socket } from "socket.io-client";
import { callApi } from "../api/axios";
import {
  NotificationActionTypes,
  NotificationTypesServer,
  NOTIFICATION_ACTIONS_SERVER,
} from "../components/socket-client/actions/notification.actions";
import { USER } from "../constants/paths";
import { Response } from "../constants/Response";
import Routes from "../routes/routes";

import * as actions from "./App.actions";

const variableRegex = "thodc";
const socket: Socket = io(
  `${process.env.REACT_APP_SOCKET_URL}/${variableRegex}`,
  {
    path: "/socket-server/socket",
  }
);

function App() {
  const dispatch: Dispatch<any> = useDispatch();

  console.log("app");

  // const [socket, setSocket] = React.useState<Socket>(
  //   io(`${process.env.REACT_APP_SOCKET_URL}/${variableRegex}`, {
  //     path: "/socket-server/socket",
  //   })
  // );

  const getCurrentUser = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      const res: Response<any> = await callApi(token, "GET", USER.CURRENT_USER);
      if (res.success && res.data != null) {
        if (res.data.notifications && res.data.notifications.length > 0) {
          dispatch(actions.setNotifications(res.data.notifications));
        }
      }
    }
  };

  // Connect Socket
  useEffect(() => {
    let token = localStorage.getItem("token");
    // if (token) {
    getCurrentUser();
    socket.connect();
    socket.on("connect", () => {
      console.log("connect");

      listenServerEvent();
      // executeEmitStacks();
    });
    // }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const listenServerEvent = (): void => {
    listen(NOTIFICATION_ACTIONS_SERVER.NOTIFICATION_ADDED, (data: any) => {
      console.log("data :", data);
      dispatch(actions.addNotification(data));
    });
  };

  const listen = (
    action: NotificationTypesServer,
    callback: (
      type: NotificationActionTypes,
      data: object,
      options: object
    ) => void
  ): void => {
    !socket.hasListeners(action) && socket.on(action, callback);
  };

  return <Routes />;
}

export default App;
