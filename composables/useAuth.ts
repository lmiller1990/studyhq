import { ref } from "vue";

const guestMode = ref(true);
const showSignUpModal = ref(false);

export function useAuth() {
  const setGuest = () => (guestMode.value = true);
  return {
    setShowSignUpModal: (val: boolean) => {
      showSignUpModal.value = val;
    },
    showSignUpModal,
    guestMode,
    setGuest,
  };
}
