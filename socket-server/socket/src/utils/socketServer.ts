import { notificationUserRegexAdmin } from "./../actions/data.constant";
// import { logger } from './logger';
import { Server as HttpServer } from "http";
import { Server, ServerOptions, Socket } from "socket.io";
import { notificationUserRegex } from "../actions/data.constant";
import { NotificationEvent } from "../events/notification.event";

const connectInfo = (socket: Socket) => {
  return {
    socketId: socket.id,
    // space: socket.nsp.name,
    // User: socket.data.user,
  };
};

export function createSocketServer(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server {
  const io = new Server(httpServer, serverOptions);

  // io.on('connection', (socket: Socket) => {
  //     logger.info('Connected:', socket.id, '- User:', socket.data)
  //     //disconnect
  //     socket.on('disconnect', () => {
  //         logger.info('Disconnected:', socket.id, '-User:', socket.data)
  //     });
  //     // handle error
  //     socket.on('error', (err) => {
  //         logger.error(err);
  //     });
  //     socket.on('connect_error', (err) => {
  //         logger.error('Connect error: ', err);
  //     });
  // });

  io.of(notificationUserRegex).on("connection", (socket: Socket) => {
    // logger.info('Connected:', socket.id, '- User:', socket.data)

    NotificationEvent(socket, io);

    console.log("Connected:", socket.id, "- User:", socket.data);
    // disconnect
    socket.on("disconnect", () => {
      // logger.info('Disconnect Notifications:', connectInfo(socket));
    });
    //handler error
    socket.on("error", (err) => {
      // logger.error('Notifications:', connectInfo(socket), err);
    });
    socket.on("connect_error", (err) => {
      // logger.error('Notifications - Connect error:', connectInfo(socket), err);
    });
  });

  io.of(notificationUserRegexAdmin).on("connection", (socket: Socket) => {
    // logger.info('Connected:', socket.id, '- User:', socket.data)

    // NotificationEvent(socket, io);

    // disconnect
    socket.on("disconnect", () => {
      // logger.info('Disconnect Notifications:', connectInfo(socket));
    });
    //handler error
    socket.on("error", (err) => {
      // logger.error('Notifications:', connectInfo(socket), err);
    });
    socket.on("connect_error", (err) => {
      // logger.error('Notifications - Connect error:', connectInfo(socket), err);
    });
  });
  return io;
}
