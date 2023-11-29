// Made Friday, November 17th, 2023
// Main Values
const card_deck = [
	"AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
	"AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS",
	"AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
	"AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
]
const onBoard = {
	"set1": [],
	"set2": [],
	"set3": [],
	"set4": [],
	"set5": [],
	"set6": [],
	"set7": [],
	"set1_top": [],
	"set2_top": [],
	"set3_top": [],
	"set4_top": [],
	"set5_top": [],
	"set6_top": [],
	"set7_top": [],
	"draw_cards": [],
	"drawed_cards": [],
	"top_card": []
}
const divChange_event = [] // This will hold all observe events for set_top
const draw_cards = document.getElementById("draw_cards")
const drawed_cards = document.getElementById("drawed_cards")
const drag_cards = document.getElementById("dragging_items")
const check_Overlap = (elm1, elm2) => (elm1.right < elm2.left || elm1.left > elm2.right || elm1.bottom < elm2.top || elm1.top > elm2.bottom)
var draw_amount = 1
var cur_drag = null
var old_cont = null

// Shuffles the given array
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// Converts the cards Letter to a Number
function convertLetter_toNumber(letter) {
	if (letter == "A") { return 1 }
	else if (letter == "J") { return 11 }
	else if (letter == "Q") { return 12 }
	else if (letter == "K") { return 13 }
	else { return letter }
}

// Returns the card set color
function getCardSetColor(card_set) {
	if (["D", "H"].includes(card_set)) { return "red" }
	else if (["C", "S"].includes(card_set)) { return "black" }
}

// When the a card moves
function move_card(id, toElm, clsName) {
	var data_list = [id, toElm, clsName] // List of the data
	// Checks
	if (data_list[0].id) {data_list[0] = id.id} // Fixes the id arg being a object or str
	if (data_list[1].id) {data_list[1] = toElm.id} // Fixes the toElm arg being a object or str
	console.log(data_list)
	if (data_list[2]) { document.getElementById(id).className = data_list[2] } // Checks if there is a vale for clsName
	// Moves the card
	$(`#${data_list[0]}`).appendTo(`#${data_list[1]}`); 
}

// If the card was found to be overlapping a card set then it will check the card set to see if its placeable
function check_set_card(elm, set, rtn) {
	var elm_data = set.parentNode
	if (set.id.includes("set")) {elm_data = set}
	console.log(elm, set, rtn)
	console.log(elm_data)
	console.log(elm_data.lastChild)
	if (!(elm_data.lastChild)) { // If there is no element then it will just move the card since it is empty
		if (rtn !== true) {move_card(elm.id, elm_data.id)}
		return true;
	}
	// A list of the checking data
	var check_data = [
		parseInt(convertLetter_toNumber(elm.id[0])),
		parseInt(convertLetter_toNumber(elm_data.lastChild.id[0])),
		getCardSetColor(elm.id[1]),
		getCardSetColor(elm_data.lastChild.id[1])
	]
	
	// Fixes the issue with 10 being used as 1
	if (elm.id[1] == 0) { check_data[0] = 10 }
	console.log(check_data)
	// Checks if the numbers are in order and if they are not the same color
	if ((check_data[0] == check_data[1] - 1) && (check_data[2] !== check_data[3])) {
		console.log("overlapping")
		if (rtn !== true) {move_card(elm.id, elm_data.id)}
		return true;
	}
	move_card(elm.id, old_cont.id)
	return false;
}

// Makes Cards draggable
function clicked_card(e) {
	console.log("Clicked")
	var card = e.target
	// If the parentElement id should not be clicked
	if (["gamemode", "container", "board_left", "draw_container", "finished-cards", "", "draw_cards"].includes(card.parentNode.id)) {return}
	if ((drag_cards.childElementCount > 0) && (["drawed_cards"].includes(card.parentNode.id))) {return} // This will stop players from adding cards to the drawed_cards
	// IF there is a card/s in the container then it will place them
	console.log(card.parentNode.id)
	if (drag_cards.childElementCount == 0) {
		if (card.id.includes("set")) {return}
		// If the player clicks a hidden card
		if (card.className.includes("card_hidden")) {
			if (!(card.parentElement.id.includes("draw_cards"))) {card.className = card.className.replace(" card_hidden", "")}
			return
		} 
		// Makes a list of 
		var set_list = Array.from(e.target.parentNode.children)
		var index = set_list.indexOf(card)
		console.log(index)
		old_cont = card.parentNode
		console.log(old_cont)
		// Adds the card to the container
		for (var i=index; i < set_list.length; i++) {move_card(set_list[i].id, "dragging_items")}
		return
	}
	// Returns the element to its old position
	while (drag_cards.firstChild) {
		check_set_card(drag_cards.firstChild, card)
	}
}

window.onload = function () {
	document.onmousedown = clicked_card
}

// Places the Card
function place_card(card, set, clss) {
	// Places the card
	var cardSet = document.getElementById(set)
	var newCard = document.createElement("img")
	newCard.id = card
	newCard.src = `cards/${card}.jpg`
	newCard.className = clss
	cardSet.appendChild(newCard)
	onBoard[set].push(card)
	card_deck.splice(0, 1) // Removes the first card in the deck
}

// Starts the Game 
function start_game() {
	// Randomizes the amount of times to randomize the cards
	console.log(parseInt(Math.random() * 10) + 1)
	shuffle(card_deck) // Ranomizes the Cards
	// Places the cards on the board
	for (var set = 1; set < 8; set++) {
		for (var crd = 0; crd < set; crd++) { // If the card is not hidden
			if (crd + 1 == set) {
				place_card(card_deck[0], `set${set}`, "card");
				continue
			}
			place_card(card_deck[0], `set${set}`, "card card_hidden") // If the card is hidden
		}
	}

	// Places the remaining cards in the draw_container
	for (var crd = 0; crd < card_deck.length; crd++) { place_card(card_deck[0], `draw_cards`, "card card_hidden") }
	// Interactables
	draw_cards.onclick = function () { // If the player clicks the draw_cards elm
		for (var i = 0; i < draw_amount; i++) {
			// Moves the last top Card to the bottom cards
			move_card(draw_cards.lastChild.id, "drawed_cards", "card") // Draws amount of cards
		}
	}

	drawed_cards.onclick = function () { // If the player clicks the drawed_cards elm
		if (draw_cards.childElementCount == 0) { // If there are no cards in the elm
			while (drawed_cards.childElementCount !== 0) {
				move_card(drawed_cards.lastChild.id, "draw_cards", "card card_hidden") // retsets all the cards
			}
		}
	}

	// Allows the dragging_items box to follow the mouse at all times
	$(document).on('mousemove', function(e){
		$('#dragging_items').css({
		left:  e.pageX-44,
		top:   e.pageY,
		position: "absolute"
		});
	});
}

start_game()

