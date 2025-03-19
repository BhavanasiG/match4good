import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import onConnection from "./src/app/ws/onConnection.ts";
import handleServer from "./src/app/ws/handleServer.ts";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(
  () => {
    const server = createServer(handle);

    const wss = new Server(server);

    wss.on("connection", onConnection);
    handleServer(wss);

    server.listen(3000, () => {
      console.log("> Ready on http://localhost:3000");
    });
  },
  () => {}
);
