<script setup lang="ts">
//
const submitting = ref(false);

const msg = ref("");

const exam = ref<Array<{ question: string; answer: string }>>([
  {
    question:
      "Question 1 (2 marks) What are the main functions of proteins in the human body?",
    answer: "",
  },
  {
    question:
      "Question 2 (3 marks) Describe the structure of a nucleic acid and name the two types found in cells.",
    answer: "",
  },
  // {
  //   question:
  //     "Question 3 (2 marks) Explain the process of transcription in cells.",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 4 (2 marks) How do enzymes function as catalysts in biological processes?",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 5 (3 marks) Discuss the role of messenger RNA in the synthesis of proteins.",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 6 (2 marks) What is a peptide bond and how is it formed?",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 7 (2 marks) Define and differentiate between DNA and RNA.",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 8 (3 marks) Describe the impact of mutations on the structure and function of proteins.",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 9 (2 marks) Explain how ribosomes contribute to protein synthesis.",
  //   answer: "",
  // },
  // {
  //   question:
  //     "Question 10 (2 marks) Detail the process of translation and its significance in the cell.",
  //   answer: "",
  // },
]);

async function handleCreateExam() {
  submitting.value = true;
  const result = await $fetch("/api/exams", {
    method: "POST",
    body: {
      additionalContent: msg.value,
    },
  });
  // exam.value.push(...result.map((question) => ({ question, answer: "" })));
  submitting.value = false;
  await navigateTo(`/exams/${result.id}`);
}
</script>

<template>
  <UContainer>
    <p class="leading-relaxed mb-2">
      Welcome to practice exams. Enter the content below, and get a personalized
      exam. Once you complete the exam, you'll receive a final grade and
      recommendations to improve.
    </p>
    <!--  -->
    <form
      @submit.prevent="handleCreateExam"
      class="flex flex-col items-end"
    >
      <UTextarea
        v-model="msg"
        autoresize
        placeholder="Exam content..."
        :maxrows="20"
        :disabled="submitting"
        class="w-full mb-2"
        ref="textAreaRef"
      />
      <UButton
        type="submit"
        :disabled="submitting"
        :loading="submitting"
        >Generate</UButton
      >
    </form>
  </UContainer>
</template>
