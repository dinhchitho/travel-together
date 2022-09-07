import { Payload, Response } from "./data.constant";

export const NOTIFICATION_SPACE = 'NOTIFICATION_SP';



export const NOTIFICATION_ACTIONS = {
    LIST_NOTIFICATION: 'NOTIFICATION:LIST',
    ADD_NOTIFICATION: 'NOTIFICATION:ADD',
    NOTIFICATION_ADDED: 'NOTIFICATION:ADDED',
    DELETE_NOTIFICATION: 'NOTIFICATION:DELETE'
}

export interface NotificationServerEvents {
    'NOTIFICATION:ADDED': (userId: string, data: object) => void;
    'NOTIFICATION:DELETE': (userId: string, data: object) => void;
}

export interface NotificationClientEvents {
    'NOTIFICATION:LIST': (payload: Payload, callback: (res: Response<any>) => void) => void;
    'NOTIFICATION:ADD': (payload: Payload, callback: (res: Response<any>) => void) => void;
    'NOTIFICATION:DELETE': (payload: Payload, callback: (res: Response<any>) => void) => void;
}
