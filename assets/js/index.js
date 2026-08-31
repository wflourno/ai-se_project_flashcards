import { decks, getDeckByID, fetchedDecks, removeDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";
import { renderCarouselView } from "./carousel.js";
import { openModal } from "./modal.js";
import { getDecks, deleteDeck, headers, baseUrl } from "./api.js";


// cannot import renderDeckView from deck-view.js
// or it will get rid of the cards from the home view
// and deck view


const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckViewSection = document.querySelector("#new-deck-view");

let currentDeck = null;

const page = document.querySelector(".page");
const mainEl = document.querySelector(".page__main-content")
const deckTemplateEL = document.querySelector("#deck-template");
const flashcardTemplateEL = document.querySelector("#flashcard-template");
const deckList = document.querySelector("#home .gallery__list");
const deckViewList = document.querySelector("#deck-view .gallery__list");

const practiceBtn = document.querySelector(".gallery__practice-btn");
practiceBtn.addEventListener("click", () => {
  window.location.hash = `carousel/${currentDeck._id}`;
});

const newCardBtn = document.querySelector("#home .gallery__new-card-btn");
newCardBtn.addEventListener("click", () => {
  window.location.hash = `new-deck/`;
});

function showView(currentSection, display) {
  const allSections = [homeSection, carouselSection, notFoundSection, deckViewSection, newDeckViewSection];
  allSections.forEach((view) => {
    view.style.display = "none";
  });
  currentSection.style.display = display;
}

function renderHomeView() {
  deckViewList.innerHTML = "";
  showView(homeSection, "block");
  page.classList.remove('page_no-mobile-bar');

  getDecks()
    .then((decks) => {
      // Push the fetched decks onto the array
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(() => {
      showError("Error fetching decks");
    });
}

function renderNotFoundView() {
  showView(notFoundSection, "flex");
  page.classList.remove('page_no-mobile-bar');
}

function renderNewDeckView() {
  showView(newDeckViewSection, "flex");
  page.classList.remove('page_no-mobile-bar');
}

// Create two functions: createDeckEl(item) and renderDeckEl(item).
// These functions do the same as the corresponding functions in our image gallery app:
// createDeckEl() clones the template, customizes it (for now, just add the deck title), and returns it.
// renderDeckEl() creates a deck element with createDeckEl() and prepends it to the deck list element.
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

      })
      .catch(() => {
        showError("Error deleting deck(s)");
      })
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

function createFlashcardEl(item, deckColor) {
  const cloneEl = flashcardTemplateEL.content.querySelector(".card").cloneNode(true);
  const cardTitleEl = cloneEl.querySelector(".card__title");
  const deleteBtn = cloneEl.querySelector(".card__btn_type_delete");
  const flipBtn = cloneEl.querySelector(".card__btn_type_flip");
  const cardRowEl = cloneEl.querySelector(".card__row");

  let showingQuestion = true;
  cardTitleEl.textContent = item.question;

  deleteBtn.addEventListener("click", () => {
    openModal(() => cloneEl.remove());
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

function renderDeckViewAgain(deck) {
  currentDeck = deck;
  showView(deckViewSection, "block");

  const deckViewTitle = deckViewSection.querySelector(".gallery__title");
  deckViewTitle.textContent = deck.name;

  deckViewList.innerHTML = "";
  deck.cards.forEach((card) => {
    deckViewList.append(createFlashcardEl(card, deck.color));
  });
}

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
    showView(newDeckViewSection, "flex");
    renderNewDeckView();
  } else {
    renderNotFoundView();
  }
}

// window.addEventListener("DOMContentLoaded", router);
document.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      router();
    })
});
window.addEventListener("hashchange", router);

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckList.prepend(deckEl);
}






