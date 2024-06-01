<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { Message } from "openai/resources/beta/threads/messages";

const route = useRoute();

const id = route.params.id;

const { data, refresh } = await useFetch(`/api/threads/${route.params.id}`);

const msg = ref("");

const localMessages = ref<SerializeObject<Message>[]>([]);

const allMessages = computed(() => {
  return (data.value ?? []).concat(localMessages.value);
});

async function handleSubmitMessage() {
  const message = await $fetch("/api/message", {
    method: "POST",
    body: {
      threadId: id,
      message: msg.value,
    },
  });

  localMessages.value.push(message);
}

async function handleRun() {
  ws.send(JSON.stringify({ threadId: id }));
}

const conversation = computed(() => {
  return (data.value ?? []).slice().reverse();
});

let ws: WebSocket;

const replies = ref("");

async function connectWebSocket() {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    console.log("Closing previous connection before reconnecting...");
    ws.close();
  }

  console.log("Connecting to", url, "...");
  ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    console.log("WebSocket opened");
  });

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "text-chunk") {
      console.log(data.text);
      replies.value += data.text;
    }
  });
}

connectWebSocket();
</script>

<template>
  <UContainer>
    <ul class="leading-relaxed">
      <li
        v-for="message of allMessages"
        class="flex w-full my-4"
        :class="{ 'justify-end': message.role === 'user' }"
      >
        <div
          v-if="message.content[0]?.type === 'text'"
          class="p-1 rounded px-2"
          :class="{
            'bg-gray-200': message.role === 'user',
            'max-w-[50vw]': message.role === 'user',
          }"
        >
          {{ message.content[0].text.value }}
        </div>
      </li>
      <li>
        <div class="p-1 rounded px-2">
          {{ replies }}
        </div>
      </li>
    </ul>
  </UContainer>

  <UDivider class="p-4" />

  <form @submit.prevent="handleSubmitMessage">
    <UTextarea v-model="msg" placeholder="Chat..." />
    <UButton type="submit">Start!</UButton>
  </form>

  <UButton @click="handleRun">Run!</UButton>
</template>
