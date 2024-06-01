export function useLoading<T>(cb: () => Promise<T>) {
  const loading = ref(false);

  const run = async () => {
    loading.value = true;
    await cb();
    loading.value = false;
  };

  return {
    run,
    loading,
  };
}
