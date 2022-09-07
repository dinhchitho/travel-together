import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import { Response } from "../actions/data.constant";
// import { logger } from "./logger";

const getHeader = (token: string) => {
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: "",
  };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return headers;
};

export const callApi = async (
  token: string,
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
