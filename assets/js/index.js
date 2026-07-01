import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");

const pageMainEl = document.querySelector(".page__main-content");



function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
}

//Select the template and the list elements.
const deckTemplateEL = document.querySelector("#deck-template");
const deckList = document.querySelector(".decks__list");

// Create two functions: createDeckEl(item) and renderDeckEl(item).
// These functions do the same as the corresponding functions in our image gallery app:
// createDeckEl() clones the template, customizes it (for now, just add the deck title), and returns it.
// renderDeckEl() creates a deck element with createDeckEl() and prepends it to the deck list element.
function createDeckEl(item) {
    const cloneEl = deckTemplateEL.content.querySelector(".deck").cloneNode(true);

    const deckTitleEl = cloneEl.querySelector(".deck__title");
    deckTitleEl.textContent = item.name;

// For now, the only interactivity we need to deal with is the delete button. 
// When clicked, the deck should be removed from the DOM.
    const deleteBtn = cloneEl.querySelector(".deck__delete-btn");
    deleteBtn.addEventListener("click",  () => {
        cloneEl.remove();
    });

// Each deck object stores its color as a hex string. Use the appropriate 
// function to get the corresponding color name. Then use this color 
// name to create the corresponding BEM modifier
    const colorClass = `deck_color_${hexToString(item.color)}`;
    cloneEl.classList.remove("deck_color_green");
    cloneEl.classList.add(colorClass);
// The deck objects have a cards property storing their array of cards. 
// Get the length of this array and use it in a template literal to create 
// the card count text.
    const deckCount = cloneEl.querySelector(".deck__count");
    deckCount.textContent = `${item.cards.length} cards`;

    const deckLink = cloneEl.querySelector(".deck__link");
    deckLink.href = `#carousel/${item.id}`;

    return cloneEl;
}

function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("carousel/")) {
    homeSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    renderCarouselView(getDeckByID(hash.split("/")[1]));
  } else {
    renderNotFoundView();
  }

}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);

function renderDeckEl(item) {
    const deckEl = createDeckEl(item);
    deckList.prepend(deckEl);
}

decks.forEach(renderDeckEl);





