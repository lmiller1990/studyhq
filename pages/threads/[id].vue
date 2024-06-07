<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { Message } from "openai/resources/beta/threads/messages";
import {
  removeWebSocketCallback,
  type Payload,
} from "~/composables/createWebSocket";

const route = useRoute();

const id = route.params.id;

const { data, refresh } = await useFetch(`/api/threads/${route.params.id}`);

const msg = ref("");
const textAreaRef = ref<{ textarea: HTMLTextAreaElement }>();

onMounted(() => {
  textAreaRef.value?.textarea.focus();
});

const localMessages = ref<SerializeObject<Message>[]>([]);

const allMessages = computed(() => {
  return [
    createTempMsg(
      "Hi 👋 I am here to help you learn about whatever you want. Over to you!",
      "system",
    ),
  ]
    .concat(data.value ?? [])
    .concat(localMessages.value);
});

const submitting = ref(false);

const firstMessage = computed(() => {
  const f = allMessages.value[1] as Message | undefined;
  if (f && f.content[0].type === "text") {
    return f.content[0].text.value;
  }
});

async function handleSubmitMessage() {
  if (submitting.value) {
    // double submit
    return;
  }
  submitting.value = true;
  const cachedMsg = msg.value.trim();

  // 1. Push locally to make it show up
  localMessages.value.push(createTempMsg(cachedMsg, "user"));
  msg.value = "";

  // 2. Write message to OpenAI
  await $fetch("/api/message", {
    method: "POST",
    body: {
      threadId: id,
      message: cachedMsg,
    },
  });

  // 3. Run!
  window.ws.send(
    JSON.stringify({
      threadId: id,
      firstMessage: firstMessage.value ?? null,
    }),
  );

  msg.value = "";
}

function createTempMsg(msgText: string, role: "system" | "user"): any {
  const ts = Date.now() / 1000;
  return {
    id: `msg_${ts}`,
    object: "thread.message",
    created_at: ts,
    completed_at: null,
    incomplete_at: null,
    incomplete_details: null,
    status: "completed",
    assistant_id: null,
    thread_id: "thread_u8Q8ApUiYHscxazWTDMq4xNH",
    run_id: null,
    role,
    content: [
      {
        type: "text",
        text: {
          value: msgText,
          annotations: [],
        },
      },
    ],
    attachments: [],
    metadata: {},
  };
}

function callback(payload: Payload) {
  if (payload.type === "thread.run.created") {
    // Create a temporary message for the incoming data and push it into the local messages.
    // We will update it with the stream data as it comes in.
    const temp = createTempMsg("", "system");
    localMessages.value.push(temp);
  } else if (payload.type === "thread.message.delta") {
    const last = localMessages.value.at(-1)!;
    // it always will be, but just to make TS happy...
    if (last.content[0].type === "text") {
      last.content[0].text.value += payload.text;
    }
  } else if (payload.type === "thread.run.completed") {
    submitting.value = false;
    // get a summary (maybe)
  }
}

onMounted(() => {
  registerWebSocketCallback(callback);
});

onBeforeUnmount(() => {
  removeWebSocketCallback(callback);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    nextTick(handleSubmitMessage);
  }
}
</script>

<template>
  <ul class="leading-relaxed">
    <li
      v-for="message of allMessages"
      class="flex w-full my-4"
      :class="{ 'justify-end': message.role === 'user' }"
    >
      <div
        v-if="message.content[0]?.type === 'text'"
        class="p-1 rounded px-2 whitespace-pre-wrap"
        :class="{
          'bg-gray-200 dark:bg-gray-700': message.role === 'user',
          'max-w-[50vw]': message.role === 'user',
        }"
      >
        {{ message.content[0].text.value }}
      </div>
    </li>
  </ul>

  <form
    @submit.prevent="handleSubmitMessage"
    class="flex flex-col items-end"
  >
    <UTextarea
      v-model="msg"
      autoresize
      placeholder="Chat..."
      :maxrows="20"
      @keydown="handleKeydown"
      class="w-full mb-2"
      ref="textAreaRef"
    />
    <UButton
      type="submit"
      :disabled="submitting || !msg.length"
      >Send</UButton
    >
  </form>
</template>
