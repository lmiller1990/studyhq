import { ref } from "vue";

const guestMode = ref(false);

export function useAuth() {
  const setGuest = () => (guestMode.value = true);
  return {
    guestMode,
    setGuest,
  };
}
