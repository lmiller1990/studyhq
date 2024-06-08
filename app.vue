<script setup lang="ts">
import { createWebSocket } from "~/composables/createWebSocket";
import {
  useInterval,
  useIntervalFn,
  useMagicKeys,
  whenever,
} from "@vueuse/core";
import { emitter } from "~/src/emitter";

const { data: threads, refresh } = useFetch("/api/threads");

declare global {
  interface Window {
    ws: WebSocket;
  }
}

const { data: user, refresh: refreshUserData } = useFetch("/api/user");

useIntervalFn(() => {
  refreshUserData();
  console.log("Counting...");
}, 5000);

onMounted(() => {
  emitter.on("refresh.exams", refreshExams);

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

const { data: exams, refresh: refreshExams } = await useFetch("/api/exams");

const examLinks = computed(() =>
  (exams.value ?? []).map((exam) => {
    return {
      label: exam.summary,
      icon: "i-heroicons-document-text",
      to: `/exams/${exam.id}`,
    };
  }),
);

const { run: handleNewThread, loading: creatingNewThread } = useLoading(
  async () => {
    const t = await $fetch("/api/threads", { method: "POST" });
    await navigateTo(`/threads/${t!.id}`);
  },
);

async function handleNewExam() {
  await navigateTo(`/exams/new`);
}

const { signIn, getSession, data } = useAuth();

const { ctrl, n } = useMagicKeys();

watchEffect(() => {
  if (ctrl.value && n.value) {
    handleNewThread();
  }
});

const credit = computed(() => {
  if (!user.value?.credit) {
    return;
  }
  const usd = user?.value?.credit / 100;
  return `$${usd.toFixed(2)}`;
});
</script>

<template>
  <UContainer class="pt-4">
    <div class="flex justify-between items-center w-full mb-4 mx-2">
      <NuxtLink
        class="font-mono mr-4"
        to="/"
      >
        StudyHQ.ai
      </NuxtLink>
      <div class="flex items-center">
        <span
          v-if="credit"
          class="mr-4"
        >
          {{ credit }}
        </span>
        <SettingsMenu />
      </div>
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
          >
            New Chat</UButton
          >
        </div>
        <UVerticalNavigation
          class="max-h-[400px] overflow-scroll"
          :links="links"
        />
        <div
          v-if="!links.length"
          class="flex justify-center"
        >
          <p class="text-sm text-gray-500">No chats.</p>
        </div>

        <UDivider class="my-4" />

        <div class="flex justify-between items-center">
          <h2 class="font-bold m-2">Exams</h2>
          <UButton
            size="xs"
            @click="handleNewExam"
            >New Exam</UButton
          >
        </div>
        <UVerticalNavigation
          class="max-h-[338px] overflow-scroll"
          :links="examLinks"
        />
        <div
          v-if="!examLinks.length"
          class="flex justify-center"
        >
          <p class="text-sm text-gray-500">No exams.</p>
        </div>
      </div>

      <div class="w-full h-full mb-4">
        <UContainer>
          <NuxtPage />
        </UContainer>
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
