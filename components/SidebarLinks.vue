<script setup lang="ts">
type NavLink = {
  label: string;
  icon: string;
  to: string;
};

defineProps<{
  disabled: boolean;
  examLinks: NavLink[];
  chatLinks: NavLink[];
}>();

const emits = defineEmits<{
  (e: "newThread"): void;
  (e: "newExam"): void;
}>();
</script>

<template>
  <div class="w-72">
    <div class="flex justify-between items-center">
      <h4 class="font-bold m-2">Chats</h4>
      <UButton
        size="xs"
        :disabled="disabled"
        :loading="disabled"
        @click="emits('newThread')"
      >
        New Chat</UButton
      >
    </div>
    <UVerticalNavigation
      class="max-h-[400px] overflow-scroll"
      :links="chatLinks"
    />
    <div
      v-if="!chatLinks.length"
      class="flex justify-center"
    >
      <p class="text-sm text-gray-500">No chats.</p>
    </div>

    <UDivider class="my-4" />

    <div class="flex justify-between items-center">
      <h4 class="font-bold m-2">Exams</h4>
      <UButton
        size="xs"
        :disabled="disabled"
        :loading="disabled"
        @click="emits('newExam')"
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
</template>
