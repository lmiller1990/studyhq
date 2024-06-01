export interface TextChunkPayload {
  type: "text-chunk";
  text: string;
}

export type Payload = TextChunkPayload;

/**
 * @description Create a web socket with listener
 **/
export function useWebSocket(options: {
  onMessage: (payload: Payload) => void;
}) {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";

  console.log("Connecting to", url, "...");
  const ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    console.log("WebSocket opened");
  });

  ws.addEventListener("close", () => {
    console.log("WebSocket closed");
  });

  ws.addEventListener("message", (event: MessageEvent<any>) => {
    options.onMessage(JSON.parse(event.data));
  });

  return ws;
}
