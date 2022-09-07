export interface Payload {
    data?: any,
    options?: any,
}

export type Error = {
    code: string,
    message: string
}

export type Response<T = any> = {
    data: T,
    success: boolean,
    error: Array<Error>,
    validateMessage?: any
} | T;