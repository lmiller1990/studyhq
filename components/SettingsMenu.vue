<script setup lang="ts">
const { signOut, data, signIn } = useAuth();

const { loading: signingOut, run: handleSignOut } = useLoading(signOut);

const isOpen = ref(false);

const link = `https://buy.stripe.com/test_6oE16faCzeD20EM6oo?prefilled_email=${encodeURIComponent(data.value?.user?.email!)}`;

function handleShowPurchaseModal() {
  isOpen.value = true;
  //
}

async function handleBuy() {
  const data = await $fetch("/api/stripe", {
    body: JSON.stringify({ amount: 5 }),
    method: "POST",
  });

  document.location = data as string;
  //
}

const items = computed(() => {
  if (data.value) {
    return [
      [
        {
          label: "Purchase Credits",
          click: handleShowPurchaseModal,
        },
      ],
      [
        {
          label: "Sign Out",
          click: handleSignOut,
          disabled: signingOut.value,
        },
      ],
    ];
  }

  return [
    [
      {
        label: "Sign up to start studying!",
        click: () => signIn("google"),
      },
    ],
  ];
});
</script>

<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="white"
      trailing-icon="i-heroicons-bars-3"
    />
  </UDropdown>

  <UModal v-model="isOpen">
    <UCard
      class="p-2"
      :ui="{
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <h2>Purchase Study Credits</h2>
      </template>

      <p>
        <span class="font-mono">StudyHQ.ai</span>
        is not a "pay as you go" service. You pay for study credits, and use
        them as you message and generate exams.
      </p>

      <!-- <a :href="link">Buy</a> -->
      <UButton @click="handleBuy">Get $5</UButton>

      <template #footer> </template>
    </UCard>
  </UModal>
</template>
