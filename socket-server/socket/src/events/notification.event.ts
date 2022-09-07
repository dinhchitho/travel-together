import { NOTIFICATION_ACTIONS } from "./../actions/notification.actions";
import { getAllNotification } from "../services/notification.service";
import { Payload, Response } from "./../actions/data.constant";
import { Socket, Server } from "socket.io";
import { NotificationClientEvents } from "../actions/notification.actions";
// import { logger } from '../utils/logger';

export const NotificationEvent = (
  socket: Socket<NotificationClientEvents>,
  io: Server
) => {
  const token = socket.handshake.auth.token;
  //Notification
  socket.on(
    "NOTIFICATION:LIST",
    (payload: Payload, callback: (res: Response<any>) => void) => {
      getAllNotification(token, payload, callback);
    }
  );
};

export const handleDataNotifications = (io: Server, options: any) => {
  // const payload: any = [] = options.payload || [];
  const payload: any = options.payload || null;
  const userId: string = options.userId || null;
  console.log("payloadUserId:", userId);

  io._nsps
    .get(`/${userId}`)
    ?.emit(NOTIFICATION_ACTIONS.NOTIFICATION_ADDED, userId, payload);
};

export const handleDataNotificationsAdmin = (io: Server, options: any) => {
  const payload: any = options.payload || null;
  // const userId: string = options.userId || null;
  console.log("options:", options);

  io._nsps.get(`/thodc`)?.emit(
    NOTIFICATION_ACTIONS.NOTIFICATION_ADDED,
    // userId,
    payload
  );
};
