export interface Payload {
  data?: any;
  options?: any;
}

export type Error = {
  code: string;
  message: string;
};

export type Response<T = any> =
  | {
      data: T;
      success: boolean;
      error: Array<Error>;
      validateMessage?: any;
    }
  | T;

export const getErrorResponse = (message: string): Response<any> => {
  const failed: Response<any> = {
    data: null,
    error: [
      {
        code: "400 - SERVER ERROR",
        message,
      },
    ],
    success: false,
  };
  return failed;
};

export const notificationUserRegex = new RegExp("^/[a-z0-9]{24}$");

export const notificationUserRegexAdmin = new RegExp("^/[a-z0-9]{5}$");
