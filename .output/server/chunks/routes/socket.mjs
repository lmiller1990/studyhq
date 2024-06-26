import { b as defineWebSocketHandler } from '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const socket = defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);
    peer.send("Pong");
  },
  async message(peer, message) {
    peer.send("ack");
  },
  close(peer, event) {
    console.log("[ws] close", peer, event);
  },
  error(peer, error) {
    console.log("[ws] error", peer, error);
  }
});

export { socket as default };
//# sourceMappingURL=socket.mjs.map
