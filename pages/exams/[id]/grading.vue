<script setup lang="ts">
const route = useRoute();

const id = route.params.id;
//

const { data: exam } = await useFetch(`/api/exams/:${id}`);

const questionsAndAnswers = computed(() =>
  (exam.value?.questions ?? []).map((question) => ({ question, answer: "" })),
);
</script>

<template>
  <UContainer>
    <div class="flex flex-col justify-center items-center mt-48">
      <p>
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin"
        />
        Grading in progress ...
      </p>
    </div>
  </UContainer>
</template>
