<script lang="ts" setup>
import "@shikijs/markdown-it";
import "markdown-it-latex/dist/index.css";

definePageMeta({
  layout: "public",
});
//

const route = useRoute();

const { data } = await useFetch(`/api/shared/${route.params.id}`);

if (!data.value) {
  await navigateTo("/");
}
</script>

<template>
  <div class="flex justify-center mt-8">
    <a
      class="font-mono mr-4"
      href="/"
    >
      StudyHQ: AI Study & Exam Assistant
    </a>
  </div>

  <div class="flex justify-center mt-8">
    <div class="max-w-2xl">
      <p class="font-bold mb-8 text-center">
        Shared study session: {{ data?.summary }}
      </p>
      <div v-html="data?.content" />
    </div>
  </div>
</template>
