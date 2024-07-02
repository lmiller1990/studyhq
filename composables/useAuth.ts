import { ref } from "vue";

const guestMode = ref(false);
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
