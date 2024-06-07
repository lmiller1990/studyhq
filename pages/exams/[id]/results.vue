<script setup lang="ts">
const route = useRoute();

const id = route.params.id;
//

const { data: exam } = await useFetch(`/api/exams/:${id}`);

const questions = computed(() => exam.value?.questions ?? []);
const answers = computed(() => exam.value?.answers ?? []);

if (answers.value.length !== questions.value.length) {
  console.log(questions.value);
  console.log(answers.value);
  throw new Error(
    `Questions length (${questions.value?.length}) and answers (${answers.value.length}) not same length; something is wrong!`,
  );
}
const items = [
  {
    label: "Show questions & answers",
    icon: "i-heroicons-information-circle",
    defaultOpen: false,
    slot: "exam",
  },
];
</script>

<template>
  <UAccordion :items="items">
    <template #exam>
      <div class="leading-relaxed">
        <div v-for="(_, idx) in questions">
          <label>
            {{ questions[idx] }}
            <UTextarea
              autoresize
              class="my-2"
              v-model="answers[idx]"
              :disabled="true"
            />
          </label>
        </div>
      </div>
    </template>
  </UAccordion>

  <section class="mt-4">
    <h2 class="font-bold">Feedback</h2>
    <div class="whitespace-pre-wrap">
      {{ exam?.feedback }}
    </div>
  </section>
</template>
