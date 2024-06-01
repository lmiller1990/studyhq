<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch("/api/threads", {
  method: "GET",
});

const links = computed(() => {
  return (
    data.value?.map((thread) => {
      return {
        label: new Date(thread.created_at * 1000).toTimeString(),
        openai_id: thread.openai_id,
        icon: "i-heroicons-document-solid",
        to: `/threads/${thread.id}`,
      };
    }) ?? []
  );
});
</script>

<template>
  <UVerticalNavigation :links="links" />
</template>
