<script setup lang="ts">
const route = useRoute();

const id = route.params.id;
//

const { data: exam } = await useFetch(`/api/exams/:${id}`);

const questions = computed(() => exam.value?.questions ?? []);
const answers = computed(() => exam.value?.answers ?? []);

if (answers.value.length !== exam.value?.questions.length) {
  throw new Error(`Questions and Answers not same length; something is wrong!`);
}
</script>

<template>
  <UContainer>
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

    <UDivider class="my-2" />

    <h2 class="font-bold">Feedback</h2>
    <div>
      {{ exam?.feedback }}
    </div>
  </UContainer>
</template>
