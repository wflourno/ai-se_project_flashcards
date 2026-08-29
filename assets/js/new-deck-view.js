import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const newDeckForm = document.querySelector(".new-deck-view__form");
const submitBtn = newDeckForm.querySelector(".new-deck-view__submit-btn");
const errorModal = document.querySelector("#error-modal");
const modalCloseBtn = errorModal.querySelector(".modal__close");
const errorModalMessage = errorModal.querySelector(".modal__error");
const newDeckTextArea = document.querySelector(
  ".new-deck-view__textarea-input",
);

function openModal(modal) {
  modal.classList.add("modal_visible");
}

modalCloseBtn.addEventListener("click", () => {
  errorModal.classList.remove("modal_visible");
  errorModalMessage.classList.remove("modal__error");
});

//submit handler
// -------------------------------------------
newDeckForm.addEventListener("submit", function (e) {
  e.preventDefault(); // stops the page from reloading

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);

  const jsonData = parseJSON(values.json);
  if (jsonData === null) {
    showError("JSON parsing failed");
    return;
  }

  const name = validateName(jsonData.name);
  if (name === null) {
    showError("name must be a string between 2 and 80 characters");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("cards must be an array");
    return;
  }

  const color = normalizeColor(values.color);
  const jsonDeckID = `${slugify(jsonData.name)}-${Date.now()}`;
  const deck = {
    id: jsonDeckID,
    color: color,
    cards: jsonData.cards,
    name: jsonData.name,
  };
  decks.push(deck);
  window.location.hash = "deck/" + jsonDeckID;

  const colorValue = color;
  if (typeof jsonData.color === "string" && jsonData.color.toLowerCase() !== colorValue.toLowerCase()) {
    showError("Invalid card color use one of: #64D583, #91A8F9, #EE92D7, #AA8EF0, #EE955E, #F5D770");
    console.log(false);
    return false;
  }
  console.log(true);
  return true;

});

export function disableSubmitBtn() {
  submitBtn.disabled = false;
}

function showError(message) {
  openModal(errorModal);
  errorModalMessage.textContent = message;
  errorModalMessage.classList.add("modal__error");
}

// Helper functions
// -------------------------------------------
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

