import { loginApiAdmin } from "../../api/user.api"
import * as actions from "./Login.actions"

export const login = (payload: ReqLogin) => (dispatch: any) => {
  dispatch(actions.loginRequested())
  return loginApiAdmin(payload)
    .then(res => {
      const accessToken = res.data.data.accessToken
      localStorage.setItem("token", accessToken)
      return dispatch(actions.loginSuccess(res))
    })
    .catch(err => Promise.reject(dispatch(actions.loginFailed(err))))
}
