<script lang="ts" setup>
const route = useRoute();

const id = route.params.id;
//

const { data } = await useFetch<string[]>(`/api/exams/${id}`);

const exam = computed(() =>
  (data.value ?? []).map((question) => ({ question, answer: "" })),
);

const submitting = ref(false);
console.log(data);

async function handleSubmitExam() {
  //
}
</script>

<template>
  <UContainer>
    <form
      class="leading-relaxed"
      @submit.prevent="handleSubmitExam"
    >
      <div v-for="qa of exam">
        <label>
          {{ qa.question }}
          <UTextarea
            class="my-2"
            placeholder="Answer..."
            v-model="qa.answer"
            :rows="3"
            :maxrows="10"
          />
        </label>
      </div>
      <div class="flex flex-col items-end">
        <UButton
          type="submit"
          :disabled="submitting"
          :loading="submitting"
          >Submit</UButton
        >
      </div>
    </form>
  </UContainer>
</template>
