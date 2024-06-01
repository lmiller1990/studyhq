<script setup lang="ts">
const threadsStore = useThreadsStore();

async function handleStartStudy() {
  const t = await $fetch("/api/threads", { method: "POST" });
  await threadsStore.fetch();
  await navigateTo(`/threads/${t.id}`);
}

const { run, loading } = useLoading(handleStartStudy);

const log = console.log;

let ws: WebSocket;

async function connect() {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    log("ws", "Closing previous connection before reconnecting...");
    ws.close();
  }

  log("ws", "Connecting to", url, "...");
  ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    ws.send("ping");
  });

  ws.addEventListener("message", (event) => {
    const { user = "system", message = "" } = event.data.startsWith("{")
      ? JSON.parse(event.data)
      : { message: event.data };

    log(user, typeof message === "string" ? message : JSON.stringify(message));
  });
}

connect();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h2>Welcome.</h2>
    <div>
      <UButton color="indigo" :loading="loading" @click="run"
        >Start Studying</UButton
      >
    </div>
  </div>
</template>
