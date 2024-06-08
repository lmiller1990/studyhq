<script setup lang="ts">
definePageMeta({
  layout: "public",
});

const { data } = useAuth();

if (data.value?.user) {
  await navigateTo("/app");
}
</script>

<template>
  <div class="mx-4">
    <NuxtLayout>
      <div class="flex items-center justify-center h-screen text-center">
        <div class="flex flex-col items-center justify-center">
          <h1 class="font-mono text-7xl mb-12">StudyHQ</h1>
          <p class="text-3xl mb-8">
            AI powered revision, exam generator and grader.
          </p>
          <p class="mb-8">
            Sign in below to start studying and taking practice exams and get
            $5.00 free credits!
          </p>
          <div class="mb-8">
            <SignInGoogle />
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style></style>
