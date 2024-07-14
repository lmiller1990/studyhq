<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { Message } from "openai/resources/beta/threads/messages";
import { emitter } from "~/src/emitter";
import markdownit from "markdown-it";
import markdownItLatex from "markdown-it-latex";
import Shiki from "@shikijs/markdown-it";
import "markdown-it-latex/dist/index.css";

const route = useRoute();
const id = route.params.id;

const { data, refresh } = await useFetch(`/api/threads/${route.params.id}`);
const md = markdownit();

async function tryApplyPlugin(name: string, p: () => any) {
  try {
    console.log(`Applying plugin ${name}`);
    md.use(await p());
  } catch (e) {
    console.error(`Error creating markdown renderer for plugin ${name}`, e);
  }
}

tryApplyPlugin("latex", () => markdownItLatex);
await tryApplyPlugin(
  "shiki",
  async () =>
    await Shiki({
      fallbackLanguage: "sh",
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
    }),
);

const msg = ref("");
const textAreaRef = ref<{ textarea: HTMLTextAreaElement }>();
const attachmentModel = ref("");

onMounted(() => {
  textAreaRef.value?.textarea.focus();
});

const localMessages = ref<SerializeObject<Message>[]>([]);
const attachments = ref<string[]>([]);
const uploadingAttachments = ref(false);

async function handleUpload(e: Event) {
  uploadingAttachments.value = true;
  const files = (e.target as any).files as File[];
  const form = new FormData();
  let i = 0;
  for (const file of files) {
    form.append(i.toString(), file);
    i++;
  }

  const { fileIds } = await $fetch("/api/attachments", {
    method: "POST",
    body: form,
  });

  attachments.value = fileIds;
  uploadingAttachments.value = false;
}

const allMessages = computed(() => {
  // const msg = "```math\n\frac{1}{2} \\pi r^2\n```";
  return [
    createTempMsg(
      "Hi 👋 I am here to help you learn about whatever you want. Over to you!",
      "system",
    ),
  ]
    .concat(data.value?.messages ?? [])
    .concat(localMessages.value);
});

const submitting = ref(false);

const firstUserMessage = computed(() => {
  const f = allMessages.value[1] as Message | undefined;
  if (f && f.content[0].type === "text") {
    return f.content[0].text.value;
  }
});

watchEffect(async () => {
  if (firstUserMessage.value && !data.value?.summary) {
    // no summary has been generated, make one using the user's first message.
    await $fetch("/api/summary", {
      method: "POST",
      body: {
        message: firstUserMessage.value,
        threadId: route.params.id,
      },
    });
    emitter.emit("refresh.threads");
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

  // New temp message for the system message
  const temp = createTempMsg("", "system");
  localMessages.value.push(temp);
  const last = localMessages.value.at(-1)!;

  // 2. Write message to OpenAI
  const response = await window.fetch("/api/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      threadId: id,
      message: cachedMsg,
      files: attachments.value,
    }),
  });
  const reader = response?.body?.getReader()!;

  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        var text = new TextDecoder().decode(value);

        // it always will be, but just to make TS happy...
        if (last.content[0].type === "text") {
          last.content[0].text.value += text;
        }

        if (done) {
          submitting.value = false;
          break;
        }

        controller.enqueue(value);
      }

      controller.close();
      reader.releaseLock();
      msg.value = "";
      attachmentModel.value = "";
    },
  });
}

function toHtml(msg: string) {
  return md.render(msg);
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

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    nextTick(handleSubmitMessage);
  }
}
</script>

<template>
  <ul>
    <li
      v-for="message of allMessages"
      class="flex w-full my-4"
      :class="{ 'justify-end': message.role === 'user' }"
    >
      <div
        v-if="message.content[0]?.type === 'text'"
        class="p-1 rounded px-2"
        :class="{
          'bg-gray-200 dark:bg-gray-700': message.role === 'user',
          'dark:bg-gray-800': message.role !== 'user',
          'max-w-[50vw]': message.role === 'user',
        }"
      >
        <span
          class="msg"
          v-html="toHtml(message.content[0].text.value)"
        />
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
    <div class="flex">
      <UInput
        type="file"
        :disabled="submitting"
        class="mr-2"
        multiple
        v-model="attachmentModel"
        accept="image/png, image/jpeg, image/jpg"
        @input="handleUpload"
      />
      <UButton
        type="submit"
        :disabled="submitting || !msg.length || uploadingAttachments"
        >Send</UButton
      >
    </div>
  </form>
</template>

<style>
.msg > p:not(:first-of-type) {
  padding-top: 10px;
  /* Adjust the value as needed */
}

.msg > h1,
h2,
h3,
h4,
h5,
h6 {
  padding-top: 10px;
  /* Adjust the value as needed */
}

.msg > ul {
  list-style: disc;
  list-style-position: inherit;
  margin-left: 20px;
}

.msg > ol {
  list-style: disc;
  list-style-position: inherit;
  margin-left: 20px;
}

.shiki {
  @apply border-gray-100 border p-2 mt-2 rounded overflow-scroll whitespace-pre-wrap;
}

li {
  @apply my-1;
}
</style>
