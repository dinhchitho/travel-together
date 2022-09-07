import { NOTIFICATION_ACTIONS } from "../../socket-client/actions/notification.actions";
import {
  NotificationActions,
  NotificationActionTypes,
} from "../actions/notification.actions";

type NotificationReducer = {
  objectNotification: any;
  ids: string | undefined;
  numberRead: any;
};

interface IobjectNotification {
  notifications: Notification[];
  updateCurrent: boolean;
}

const initialState = {
  objectNotification: {
    notifications: [],
    updateCurrent: false,
  } as IobjectNotification,
  ids: undefined,
  numberRead: 0,
};

const NotificationReducer = (
  state: NotificationReducer = initialState,
  action: NotificationActions
) => {
  switch (action.type) {
    case NotificationActionTypes.GET_ALL_NOTIFICATION_SUCCESS:
      return {
        ...state,
        objectNotification: {
          notifications: action.payload.notifications,
          updateCurrent: false,
        },
      };
    case NotificationActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        objectNotification: {
          notifications: [
            ...state.objectNotification.notifications,
            action.payload,
          ],
        },
      };
    case NotificationActionTypes.COUNT_NUMER_READ:
      return {
        ...state,
        numberRead: action.payload,
      };
    case NotificationActionTypes.UPDATE_IS_READ:
      return {
        ...state,
        objectNotification: {
          notifications: state.objectNotification.notifications.map(
            (element: any) =>
              element.id == action.payload
                ? { ...element, read: true }
                : element
          ),
        },
      };
    default:
      return state;
  }
};

export { NotificationReducer };
