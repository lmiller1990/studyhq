<script setup lang="ts">
function handleGoogleAuth() {
  signIn("google");
}

const { signIn } = useAuth();
</script>

<template>
  <p class="flex justify-center">
    <UButton @click="handleGoogleAuth"
      ><GoogleIcon class="h-4 w-4" /> Continue with Google</UButton
    >
  </p>
</template>
