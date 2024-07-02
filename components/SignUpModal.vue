<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: boolean): void
}>()
</script>

<template>
  <UModal :modelValue="modelValue" @update:modelValue="val => emits('update:modelValue', val)">
    <div class="p-8 text-center">

      <p class="my-4 mb-10">Please sign up to continue using StudyHQ.</p>
      <div class="flex justify-center mt-8 mb-4">

        <SignInGoogle class="mr-2" />

        <SignInGithub />
      </div>
    </div>
  </UModal>
</template>
