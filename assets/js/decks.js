

export let fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the fetched decks.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve.
 * @returns {object|undefined} The deck object if found, otherwise undefined.
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes the deck matching the given ID from {@link fetchedDecks} in place.
 *
 * @param {string} deckId - The unique identifier of the deck to remove
 */
export function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { getDeckByID };
