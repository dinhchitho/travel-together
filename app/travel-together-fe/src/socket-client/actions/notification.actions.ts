import { Action } from "redux";
import { Payload, Response } from "../constants/data.constants";

export const NOTIFICATION_ACTIONS = {
    LIST_NOTIFICATION: 'NOTIFICATION:LIST',
    ADD_NOTIFICATION: 'NOTIFICATION:ADD',
    NOTIFICATION_ADDED: 'NOTIFICATION_ADDED',
    NOTIFICATION_DELETE: 'NOTIFICATION_DELETE'
}

//client commit
export enum NOTIFICATION_ACTIONS_CLIENT {
    LIST_NOTIFICATION = 'NOTIFICATION:LIST',
    NOTIFICATION_ADD = 'NOTIFICATION:ADD',
}

// listen server
export enum NOTIFICATION_ACTIONS_SERVER {
    NOTIFICATION_ADDED = 'NOTIFICATION:ADDED',
    // LIST_NOTIFICATION = 'NOTIFICATION:LIST'
}



export interface NotificationServerEvents { 
    'NOTIFICATION:ADDED': (userId: string, data: object) => void;
}

export interface NotificationClientEvents {
    'NOTIFICATION:LIST': (payload: Payload, callback: (res: Response<any>) => void) => void;
}


export type NotificationTypesServer = NOTIFICATION_ACTIONS_SERVER;

export type NotificationTypesClient = NOTIFICATION_ACTIONS_CLIENT;