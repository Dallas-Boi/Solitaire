// Made December 4th, 2023
// This will return the card that was made

const check_Overlap = (elm1, elm2) => (elm1.right < elm2.left || elm1.left > elm2.right || elm1.bottom < elm2.top || elm1.top > elm2.bottom)
var card_deck = [
	"AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
	"AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS",
	"AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
	"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
]
var played_cards = []
// Shuffles the given array
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// When Called it will pause the code
const wait = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

// Returns the card set color
function getCardSetColor(card_set) {
	if (["D", "H"].includes(card_set)) { return "red" }
	else if (["C", "S"].includes(card_set)) { return "black" }
}

// Returns the made card
function make_card(card, clss) {
    // Sets the card Suit
	var suit;
	var cardClass = clss
	if (card[card.length-1] == "H") {suit = "♥️"}
	else if (card[card.length-1] == "S") {suit = "♠️"}
	else if (card[card.length-1] == "D") {suit = "♦️"}
	else if (card[card.length-1] == "C") {suit = "♣️"}
	if (!(clss)) {cardClass = "card"}
	// Makes the card
	var thisCard = document.createElement("div") // The card
	thisCard.id=card
	thisCard.className = cardClass
	var cardNum = document.createElement("div") // The Card Number
	cardNum.className = `card_num color_${getCardSetColor(card[card.length-1])}`
	cardNum.textContent = card[0]
	if (card[1] == "0") {cardNum.textContent = "10"}
	var cardSuitT = document.createElement("div") // The Card Suit Top
	cardSuitT.className = `card_suit_top color_${getCardSetColor(card[card.length-1])}`
	cardSuitT.textContent = suit
	var cardSuitB = document.createElement("div") // The Card Suit Bottom
	cardSuitB.className = `card_suit_bottom color_${getCardSetColor(card[card.length-1])}`
	cardSuitB.textContent = suit
    // Combines the card together
    thisCard.appendChild(cardNum)
	thisCard.appendChild(cardSuitT)
	thisCard.appendChild(cardSuitB)
    // Returns the made card
    return thisCard
}

shuffle(card_deck) // Ranomizes the Cards