import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import onConnection from "./src/app/ws/onConnection.js";
import onServerStart from "./src/app/ws/onServerStart.js";
import dotenv from "dotenv";

dotenv.config();
const dev = process.env.NODE_ENV !== "production";

console.log("loaded");

const port = 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(
  () => {
    const server = createServer(handle);

    const wss = new Server(server);

    wss.on("connection", onConnection);
    onServerStart(wss);

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  },
  () => {}
);
