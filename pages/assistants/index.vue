<script lang="ts" setup>
//
const { data } = await useFetch("/api/assistants");

console.log(data.value);
</script>

<template>
  <h1 class="text-xl">Assistants</h1>
  <!--  -->
</template>
