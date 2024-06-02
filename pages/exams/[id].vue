<script lang="ts" setup>
const route = useRoute();

const id = route.params.id;
//

const { data: exam } = await useFetch(`/api/exams/:${id}`);

const questionsAndAnswers = computed(() =>
  (exam.value?.questions ?? []).map((question) => ({ question, answer: "" })),
);

const submitted = ref(false);

const examResult = ref("");

async function submitExam() {
  submitted.value = true;
  const result = await $fetch("/api/exams/grade", {
    method: "POST",
    body: {
      id,
      questions: questionsAndAnswers.value,
    },
  });
  examResult.value = result;
}

const { run: handleSubmitExam, loading } = useLoading(submitExam);
</script>

<template>
  <UContainer>
    <form
      class="leading-relaxed"
      @submit.prevent="handleSubmitExam"
    >
      <div v-for="qa of questionsAndAnswers">
        <label>
          {{ qa.question }}
          <UTextarea
            class="my-2"
            placeholder="Answer..."
            v-model="qa.answer"
            :disabled="submitted"
            :rows="3"
            :maxrows="10"
          />
        </label>
      </div>
      <div class="flex flex-col items-end">
        <UButton
          type="submit"
          :disabled="loading || submitted"
          :loading="loading"
          >{{ loading ? "Grading..." : "Submit" }}</UButton
        >
      </div>
    </form>

    <div class="whitespace-pre-wrap">
      {{ examResult }}
    </div>
  </UContainer>
</template>
