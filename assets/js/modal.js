const modal = document.querySelector("#confirmation-modal");
const cancelBtn = modal.querySelector(".modal__btn_type_cancel");
const confirmBtn = modal.querySelector(".modal__btn_type_confirm");

/**
 * Opens the confirmation modal and runs a callback after confirmation.
 *
 * @param {Function} onConfirm - Callback invoked when the user confirms.
 * @returns {void}
 */
function openModal(onConfirm) {
  modal.classList.add("modal_visible");

  /**
   * Handles confirmation and closes the modal.
   *
   * @returns {void}
   */
  function handleConfirm() {
    onConfirm();
    close();
  }

  /**
   * Closes the modal and removes its temporary event listeners.
   *
   * @returns {void}
   */
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
