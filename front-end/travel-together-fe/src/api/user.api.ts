import axios from "axios";
import { Response } from "../constants/Response";

export const loginApi = ({
  username,
  password,
}: ReqLogin): Promise<ResLoginApi> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "123") {
        resolve({
          data: {
            access_token: "82jdu82193yh90sad83hxfgsd",
          },
          success: true,
          error: [],
          // message: "Login thành công"
        });
      } else {
        reject(new Error("Login thất bại"));
      }
    }, 100);
  });
export const loginApiAdmin = ({
  username,
  password,
}: ReqLogin): Promise<Response<any>> =>
  new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_CONFIG_SERVICE}/auth/signin`, {
        username,
        password,
      })
      .then((res: Response<any>) => {
        if (res.data.success && res.data.data != null) {
          const checkRole = res.data.data.roles.filter(
            (el: any) => el == "ROLE_ADMIN"
          );
          if (checkRole && checkRole.length > 0) {
            resolve(res);
          }
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.data.accessToken}`;
        }
      })
      .catch((error: any) => {
        reject(new Error("Login Failed!"));
      });
  });
