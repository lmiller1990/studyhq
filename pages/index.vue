<script lang="ts" setup>
const { signIn, data } = useAuth();

function handleGoogleAuth() {
  signIn("google");
}
</script>

<template>
  <UContainer class="grid grid-rows-3 gap-y-6 h-full items-center mt-24">
    <h2 class="text-xl flex justify-center whitespace-pre">
      Welcome to <span class="font-mono">StudyMATE.ai</span>.
    </h2>
    <div
      v-if="data?.user"
      class="flex justify-center"
    >
      Welcome back, {{ data.user.name }}.
    </div>

    <template v-else>
      <p class="flex justify-center">
        Sign in below to start studying and taking practice exams.
      </p>
      <p class="flex justify-center">
        <UButton @click="handleGoogleAuth"
          ><GoogleIcon class="h-4 w-4" /> Continue with Google</UButton
        >
      </p>
    </template>
  </UContainer>
</template>
