import { hexToString } from "./colors.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const page = document.querySelector(".page");

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

  function createCard(cardData) {
    const cloneEl = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardTitleEl = cloneEl.querySelector(".card__title");
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

    const colorClass = `card_color_${hexToString(deck.color)}`;
    cloneEl.classList.remove("card_color_green");
    cardRowEl.classList.remove("card_color_green");
    cloneEl.classList.add(colorClass);
    cardRowEl.classList.add(colorClass);

    return cloneEl;
  }

  function renderCard(cardData) {
    const cardEl = createCard(cardData);
    cardsList.append(cardEl);
  }

  deck.cards.forEach(renderCard);
}

export { renderDeckView };
