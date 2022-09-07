import { Action } from "redux";
import { Dispatch } from "react";
import axios from "axios";
import { BASE_URL } from "../../utilites";

export enum NotificationActionTypes {
  GET_ALL_NOTIFICATION = "NOTIFICATION:GET_ALL",
  GET_ALL_NOTIFICATION_SUCCESS = "NOTIFICATION:GET_ALL_SUCCESS",
  LIST_NOTIFICATION = "NOTIFICATION:LIST",
  ADD_NOTIFICATION = "NOTIFICATION:ADD",
  DELETE_NOTIFICATION = "NOTIFICATION:DELETE",
  COUNT_NUMER_READ = "NOTIFICATION:COUNT",
  UPDATE_IS_READ = "NOTIFICATION:UPDATE",
}

export class GetAllNotification implements Action {
  readonly type = NotificationActionTypes.GET_ALL_NOTIFICATION;
  constructor(
    public payload: {
      userId: string;
    }
  ) {}
}
export class GetAllNotificationSuccess implements Action {
  readonly type = NotificationActionTypes.GET_ALL_NOTIFICATION_SUCCESS;
  constructor(
    public payload: {
      notifications: Notification[];
      updateCurrent: boolean;
    }
  ) {}
}

export class AddNotification implements Action {
  readonly type = NotificationActionTypes.ADD_NOTIFICATION;
  constructor(
    public payload: {
      notifications: Notification[];
    }
  ) {}
}

export class DeleteNotification implements Action {
  readonly type = NotificationActionTypes.DELETE_NOTIFICATION;
  constructor(
    public payload: {
      ids: string[];
    }
  ) {}
}

export class COUNT_NUMER_READ implements Action {
  readonly type = NotificationActionTypes.COUNT_NUMER_READ;
  constructor(
    public payload: {
      numberRead: number;
    }
  ) {}
}
export class UpdateNotification implements Action {
  readonly type = NotificationActionTypes.UPDATE_IS_READ;
  constructor(
    public payload: {
      notifications: Notification[];
    }
  ) {}
}

export const onSetAllNotification = (data: any) => {
  return async (dispatch: Dispatch<NotificationActions>) => {
    dispatch({
      type: NotificationActionTypes.GET_ALL_NOTIFICATION_SUCCESS,
      payload: {
        notifications: [...data],
        updateCurrent: false,
      },
    });
  };
};

export const addNotification = (data: any) => {
  return async (dispatch: Dispatch<NotificationActions>) => {
    dispatch({
      type: NotificationActionTypes.ADD_NOTIFICATION,
      payload: data,
    });
  };
};

export const updateNotification = (data: any) => {
  return async (dispatch: Dispatch<NotificationActions>) => {
    try {
      const res = await axios.post(`${BASE_URL}user/read?notifyId=${data}`);
      if (res) {
        dispatch({
          type: NotificationActionTypes.UPDATE_IS_READ,
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export type NotificationActions =
  | GetAllNotification
  | GetAllNotificationSuccess
  | AddNotification
  | DeleteNotification
  | COUNT_NUMER_READ
  | UpdateNotification;
