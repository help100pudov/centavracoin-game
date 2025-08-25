let modalIds = [];

export async function modal(id, type = null) {
  const modal = document.getElementById(id);
  const backdrop = document.getElementById("modalBackdrop");

  if (!modal) return;

  const isModalOpen = modalIds.includes(id);

  if (isModalOpen) {
    modalIds = modalIds.filter((modalId) => modalId !== id);
    modal.classList.remove("show");

    if (modalIds.length === 0) {
      backdrop.classList.remove("show");
    }
  } else {
    if (modalIds.length === 0) {
      backdrop.classList.add("show");
    }

    modalIds.push(id);
    modal.classList.add("show");
  }
}

