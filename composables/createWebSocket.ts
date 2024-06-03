export interface TextChunkPayload {
  type: "thread.message.delta";
  text: string;
}

export interface ThreadRunCreatedPayload {
  type: "thread.run.created";
}

export interface ThreadStreamCompleted {
  type: "thread.run.completed";
}

export interface ThreadSummarized {
  type: "summary.completed";
}

export type Payload =
  | TextChunkPayload
  | ThreadRunCreatedPayload
  | ThreadStreamCompleted
  | ThreadSummarized;

type WebSocketCallback = (payload: Payload) => void;

const callbacks = new Set<WebSocketCallback>();

/**
 * @description Create a web socket with listener
 **/
export function createWebSocket(options: { name: string }) {
  if (window.ws) {
    return;
  }
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";

  console.log("Connecting to", url, "...");
  const ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    console.log(`WebSocket ${options.name} opened`);
  });

  ws.addEventListener("close", () => {
    console.log(`WebSocket ${options.name} closed`);
  });

  ws.addEventListener("message", (event: MessageEvent<any>) => {
    for (const cb of callbacks) {
      cb(JSON.parse(event.data));
    }
  });

  return ws;
}

export function registerWebSocketCallback(onMessage: WebSocketCallback) {
  if (!window.ws) {
    throw Error("No luck!");
  }

  callbacks.add(onMessage);
  console.log(`Total callbacks: ${callbacks.size}`);
}

export function removeWebSocketCallback(onMessage: WebSocketCallback) {
  callbacks.delete(onMessage);
  console.log(`Total callbacks: ${callbacks.size}`);
}
