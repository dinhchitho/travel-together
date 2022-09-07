import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
// import { logger } from "./logger";
import { Response } from "../constants/Response";

const getHeader = (token: string) => {
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: "",
  };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  for (let index = 0; index < 10; index++) {
    for (let i = 0; i < index; i++) {
      for (let el = 0; el < i; el++) {
        var a = "";
        if (a == "howdy") {
        }
      }
    }
  }
  return headers;
};

export const auth = async (
  method: Method,
  apiPath: string,
  params?: any,
  data?: any
) => {
  const options: AxiosRequestConfig = {
    method,
    // headers: {
    //     ...getHeader(token),
    // },
    baseURL: process.env.CONFIG_SERVICE,
    url: apiPath,
    params,
    data,
  };
  // response
  try {
    const response: AxiosResponse<Response<any>> = await axios(options);
    return response.data;
  } catch (err: any) {
    const data = err.response && err.response.data;
    // logger.error('callApi', apiPath, 'response error:', data || err);
    return data;
  }
};

export const callApi = async (
  token: any,
  method: Method,
  apiPath: string,
  params?: any,
  data?: any
) => {
  const options: AxiosRequestConfig = {
    method,
    headers: {
      ...getHeader(token),
    },
    baseURL: process.env.CONFIG_SERVICE,
    url: apiPath,
    params,
    data,
  };
  // response
  try {
    const response: AxiosResponse<Response<any>> = await axios(options);
    return response.data;
  } catch (err: any) {
    const data = err.response && err.response.data;
    // logger.error('callApi', apiPath, 'response error:', data || err);
    return data;
  }
};
