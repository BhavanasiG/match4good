import { Server } from "socket.io";

export default function handleServer(server: Server) {
  let counter = 0;
  setInterval(() => {
    server.emit("counter", counter);
    counter += 1;
  }, 2000);
}
