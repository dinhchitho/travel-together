import axios, { AxiosRequestConfig } from 'axios';
// import { logger } from "./logger";

const tokenInfoUrl: string = process.env.TOKEN_INFO_URl || '';

export const getUserInfo =async (token: string): Promise<any> => {
    // headers
    const headers = {
        'Content-Type': '',
        'Authorization': ''
    };
    // options 
    const options: AxiosRequestConfig = {
        method: 'POST',
        url: tokenInfoUrl,
        headers,
        params: { token }
    };
    // response
    let data;
    try {
        const response = await axios(options);
        if (response.status == 200) {
            data = response.data;
        }
    } catch (err: any) {
        data = err.response && err.response.data;
        // logger.error('getUserInfo error:', data);
        throw new Error('getUserInfo: '+ data);
    }
    return data;
}

export const errorHandler = (status: number, err: any, res: any) => {
    res.status(status || 500);
    if (typeof err == 'string') res.json({ error: err });
    else res.json(err);
}

export const restAuthen =async (req: any, res: any, next: any) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || (authorization && !authorization.startWith('Bearer'))) {
            return errorHandler(401, 'Unauthorized', res);
        }
        const split = authorization.split('Bearer ');
        if (split.length !== 2) {
            return errorHandler(401, 'Unauthorized', res);
        }
        // logger.info(split[1]);
        const user = await getUserInfo(split[1]);
        if (user && user.active && user.user_name) {
            next();
        } else {
            // logger.info(user, split[1]);
            return errorHandler(401, 'Unauthorized', res);
        }
    } catch (e) {
        return errorHandler(401, 'Unauthorized', res);
    }
}