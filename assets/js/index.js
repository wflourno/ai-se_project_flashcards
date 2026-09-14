import { getDeckByID, fetchedDecks, removeDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import {
  disableSubmitBtn,
  showError,
  writePlaceholderJSON,
} from "./new-deck-view.js";
import { renderCarouselView } from "./carousel.js";
import { openModal } from "./modal.js";
import {
  addCard,
  updateCard,
  deleteCard,
  getDecks,
  deleteDeck,
  headers,
  baseUrl,
} from "./api.js";

// cannot import renderDeckView from deck-view.js
// or it will get rid of the cards from the home view
// and deck view

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckViewSection = document.querySelector("#new-deck-view");
const aboutSection = document.querySelector("#about");

let currentDeck = null;

const page = document.querySelector(".page");
const mainEl = document.querySelector(".page__main-content");
const deckTemplateEL = document.querySelector("#deck-template");
const flashcardTemplateEL = document.querySelector("#flashcard-template");
const deckList = document.querySelector("#home .gallery__list");
const deckViewList = document.querySelector("#deck-view .gallery__list");
const newFlashcardTemplate = document.querySelector("#new-flashcard-template");
const newFlashcardBtn = document.querySelector(".gallery__new-flashcard-btn");

const practiceBtn = document.querySelector(".gallery__practice-btn");
practiceBtn.addEventListener("click", () => {
  window.location.hash = `carousel/${currentDeck._id}`;
});

const newCardBtn = document.querySelector("#home .gallery__new-card-btn");
newCardBtn.addEventListener("click", () => {
  window.location.hash = `new-deck/`;
});

function openFlashcardEditor(cardData = null, cardElement = null) {
  if (document.querySelector(".new-flashcard") && !cardElement) {
    return null;
  }
  const newFlashcardForm = newFlashcardTemplate.content
    .querySelector(".new-flashcard")
    .cloneNode(true);
  const questionInput = newFlashcardForm.querySelector(
    ".new-flashcard__input_type_question",
  );
  const answerInput = newFlashcardForm.querySelector(
    ".new-flashcard__input_type_answer",
  );
  const flipBtn = newFlashcardForm.querySelector(".new-flashcard__flip-btn");
  const submitBtn = newFlashcardForm.querySelector(
    ".new-flashcard__submit-btn",
  );
  let showingQuestion = true;
  newFlashcardForm.style.backgroundColor = currentDeck.color;

  if (cardData) {
    questionInput.value = cardData.question;
    answerInput.value = cardData.answer;
  }

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    questionInput.hidden = !showingQuestion;
    answerInput.hidden = showingQuestion;
    (showingQuestion ? questionInput : answerInput).focus();
  });

  newFlashcardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitBtn.disabled = true;

    const cardValues = {
      question: questionInput.value.trim(),
      answer: answerInput.value.trim(),
    };
    if (!cardValues.question || !cardValues.answer) {
      submitBtn.disabled = false;
      showError("Both sides of the flashcard are required");
      return;
    }
    const saveRequest = cardData
      ? updateCard(cardData._id, cardValues)
      : addCard(currentDeck._id, cardValues);

    saveRequest
      .then((card) => {
        if (cardData) {
          const cardIndex = currentDeck.cards.findIndex(
            (currentCard) => currentCard._id === cardData._id,
          );
          currentDeck.cards[cardIndex] = card;
          newFlashcardForm.replaceWith(
            createFlashcardEl(card, currentDeck.color),
          );
        } else {
          currentDeck.cards.push(card);
          deckViewList.append(createFlashcardEl(card, currentDeck.color));
          newFlashcardForm.remove();
        }
      })
      .catch(() => {
        submitBtn.disabled = false;
        showError(
          cardData ? "Error updating flashcard" : "Error creating flashcard",
        );
      });
  });

  if (cardElement) {
    cardElement.replaceWith(newFlashcardForm);
  } else {
    deckViewSection.querySelector(".wrapping-row").prepend(newFlashcardForm);
  }
  questionInput.focus();
}

newFlashcardBtn.addEventListener("click", () => openFlashcardEditor());

/**
 * Shows one application section and hides all other sections.
 *
 * @param {HTMLElement} currentSection - The section to display.
 * @param {string} display - The CSS display value to apply.
 * @returns {void}
 */
function showView(currentSection, display) {
  const allSections = [
    homeSection,
    carouselSection,
    notFoundSection,
    deckViewSection,
    newDeckViewSection,
    aboutSection,
  ];
  allSections.forEach((view) => {
    view.style.display = "none";
  });
  currentSection.style.display = display;
}

/**
 * Loads decks and renders the home view.
 *
 * @returns {void}
 */
function renderHomeView() {
  deckViewList.innerHTML = "";
  showView(homeSection, "block");
  page.classList.remove("page_no-mobile-bar");
  deckList.innerHTML = "";
  fetchedDecks.forEach(renderDeckEl);
}

/**
 * Displays the not-found view.
 *
 * @returns {void}
 */
function renderNotFoundView() {
  showView(notFoundSection, "flex");
  page.classList.remove("page_no-mobile-bar");
}

/**
 * Displays the new-deck form view.
 *
 * @returns {void}
 */
