<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();

const emits = defineEmits<{
  (e: "newThread"): void;
  (e: "newExam"): void;
}>();

const { guestMode, setShowSignUpModal } = useAuth();

function maybeEmit(event: "newThread" | "newExam") {
  if (guestMode.value) {
    setShowSignUpModal(true)
  } else {
    if (event === "newExam") {
      emits("newExam");
    } else if (event === "newThread") {
      emits("newThread");
    }
  }
}
</script>

<template>
  <div class="flex justify-center">
    <UButton class="mr-2" size="xs" :disabled="disabled" :loading="disabled" @click="maybeEmit('newThread')">
      New Chat</UButton>
    <UButton size="xs" :disabled="disabled" :loading="disabled" @click="maybeEmit('newThread')">New Exam</UButton>
  </div>
</template>
