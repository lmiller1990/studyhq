export default defineWebSocketHandler({
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
  },
});
