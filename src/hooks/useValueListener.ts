import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export default function useValueListener<T>(event_name: string): T | null {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    socket.on(event_name, (state: T) => {
      setState(state);
    });

    socket.on("disconnect", () => {
      setState(null);
    });
  }, [event_name]);

  return state;
}
