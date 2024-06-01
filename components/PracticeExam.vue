<script setup lang="ts">
const value = ref("");

async function handleSubmit() {
  const startChat = await $fetch("/api/tutor", {
    method: "POST",
    body: {
      message: value.value,
    },
  });

  console.log(startChat);
  //
}

async function handleCreateThread() {
  await $fetch("/api/threads", {
    method: "POST",
  });
}

async function handleShowThreads() {
  const threads = await $fetch("/api/threads", {
    method: "GET",
  });

  console.log(threads);
  //
}
</script>

<template>
  <!--  -->
  <form @submit.prevent="handleSubmit">
    <UTextarea
      v-model="value"
      placeholder="Start chatting to AI..."
    />
    <UButton type="submit">Start!</UButton>
  </form>

  <UButton @click="handleCreateThread">New Conversation</UButton>
  <UButton @click="handleShowThreads">List conversations</UButton>
</template>
