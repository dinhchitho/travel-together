import { Action } from "redux";
import * as types from "./App.constants";
import produce from "immer";
import { LOGIN_SUCCESS } from "../pages/Login/Login.constants";
import { notification } from "antd";
import { NotificationActionTypes } from "../components/socket-client/actions/notification.actions";

const initialState = {
  isAuthenticated: false,
  closeSideNav: false,
  notifications: [] as any,
};

export const AppReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.LOGOUT:
        localStorage.removeItem("token");
        draft.isAuthenticated = false;
        break;
      case LOGIN_SUCCESS:
        draft.isAuthenticated = true;
        break;
      case types.CLOSE_SIDE_NAV:
        draft.closeSideNav = !state.closeSideNav;
        break;
      case types.NOTIFICATIONS:
        draft.notifications = action.payload;
        break;
      case types.ADD_NOTIFICATION:
        draft.notifications.push(action.payload);
        break;
      case types.READ_NOTIFICATION:
        const notifiIndex = draft.notifications.findIndex(
          (item: any) => item.id === action.payload
        );
        if (!draft.notifications[notifiIndex].read) {
          draft.notifications[notifiIndex].read = true;
        }
        break;
      default:
        return state;
    }
  });
