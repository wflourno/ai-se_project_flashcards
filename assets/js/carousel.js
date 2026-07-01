import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";

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

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

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


       function getCarouselTitleString() {
    carouselTitleEl.textContent = `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }

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
  })

  

  updateDisplay();
}

export { renderCarouselView };