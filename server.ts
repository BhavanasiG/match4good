import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import onConnection from "./src/app/ws/onConnection.ts";
import handleServer from "./src/app/ws/handleServer.ts";
import dotenv from "dotenv";

const dev = process.env.NODE_ENV !== "production";
dotenv.config();

const portenv = process.env.PORT;
if (!portenv) {
  console.error("Could not find env variable PORT");
  process.exit(-1);
}

const port = parseInt(portenv);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(
  () => {
    const server = createServer(handle);

    const wss = new Server(server);

    wss.on("connection", onConnection);
    handleServer(wss);

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  },
  () => {}
);
