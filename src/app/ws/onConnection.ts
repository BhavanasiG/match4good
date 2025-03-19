import { Socket } from "socket.io";

export default function onConnection(ws: Socket) {
  console.log("New client connected");

  ws.on("disconnect", () => {
    console.log("Client disconnected");
  });
}
