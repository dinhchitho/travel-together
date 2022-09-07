import express from "express";
import { urlencoded, json } from "body-parser";
// import "./loadConfig";
import dotenv from "dotenv";
import { ServerOptions } from "socket.io";
// import { logger } from './utils/logger';
import { createSocketServer } from "./utils/socketServer";
import {
  handleDataNotifications,
  handleDataNotificationsAdmin,
} from "./events/notification.event";
// import morgan from 'morgan';
// import cors from 'cors';
//Express server

dotenv.config();
const app = express();

const port = process.env.PORT || 3333;
// app.use(cors())
// app.use(morgan('dev'))
// app.use(express.json())
// app.use(express.urlencoded())
app.use(express.json());
app.use(express.urlencoded());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = app.listen(port, () => {
  console.log(`SocketIO server is running on port ${port}`);
});

//Socket server
const serverOptions: Partial<ServerOptions> = {
  path: "/socket-server/socket",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 3e7,
  pingTimeout: 60000,
};

const io = createSocketServer(server, serverOptions);
const router = express.Router();

router.post("/notification", (req, res) => {
  // logger.info('handler list notification: ', req.body);
  console.log("handler list notification: ", req.body);
  handleDataNotifications(io, req.body);
  res.json({ handler: "OK" });
});

router.post("/notificationAdmin", (req, res) => {
  // logger.info('handler list notification: ', req.body);
  console.log("handler list notification: ", req.body);
  handleDataNotificationsAdmin(io, req.body);
  res.json({ handler: "OK" });
});

router.get("/test", (req, res) => {
  res.send(
    `<h2>Hi I'm socket server</h2> CONFIG_SERVICE: ${process.env.CONFIG_SERVICE}`
  );
});

app.use("/socket-server", router);
