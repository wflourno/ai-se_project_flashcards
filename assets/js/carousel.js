import { hexToString } from "./colors.js";

/**
 * Renders an interactive question-and-answer carousel for a deck.
 *
 * @param {object} deck - The deck whose cards should be displayed.
 * @param {string} deck.name - The deck name.
 * @param {string} deck.color - The deck color as a hexadecimal string.
 * @param {Array<object>} deck.cards - The cards to display.
 * @returns {void}
 */
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector(".carousel");
  const carouselTitleEl = carouselEl.querySelector(".carousel__title");
  const carouselCardEl = carouselEl.querySelector(".carousel__card");
  const carouselCardTextEl = carouselEl.querySelector(".carousel__card-text");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const page = document.querySelector(".page");
  page.classList.remove("page_no-mobile-bar");

  /**
   * Removes color modifier classes from the carousel card.
   *
   * @param {HTMLElement} carouselCardEl - The carousel card element.
   * @returns {void}
   */
  function removeColorClasses(carouselCardEl) {
    Array.from(carouselCardEl.classList).forEach((className) => {
      if (className.includes("_color_")) {
        carouselCardEl.classList.remove(className);
      }
    });
  }

  removeColorClasses(carouselCardEl);
  const hexToStringName = hexToString(deck.color);
  carouselCardEl.classList.add(`carousel__card_color_${hexToStringName}`);

  /**
   * Disables a carousel navigation button and applies its disabled styling.
   *
   * @param {HTMLButtonElement} buttonEl - The button to disable.
   * @returns {void}
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  /**
   * Enables a carousel navigation button and removes its disabled styling.
   *
   * @param {HTMLButtonElement} buttonEl - The button to enable.
   * @returns {void}
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /**
   * Updates navigation button states for the current card position.
   *
   * @returns {void}
   */
  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  /**
   * Updates the carousel title with the deck name and card position.
   *
   * @returns {void}
   */
  function getCarouselTitleString() {
    carouselTitleEl.textContent = `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }

  /**
   * Displays the current question or answer and refreshes carousel controls.
   *
   * @returns {void}
   */
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];
    if (showingQuestion) {
      carouselCardEl.textContent = currentCard.question;
      carouselCardEl.classList.remove("carousel__card_color_white");
    } else {
      carouselCardEl.textContent = currentCard.answer;
      carouselCardEl.classList.add("carousel__card_color_white");
    }
    getCarouselTitleString();
    updateArrows();
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      showingQuestion = true;
      currentIndex++;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      showingQuestion = true;
      currentIndex--;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  updateDisplay();
}

export { renderCarouselView };
