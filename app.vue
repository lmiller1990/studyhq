<script setup lang="ts">
import { createWebSocket } from "~/composables/createWebSocket";

const { data: threads, refresh } = useFetch("/api/threads");

declare global {
  interface Window {
    ws: WebSocket;
  }
}

onMounted(() => {
  const ws = createWebSocket({
    name: "top-level",
  });

  if (!ws) {
    return;
  }

  window.ws = ws;

  registerWebSocketCallback((payload: Payload) => {
    if (payload.type === "summary.completed") {
      refresh();
    }
  });
});

onUnmounted(() => {
  console.log("Unmount");
});

const links = computed(() => {
  return (threads.value ?? [])?.map((thread) => {
    return {
      label:
        thread.summary ??
        `${new Date(thread.created_at * 1000).toTimeString()} - id ${
          thread.id
        }`,
      icon: "i-heroicons-document-solid",
      to: `/threads/${thread.id}`,
    };
  });
});

const { data: exams } = await useFetch("/api/exams");

const examLinks = computed(() =>
  (exams.value ?? []).map((exam) => {
    return {
      label: `${new Date(exam.created).toTimeString()} - id ${exam.id}`,
      icon: "i-heroicons-document-text",
      to: `/exams/${exam.id}`,
    };
  }),
);

const { run: handleNewThread, loading: creatingNewThread } = useLoading(
  async () => {
    const t = await $fetch("/api/threads", { method: "POST" });
    await navigateTo(`/threads/${t.id}`);
  },
);

async function handleNewExam() {
  await navigateTo(`/exams/new`);
}
</script>

<template>
  <UContainer class="pt-4">
    <div class="flex justify-end w-full">
      <button @click="handleNewThread">
        <UIcon
          name="i-heroicons-pencil-square"
          class="text-xl"
        />
      </button>
    </div>

    <div class="flex h-full">
      <div class="w-72">
        <div class="flex justify-between items-center">
          <h2 class="font-bold m-2">Chats</h2>
          <UButton
            size="xs"
            :disabled="creatingNewThread"
            :loading="creatingNewThread"
            @click="handleNewThread"
            >New Chat</UButton
          >
        </div>
        <UVerticalNavigation :links="links" />

        <UDivider class="my-4" />

        <div class="flex justify-between items-center">
          <h2 class="font-bold m-2">Exams</h2>
          <UButton
            size="xs"
            @click="handleNewExam"
            >New Exam</UButton
          >
        </div>
        <UVerticalNavigation :links="examLinks" />
      </div>

      <div class="w-full h-full">
        <NuxtPage />
      </div>
    </div>
  </UContainer>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>
