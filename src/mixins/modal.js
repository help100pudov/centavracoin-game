import { ref } from 'vue';

export default function useModal() {
  const showModal = ref(null);
  const modalId = ref(null);

  const modal = (id) => {
    showModal.value = id;
    modalId.value = id;
  };

  const closeModal = () => {
    showModal.value = null;
  };

  return {
    showModal,
    modalId,
    modal,
    closeModal
  };
}
