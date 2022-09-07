export const PATH = {
  HOME: "/",
  BLOG: "/blogs",
  USER: "/users",
  TRAVEL_REQUEST: "/travel-request",
  ADS: "/ads",
  QA: "/qa",
  REPORT_USER: "/reports-user",
  REPORT_BLOG: "/reports-blog",
  PRODUCT: "/product",
  LOGIN: "/login",
};

export const BASE_URL = "http://localhost:8095/api/admin";

export const SOCKET_URL = "http://192.168.1.195:3333";

export const USER = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAll",
  DELETE_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/admin/delete",
  BAN_USER_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/admin/banAcc",
  GET_USER_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/user/getUserById",
  CURRENT_USER: process.env.REACT_APP_CONFIG_SERVICE + "/user/current-user",
};

export const BLOG = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAllBlog",
  BAN_BLOG_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/admin/banBlog",
  GET_BLOG_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/user/blog/getById",
  DELETE_BLOG_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/user/blog",
};

export const TRAVEL_REQUEST = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAllTravel",
};

export const ADS = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAllAds",
  GET_ADS_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/user/ads/getById",
  BAN_AD_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/admin/banAds",
};

export const QA = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAllQa",
  GET_QA_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/user/qa/getById",
  BAN_QA_BY_ID: process.env.REACT_APP_CONFIG_SERVICE + "/admin/banQa",
};

export const REPORT = {
  GET_ALL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/getAllReport",
  DELETE_REPORT: process.env.REACT_APP_CONFIG_SERVICE + "/admin/skip-report",
};
export const NOTIFICATION = {
  READ: process.env.REACT_APP_CONFIG_SERVICE + "/user/read",
};

export const ADMIN = {
  GET_TOTAL: process.env.REACT_APP_CONFIG_SERVICE + "/admin/total",
};

export const AUTH = {
  SIGN_IN: "/api/auth/signin",
};
