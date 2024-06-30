<script setup lang="ts">
definePageMeta({
  layout: "public",
});

const { user, session, loggedIn } = useUserSession();
const { setGuest } = useAuth();

if (loggedIn.value) {
  await navigateTo("/app");
}

const examples = [
  { color: "violet", subject: "Psychology" },
  { color: "sky", subject: "Python Programming" },
  { color: "teal", subject: "Biomedical Science" },
  { color: "fuchsia", subject: "Business" },
] as const;

async function handleExample(example: (typeof examples)[number]) {
  setGuest();
  const res = await $fetch("/api/guest", {
    method: "POST",
    body: {
      subject: example.subject,
    },
  });
  await navigateTo(`/exams/${res.id}`);
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
            Sign in below to start studying and taking practice exams for free!
          </p>
          <div class="mb-8 grid grid-cols-2 gap-x-1">
            <SignInGoogle />
            <SignInGithub />
          </div>
          <div class="flex w-full items-center">
            <hr
              class="my-12 h-0.5 border-t-0 bg-neutral-100 w-full dark:bg-white/10"
            />
            <div class="mx-4 w-full">or take an example quiz</div>
            <hr
              class="my-12 h-0.5 border-t-0 bg-neutral-100 w-full dark:bg-white/10"
            />
          </div>
          <p class="mb-8">
            <UButton
              v-for="example of examples"
              class="mx-1"
              :color="example.color"
              @click="() => handleExample(example)"
              >{{ example.subject }}
            </UButton>
          </p>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style></style>
