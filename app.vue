<script setup lang="ts">
const threadsStore = useThreadsStore();

await callOnce(threadsStore.fetch);

const links = computed(() => {
  return threadsStore.threads.map((thread) => {
    return {
      label: `${new Date(thread.created_at * 1000).toTimeString()} - id ${
        thread.id
      }`,
      icon: "i-heroicons-document-solid",
      to: `/threads/${thread.id}`,
    };
  });
});
</script>

<template>
  <div class="flex h-full">
    <div class="w-72">
      <UVerticalNavigation :links="links" />
    </div>
    <div class="w-full h-full">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>
