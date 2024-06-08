<script setup lang="ts">
const { data } = useAuth();
</script>

<template>
  <UContainer class="grid grid-rows-3 gap-y-6 h-full items-center mt-24">
    <h2 class="text-xl flex justify-center whitespace-pre">
      Welcome to <span class="font-mono">StudyHQ</span>.
    </h2>
    <div
      v-if="data?.user"
      class="flex justify-center"
    >
      Welcome back, {{ data.user.name }}.
    </div>
  </UContainer>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>
