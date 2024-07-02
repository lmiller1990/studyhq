<script setup lang="ts">
import NewButtons from "~/components/NewButtons.vue";

const { user, loggedIn } = useUserSession();

async function handleNewExam() {
  await navigateTo(`/exams/new`);
}

const { run, loading } = useCreateThread();
</script>

<template>
  <UContainer class="grid grid-rows-3 gap-y-6 h-full items-center mt-24">
    <h2 class="text-xl flex justify-center whitespace-pre">
      Welcome to <span class="font-mono">StudyHQ</span>.
    </h2>
    <div v-if="loggedIn" class="flex justify-center">
      Welcome back, {{ user?.name ?? "guest" }}.
    </div>

    <NewButtons class="md:hidden" @new-exam="handleNewExam" @new-thread="run" :disabled="loading" />
  </UContainer>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>
