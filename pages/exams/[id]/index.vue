<script lang="ts" setup>
const route = useRoute();

const id = route.params.id;
//

const { data: exam, refresh } = await useFetch(`/api/exams/:${id}`);

const questionsAndAnswers = computed(() =>
  (exam.value?.questions ?? []).map((question, idx) => ({
    question,
    answer: exam.value?.answers[idx] || "",
  })),
);

const submitted = ref(false);

async function submitExam() {
  submitted.value = true;
  await $fetch("/api/exams/grade", {
    method: "POST",
    body: {
      id,
      questions: questionsAndAnswers.value.map(({ question, answer }) => ({
        question,
        answer: answer ?? "No answer provided.",
      })),
    },
  });
  submitted.value = false;
  await navigateTo(`/exams/${id}/results`);
}

async function resetExam() {
  submitted.value = true;
  await $fetch(`/api/exams/${id}/reset`, {
    method: "POST",
  });
  submitted.value = false;
  await refresh();
}

const { run: handleSubmitExam, loading } = useLoading(submitExam);

const { run: handleReset, loading: resetting } = useLoading(resetExam);
</script>

<template>
  <p
    class="mb-4"
    v-if="exam?.completed"
  >
    <span class="text-red-500">
      <UIcon name="i-heroicons-exclamation-circle" />
    </span>

    This exam has already been submitted.

    <NuxtLink
      class="border-bottom border-b-green-400 border-b-2"
      :to="`/exams/${id}/results`"
      >Click here</NuxtLink
    >
    to see the feedback.

    <button
      @click="handleReset"
      class="border-bottom border-b-green-400 border-b-2"
    >
      Click here
    </button>
    to take it again.

    <UIcon
      v-if="resetting"
      name="i-heroicons-arrow-path"
      class="animate-spin"
    />
  </p>

  <form @submit.prevent="handleSubmitExam">
    <div v-for="(qa, idx) of questionsAndAnswers">
      <label>
        {{ qa.question }}
        <UTextarea
          class="my-2"
          placeholder="Answer..."
          autoresize
          v-model="qa.answer"
          :disabled="Boolean(exam?.answers[idx]) || submitted"
          :rows="3"
        />
      </label>
    </div>
    <div
      v-if="!exam?.completed"
      class="flex flex-col items-end"
    >
      <UButton
        type="submit"
        :disabled="loading || submitted"
        :loading="loading"
        >{{ loading ? "Grading..." : "Submit" }}</UButton
      >
    </div>
  </form>
</template>
