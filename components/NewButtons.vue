<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();

const emits = defineEmits<{
  (e: "newThread"): void;
  (e: "newExam"): void;
}>();
</script>

<template>
  <div class="flex justify-center">
    <UButton
      class="mr-2"
      size="xs"
      :disabled="disabled"
      :loading="disabled"
      @click="emits('newThread')"
    >
      New Chat</UButton
    >
    <UButton
      size="xs"
      :disabled="disabled"
      :loading="disabled"
      @click="emits('newThread')"
      >New Exam</UButton
    >
  </div>
</template>