function renderNewDeckView() {
  writePlaceholderJSON();
  showView(newDeckViewSection, "flex");
  page.classList.remove("page_no-mobile-bar");
}

/**
 * Displays the about view.
 *
 * @returns {void}
 */
function renderAboutView() {
  showView(aboutSection, "flex");
  page.classList.remove("page_no-mobile-bar");
  writePlaceholderJSON();
}

// Create two functions: createDeckEl(item) and renderDeckEl(item).
// These functions do the same as the corresponding functions in our image gallery app:
// createDeckEl() clones the template, customizes it (for now, just add the deck title), and returns it.
// renderDeckEl() creates a deck element with createDeckEl() and prepends it to the deck list element.
/**
 * Creates a deck list card with delete and navigation behavior.
 *
 * @param {object} item - The deck data to render.
 * @returns {HTMLElement} The populated deck card element.
 */
function createDeckEl(item) {
  const cloneEl = deckTemplateEL.content.querySelector(".card").cloneNode(true);
  const deckTitleEl = cloneEl.querySelector(".card__title");
  const deckCount = cloneEl.querySelector(".card__count");
  const deleteBtn = cloneEl.querySelector(".card__btn_type_delete");
  const deckLink = cloneEl.querySelector(".card__link");
  const cardRowEl = cloneEl.querySelector(".card__row");

  deleteBtn.addEventListener("click", () => {
    deleteDeck(item._id)
      .then(() => {
        removeDeckByID(item._id);
        cloneEl.remove();
        console.log("Deck has been deleted");
      })
      .catch(() => {
        showError("Error deleting deck(s)");
      });
  });

  deckTitleEl.textContent = item.name;
  deckCount.textContent = `${item.cards.length} cards`;
  deckLink.href = `#deck/${item._id}`;

  const colorClass = `card_color_${hexToString(item.color)}`;
  cloneEl.classList.remove("card_color_green");
  cardRowEl.classList.remove("card_color_green");
  cloneEl.classList.add(colorClass);
  cardRowEl.classList.add(colorClass);

  return cloneEl;
}

/**
 * Creates a flashcard element with delete and flip behavior.
 *
 * @param {object} item - The card data to render.
 * @param {string} deckColor - The parent deck color as a hexadecimal string.
 * @returns {HTMLElement} The populated flashcard element.
 */
function createFlashcardEl(item, deckColor) {
  const cloneEl = flashcardTemplateEL.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cloneEl.querySelector(".card__title");
  const editBtn = cloneEl.querySelector(".card__btn_type_edit");
  const deleteBtn = cloneEl.querySelector(".card__btn_type_delete");
  const flipBtn = cloneEl.querySelector(".card__btn_type_flip");
  const cardRowEl = cloneEl.querySelector(".card__row");

  let showingQuestion = true;
  cardTitleEl.textContent = item.question;

  deleteBtn.addEventListener("click", () => {
    openModal(() => {
      deleteCard(item._id)
        .then(() => {
          currentDeck.cards = currentDeck.cards.filter(
            (card) => card._id !== item._id,
          );
          cloneEl.remove();
        })
        .catch(() => {
          showError("Error deleting flashcard");
        });
    });
  });

  editBtn.addEventListener("click", () => {
    openFlashcardEditor(item, cloneEl);
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    cardTitleEl.textContent = showingQuestion ? item.question : item.answer;
  });

  const colorClass = `card_color_${hexToString(deckColor)}`;
  cloneEl.classList.remove("card_color_green");
  cardRowEl.classList.remove("card_color_green");
  cloneEl.classList.add(colorClass);
  cardRowEl.classList.add(colorClass);

  return cloneEl;
}

/**
 * Displays a selected deck and renders all of its cards.
 *
 * @param {object} deck - The deck to display.
 * @returns {void}
 */
function renderDeckViewAgain(deck) {
  console.log("it made it..", deck);
  currentDeck = deck;
  showView(deckViewSection, "block");

  const deckViewTitle = deckViewSection.querySelector(".gallery__title");
  deckViewTitle.textContent = deck.name;

  deckViewList.innerHTML = "";
  deck.cards.forEach((card) => {
    deckViewList.append(createFlashcardEl(card, deck.color));
  });
}

/**
 * Routes the current URL hash to the corresponding application view.
 *
 * @returns {void}
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("deck/")) {
    const deck = getDeckByID(hash.split("/")[1]);

    if (deck) {
      renderDeckViewAgain(deck);
    } else {
      renderNotFoundView();
    }
  } else if (hash.startsWith("carousel/")) {
    showView(carouselSection, "flex");

    mainEl.classList.add("page__main-content_location_carousel");

    const deckID = hash.split("/")[1];
    renderCarouselView(getDeckByID(deckID));
  } else if (hash.startsWith("new-deck/")) {
    disableSubmitBtn();
    renderNewDeckView();
  } else if (hash === "about") {
    renderAboutView();
  } else {
    renderNotFoundView();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      console.log("Response received");
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      router();
    });
});
window.addEventListener("hashchange", router);

/**
 * Creates and prepends a deck card to the home view.
 *
 * @param {object} item - The deck data to render.
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckList.prepend(deckEl);
}
