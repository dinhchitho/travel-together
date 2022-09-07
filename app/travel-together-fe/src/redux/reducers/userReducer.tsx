import { log } from "react-native-reanimated";
import { UserModelLogin } from "../../model/ModelUser";
import { UserAction } from "../actions/loginAction";

type UserState = {
  user: any;
  error: string | undefined;
  userCurrent: any;
};

const initialState = {
  user: {} as any,
  error: undefined,
  userCurrent: {} as any,
  authToken: null,
};

const UserReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case "ON_LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "ON_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "ON_LOGOUT":
      return {
        ...state,
        user: action.payload,
      };
    case "ON_CURRENT_USER":
      return {
        ...state,
        userCurrent: action.payload,
      };
    case "ON_UPDATE_CURRENT_USER":
      return {
        ...state,
        userCurrent: action.payload,
      };
    case "ON_ADD_BLACKLIST_CURRENT_USER":
      return {
        ...state,
        userCurrent: {
          ...state.userCurrent,
          blackListedUsers: [
            ...state.userCurrent.blackListedUsers,
            action.payload,
          ],
        },
      };
    case "ON_REMOVE_BLACKLIST_CURRENT_USER":
      return {
        ...state,
        userCurrent: {
          ...state.userCurrent,
          blackListedUsers: [
            state.userCurrent.blackListedUsers.filter(
              (item: any) => item.id != action.payload
            ),
          ],
        },
      };
    case "ON_TOGGLE_TRAVELREQUEST_CURRENT_USER":
      console.log("payload", action.payload);
      return {
        ...state,
        userCurrent: {
          ...state.userCurrent,
          travelRequest: {
            ...state.userCurrent.travelRequest,
            active: action.payload,
          },
        },
      };
    case "ON_UPDATE_TRAVELREQUEST_CURRENT_USER":
      console.log("payload", action.payload);
      return {
        ...state,
        userCurrent: {
          ...state.userCurrent,
          travelRequest: action.payload,
        },
      };
    case "ON_UPDATE_LOCAL_GUIDE":
      return {
        ...state,
        userCurrent: {
          ...state.userCurrent,
          localGuide: action.payload,
        },
      };
    default:
      return state;
  }
};

export { UserReducer };
