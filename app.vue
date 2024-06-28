<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@media (prefers-color-scheme: dark) {
  html {
    @apply bg-slate-800;
  }
}

body {
  @apply font-sans;
}

h1 {
  @apply text-4xl md:text-5xl font-bold mt-8 mb-4;
}
h2 {
  @apply text-3xl md:text-4xl font-bold mt-6 mb-4;
}
h3 {
  @apply text-2xl md:text-3xl font-semibold mt-6 mb-4;
}
h4 {
  @apply text-xl md:text-2xl font-semibold mt-4 mb-2;
}
h5 {
  @apply text-lg md:text-xl font-medium mt-4 mb-2;
}
h6 {
  @apply text-base md:text-lg font-medium mt-2 mb-2;
}

body {
  font-family: "Inter", sans-serif;
  @apply leading-relaxed;
}
</style>
