<script lang="ts" setup>
import { emitter } from "~/src/emitter";
import { useIntervalFn, useMagicKeys } from "@vueuse/core";
import SidebarLinks from "~/components/SidebarLinks.vue";
import { useAuth } from "~/composables/useAuth";
import SignUpModal from "~/components/SignUpModal.vue";

const { ctrl, n } = useMagicKeys();
const { clear, loggedIn } = useUserSession();
const { guestMode, setShowSignUpModal, showSignUpModal } = useAuth();

if (!loggedIn.value && !guestMode.value) {
  await navigateTo("/");
}

const { data: threads, refresh: refreshThreads } =
  await useFetch("/api/threads");

declare global {
  interface Window {
    ws: WebSocket;
  }
}

const isOpen = ref(false);

const { loading: signingOut, run: handleSignOut } = useLoading(async () => {
  await clear();
  await navigateTo("/");
});

const { data: user, refresh: refreshUserData } = await useFetch("/api/user");

// useIntervalFn(() => {
//   refreshUserData();
//   console.log("Counting...");
// }, 10000);

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
      click: () => (isOpen.value = false),
    };
  });
});

const { data: exams, refresh: refreshExams } = await useFetch("/api/exams");

const examLinks = computed(() =>
  (exams.value ?? []).map((exam) => {
    return {
      label: exam.summary ?? "",
      icon: "i-heroicons-document-text",
      to: `/exams/${exam.id}`,
      click: () => (isOpen.value = false),
    };
  }),
);

const { run: _handleNewThread, loading: creatingNewThread } = useCreateThread();

async function handleNewThread() {
  if (guestMode.value) {
    setShowSignUpModal(true);
  } else {
    await _handleNewThread();
    isOpen.value = false;
  }
}

async function handleNewExam() {
  if (guestMode.value) {
    setShowSignUpModal(true);
  } else {
    isOpen.value = false;
    await navigateTo(`/exams/new`);
  }
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
    <SignUpModal v-model="showSignUpModal" />
    <div class="flex justify-between items-center w-full mb-4 mx-2">
      <NuxtLink
        title="LATEST_HASH"
        class="font-mono mr-4"
        to="/"
      >
        StudyHQ
      </NuxtLink>
      <div class="flex items-center">
        <div class="hidden md:block">
          <SettingsMenu />
        </div>

        <div class="md:hidden">
          <UButton
            color="white"
            trailing-icon="i-heroicons-bars-3"
            @click="() => (isOpen = true)"
          />
          <USlideover v-model="isOpen">
            <div class="overflow-scroll">
              <div class="flex items-center justify-between mt-4 mx-2">
                <UButton
                  @click="handleSignOut"
                  variant="link"
                  size="xs"
                  :disabled="signingOut"
                  >Sign out</UButton
                >
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-x-mark-20-solid"
                  square
                  padded
                  @click="isOpen = false"
                />
              </div>

              <UCard
                class="flex flex-col flex-1"
                :ui="{
                  body: { base: 'flex-1' },
                  ring: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
              >
                <template #header>
                  <div class="flex justify-between items-center">
                    <h2>Chats</h2>
                    <UButton
                      size="xs"
                      @click="handleNewThread"
                      :disabled="creatingNewThread"
                      >New Chat</UButton
                    >
                  </div>
                </template>
                <div>
                  <UVerticalNavigation :links="links" />
                </div>
              </UCard>

              <UCard
                class="flex flex-col flex-1"
                :ui="{
                  body: { base: 'flex-1' },
                  ring: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
              >
                <template #header>
                  <div class="flex justify-between items-center">
                    <h2>Exams</h2>
                    <UButton
                      size="xs"
                      @click="handleNewExam"
                      :disabled="creatingNewThread"
                      >New Exam</UButton
                    >
                  </div>
                </template>
                <div>
                  <UVerticalNavigation :links="examLinks" />
                </div>
              </UCard>
            </div>
          </USlideover>
        </div>
      </div>
    </div>

    <div class="flex h-full">
      <SidebarLinks
        class="hidden md:block"
        :chat-links="links"
        :exam-links="examLinks"
        :disabled="creatingNewThread"
        @new-exam="handleNewExam"
        @new-thread="handleNewThread"
      />

      <div class="w-full h-full mb-4">
        <UContainer>
          <slot />
        </UContainer>
      </div>
    </div>
  </UContainer>
</template>
