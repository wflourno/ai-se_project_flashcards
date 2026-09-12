import { hexToString } from "./colors.js";
import { deleteCard } from "./api.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const page = document.querySelector(".page");

/**
 * Renders all cards in a deck detail view.
 *
 * @param {object} deck - The deck to render.
 * @param {string} deck.name - The deck name.
 * @param {string} deck.color - The deck color as a hexadecimal string.
 * @param {Array<object>} deck.cards - The cards to render.
 * @returns {void}
 */
function renderDeckView(deck) {

  const deckViewTitle = deckViewSection.querySelector(".gallery__title");

  const cardsList = deckViewSection.querySelector(".gallery__list");

  const cardTemplate = document.querySelector("#flashcard-template");

  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  page.classList.remove("page_no-mobile-bar");

  deckViewTitle.textContent = deck.name;
  cardsList.innerHTML = "";

  /**
   * Creates a flashcard element with question and flip behavior.
   *
   * @param {object} cardData - The card content.
   * @param {string} cardData.question - The question text.
   * @param {string} cardData.answer - The answer text.
   * @returns {HTMLElement} The populated flashcard element.
   */
  function createCard(cardData) {
    const cloneEl = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardTitleEl = cloneEl.querySelector(".card__title");
    const deleteBtn = cloneEl.querySelector(".card__btn_type_delete");
    const flipBtn = cloneEl.querySelector(".card__btn_type_flip");
    const cardRowEl = cloneEl.querySelector(".card__row");

    let showingQuestion = true;
    cardTitleEl.textContent = cardData.question;

    flipBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      cardTitleEl.textContent = showingQuestion
        ? cardData.question
        : cardData.answer;
    });

    deleteBtn.addEventListener("click", () => {
      deleteCard(cardData._id)
        .then(() => cloneEl.remove())
        .catch(() => console.error("Error deleting flashcard"));
    });

    const colorClass = `card_color_${hexToString(deck.color)}`;
    cloneEl.classList.remove("card_color_green");
    cardRowEl.classList.remove("card_color_green");
    cloneEl.classList.add(colorClass);
    cardRowEl.classList.add(colorClass);

    return cloneEl;
  }

  /**
   * Creates and appends one card to the deck card list.
   *
   * @param {object} cardData - The card content to render.
   * @returns {void}
   */
  function renderCard(cardData) {
    const cardEl = createCard(cardData);
    cardsList.append(cardEl);
  }

  deck.cards.forEach(renderCard);
}

export { renderDeckView };
