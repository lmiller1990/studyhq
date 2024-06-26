import { ref } from 'vue';

function useLoading(cb) {
  const loading = ref(false);
  const run = async () => {
    loading.value = true;
    await cb();
    loading.value = false;
  };
  return {
    run,
    loading
  };
}

export { useLoading as u };
//# sourceMappingURL=useLoading-Z0fI2eoC.mjs.map
