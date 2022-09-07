import axios from "axios";

import { Dispatch } from "react";
import { log } from "react-native-reanimated";
import { BASE_URL } from "../../utilites/";

// Login Action will return id, email, username, accesstoken
export interface LoginAction {
  readonly type: "ON_LOGIN";
  payload: any;
}
export interface LogoutAction {
  readonly type: "ON_LOGOUT";
  payload: any;
}
export interface GetCurrentUserAction {
  type: "ON_CURRENT_USER";
  payload: any;
}

export interface UpdateCurrentUser {
  readonly type: "ON_UPDATE_CURRENT_USER";
  payload: any;
}

export interface AddBlackListCurrentUser {
  readonly type: "ON_ADD_BLACKLIST_CURRENT_USER";
  payload: any;
}

export interface RemoveBlackListCurrentUser {
  readonly type: "ON_REMOVE_BLACKLIST_CURRENT_USER";
  payload: any;
}

export interface toggleActiveTravelrequestCurrentUser {
  readonly type: "ON_TOGGLE_TRAVELREQUEST_CURRENT_USER";
  payload: any;
}

export interface updateTravelRequestCurrentUser {
  readonly type: "ON_UPDATE_TRAVELREQUEST_CURRENT_USER";
  payload: any;
}
export interface updateFollowingCurrentUser {
  readonly type: "ON_UPDATE_TRAVELREQUEST_CURRENT_USER";
  payload: any;
}
export interface updateFollowerCurrentUser {
  readonly type: "ON_UPDATE_TRAVELREQUEST_CURRENT_USER";
  payload: any;
}

export interface UpdateLocalGuide {
  readonly type: "ON_UPDATE_LOCAL_GUIDE";
  payload: any;
}
export interface ErrorAction {
  readonly type: "ON_ERROR";
  payload: any;
}

export type UserAction =
  | LoginAction
  | ErrorAction
  | LogoutAction
  | GetCurrentUserAction
  | UpdateCurrentUser
  | AddBlackListCurrentUser
  | RemoveBlackListCurrentUser
  | toggleActiveTravelrequestCurrentUser
  | updateTravelRequestCurrentUser
  | UpdateLocalGuide;

// export const Init = () => {
//   return async (dispatch: Dispatch<any>) => {
//     let token = await AsyncStorage.getItem("token");
//     if (token !== null) {
//       dispatch({
//         type: "ON_LOGIN",
//         payload: {
//           firstName: "",
//           lastName: "",
//           subscription: "",
//           token: token,
//         },
//       });
//     }
//   }
// }

// we need to dispatch action
export const onLogin = (data: any, data2: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_LOGIN",
      payload: data,
    });
    dispatch({
      type: "ON_CURRENT_USER",
      payload: data2,
    });
  };
};

// login dispatch action
export const Logout = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_LOGOUT",
      payload: null,
    });
  };
};

export const onLoginExternal = (
  username: string,
  fullName: string,
  email: string,
  imageAvatar: string,
  phone: string
) => {
  console.log("${BASE_URL}auth/signin :", `${BASE_URL}auth/signin`);

  return async (dispatch: Dispatch<UserAction>) => {
    try {
      let response = await axios.post(`${BASE_URL}auth/signin/external`, {
        username,
        fullName,
        email,
        imageAvatar,
        phone,
      });

      if (!response) {
        // await AsyncStorage.setItem('token', response.data.data.accessToken);
        dispatch({
          type: "ON_ERROR",
          payload: "Login issue with API",
        });
      } else {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.accessToken}`;

        if (response.data.data.accessToken) {
          let res2 = await axios.get(`${BASE_URL}user/current-user`);
          if (!res2) {
            dispatch({
              type: "ON_ERROR",
              payload: "Get user issue with API",
            });
          } else {
            dispatch({
              type: "ON_CURRENT_USER",
              payload: { ...res2.data.data, isLoginExternal: true },
            });
            dispatch({
              type: "ON_LOGIN",
              payload: response.data.data,
            });
          }
        }
      }
    } catch (error: any) {
      console.log(error);

      dispatch({
        type: "ON_ERROR",
        payload: "Usename or Pasword not correct!",
      });
    }
  };
};

export const UpdateCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_UPDATE_CURRENT_USER",
      payload: data,
    });
  };
};
export const AddBlackListCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_ADD_BLACKLIST_CURRENT_USER",
      payload: data,
    });
  };
};

export const RemoveBlackListCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_REMOVE_BLACKLIST_CURRENT_USER",
      payload: data,
    });
  };
};

export const ToggleTravelRequestCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_TOGGLE_TRAVELREQUEST_CURRENT_USER",
      payload: data,
    });
  };
};

export const updateTravelRequestCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_UPDATE_TRAVELREQUEST_CURRENT_USER",
      payload: data,
    });
  };
};

export const onUpdateLocalGuideCurrentUser = (data: any) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_UPDATE_LOCAL_GUIDE",
      payload: data,
    });
  };
};
