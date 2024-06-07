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
  <p class="leading-relaxed mb-2">
    Welcome to practice exams. Enter the content below, and get a personalized
    exam. Once you complete the exam, you'll receive a final grade and
    recommendations to improve.
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
