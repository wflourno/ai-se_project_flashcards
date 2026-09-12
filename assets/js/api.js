const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

/**
 * Resolves a successful response as JSON or rejects with its HTTP status.
 *
 * @param {Response} res - The response returned by fetch.
 * @returns {Promise<any>} The parsed response body.
 * @throws {string} When the response is not successful.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: "01a04e3b-7bd3-77ff-973f-9b59bc752ab5"
}

/**
 * Retrieves all decks from the API.
 *
 * @returns {Promise<Array<object>>} The decks returned by the API.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck by its identifier.
 *
 * @param {string} deckId - The identifier of the deck to delete.
 * @returns {Promise<any>} The API response body.
 */
export function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE", headers }).then(processResponse);
}

/**
 * Deletes a flashcard by its identifier.
 *
 * @param {string} cardId - The identifier of the flashcard to delete.
 * @returns {Promise<any>} The API response body.
 */
export function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: "DELETE", headers }).then(processResponse);
}

/**
 * Creates a flashcard in a deck.
 *
 * @param {string} deckId - The identifier of the deck receiving the card.
 * @param {object} card - The flashcard content.
 * @param {string} card.question - The flashcard question.
 * @param {string} card.answer - The flashcard answer.
 * @returns {Promise<object>} The created flashcard returned by the API.
 */
export function addCard(deckId, { question, answer }) {
  return fetch(`${baseUrl}/cards/${deckId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

/**
 * Updates a flashcard.
 *
 * @param {string} cardId - The identifier of the flashcard to update.
 * @param {object} card - The updated flashcard content.
 * @param {string} card.question - The flashcard question.
 * @param {string} card.answer - The flashcard answer.
 * @returns {Promise<object>} The updated flashcard returned by the API.
 */
export function updateCard(cardId, { question, answer }) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ question, answer }),
  }).then(processResponse);
}

/**
 * Creates a deck through the API.
 *
 * @param {object} deck - The deck data to submit.
 * @param {string} deck.color - The deck color as a hexadecimal string.
 * @param {string} deck.name - The deck name.
 * @param {Array<object>} deck.cards - The cards belonging to the deck.
 * @returns {Promise<object>} The created deck returned by the API.
 */
export function addDeck({ color, name, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      color: color,
      name: name,
      cards: cards,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
      }
      return res.json();
    })
}

export { getDecks, headers, baseUrl };
