<template>
  <UTable
    :columns="columns"
    :rows="data ?? []"
  >
    <template #credit-data="{ row }">
      {{ dollars(row.credit) }}
    </template>
  </UTable>
</template>

<script setup lang="ts">
const { data } = useFetch("/api/users");
const { user } = useUserSession();

if (
  !(
    user?.email !== "lachlan@vuejs-course.com" ||
    user?.email !== "lachlan.miller.1990@outlook.com" ||
    user?.email !== "lachlan@lachlan-miller.me"
  )
) {
  await navigateTo("/app");
}

const dollars = (num: number) => {
  const usd = num / 100;
  return `$${usd.toFixed(2)}`;
};

const columns = [
  {
    key: "pk",
    label: "Email",
  },
  {
    key: "credit",
    label: "Credit",
  },
];
</script>
