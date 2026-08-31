const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

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

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

export function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, { method: "DELETE", headers }).then(processResponse);
}


export { getDecks, headers, baseUrl };
