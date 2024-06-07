<script setup lang="ts">
const { signOut, data, signIn } = useAuth();

const { loading: signingOut, run: handleSignOut } = useLoading(signOut);

const items = computed(() => {
  if (data.value) {
    return [
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
</template>
