import * as types from "./App.constants";

export const logout = () => ({
  type: types.LOGOUT,
});

export const toggleSideNav = () => ({
  type: types.CLOSE_SIDE_NAV,
});

export const setNotifications = (payload: any) => ({
  type: types.NOTIFICATIONS,
  payload: payload,
});

export const addNotification = (payload: any) => ({
  type: types.ADD_NOTIFICATION,
  payload: payload,
});

export const readNotification = (payload: any) => ({
  type: types.READ_NOTIFICATION,
  payload: payload,
});
