<script lang="ts" setup>
import { emitter } from "~/src/emitter";
import { useIntervalFn, useMagicKeys } from "@vueuse/core";
const { ctrl, n } = useMagicKeys();

const { data: threads, refresh: refreshThreads } =
  await useFetch("/api/threads");

declare global {
  interface Window {
    ws: WebSocket;
  }
}

const { loggedIn } = useUserSession();

if (!loggedIn.value) {
  await navigateTo("/");
}

const { data: user, refresh: refreshUserData } = await useFetch("/api/user");

useIntervalFn(() => {
  refreshUserData();
  console.log("Counting...");
}, 5000);

onMounted(() => {
  emitter.on("refresh.exams", refreshExams);
  emitter.on("refresh.threads", refreshThreads);
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
//
</script>

<template>
  <UContainer class="pt-4">
    <div class="flex justify-between items-center w-full mb-4 mx-2">
      <NuxtLink
        class="font-mono mr-4"
        to="/"
      >
        StudyHQ
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
          <slot />
        </UContainer>
      </div>
    </div>
  </UContainer>
</template>
