export const useCreateThread = () =>
  useLoading(async () => {
    const t = await $fetch("/api/threads", { method: "POST" });
    await navigateTo(`/threads/${t!.id}`);
  });
