const modal = document.querySelector("#confirmation-modal");
const cancelBtn = modal.querySelector(".modal__btn_type_cancel");
const confirmBtn = modal.querySelector(".modal__btn_type_confirm");

function openModal(onConfirm) {
  modal.classList.add("modal_visible");

  function handleConfirm() {
    onConfirm();
    close();
  }

  function close() {
    // remove modal_visible, then remove both listeners
    modal.classList.remove("modal_visible");
    confirmBtn.removeEventListener("click", handleConfirm);
    cancelBtn.removeEventListener("click", close);
  }

  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", close);
}





export { openModal };
