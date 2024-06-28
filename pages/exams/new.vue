<script setup lang="ts">
import { emitter } from "~/src/emitter";

//
const submitting = ref(false);

const msg = ref("");

async function handleCreateExam() {
  submitting.value = true;
  const result = await $fetch("/api/exams", {
    method: "POST",
    body: {
      additionalContent: msg.value,
    },
  });
  submitting.value = false;
  emitter.emit("refresh.exams");
  await navigateTo(`/exams/${result.id}`);
}
</script>

<template>
  <p class="mb-2">
    Welcome to practice exams. Enter the content below, and get a personalized
    exam. Enter a topic, or even paste in all your notes - StudyHQ will figure
    it out and make an exam to test your understanding.
  </p>
  <p class="mb-2">
    Once you complete the exam, you will receive grades and an explanation
    telling you where you went wrong.
  </p>
  <form
    @submit.prevent="handleCreateExam"
    class="flex flex-col items-end"
  >
    <UTextarea
      v-model="msg"
      autoresize
      placeholder="Exam content..."
      :maxrows="20"
      :disabled="submitting"
      class="w-full mb-2"
      ref="textAreaRef"
    />
    <UButton
      type="submit"
      :disabled="submitting"
      :loading="submitting"
      >Generate</UButton
    >
  </form>
</template>
