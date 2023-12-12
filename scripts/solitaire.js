// Made Friday, November 17th, 2023

// Main Values
const divChange_event = [] // This will hold all observe events for set_top
const draw_cards = document.getElementById("draw_cards")
const drawed_cards = document.getElementById("drawed_cards")
const drag_cards = document.getElementById("dragging_items")
var draw_amount = 1
var cur_drag = null
var old_cont = null
var place_card = document.getElementById("set1")
var select_elm = 0
// The aniamation time line
var timeline = anime.timeline();
// Converts the cards Letter to a Number
function convertLetter_toNumber_solitaire(letter) {
	if (letter[0] == "A") { return 1 }
	else if (letter[0] == "J") { return 11 }
	else if (letter[0] == "Q") { return 12 }
	else if (letter[0] == "K") { return 13 }
	else if (letter[1] == "0") { return 10 }
	else { return letter[0] }
}

// Handles the winning animations
function win_game_screen() {
	console.log("Player Has won")
}

// When the a card moves
function move_card(elm, toElm) {
	var data_list = [elm, toElm] // List of the data
	// Checks
	if (!(elm.id)) {data_list[0] = document.getElementById(elm)} // Fixes the id arg being a object or str
	if (!(toElm.id)) {data_list[1] = document.getElementById(toElm)} // Fixes the toElm arg being a object or str
	if ((drag_cards.childElementCount >= 0) && (["gamemode", "container", "board_left", "draw_container", "", "finished-cards"].includes(elm))) {return} // This will stop players from grabbing the whole board
	// Animates the Card Moving
	$(`#${data_list[0].id}`).appendTo(`#${data_list[1].id}`)
}

// If the card was found to be overlapping a card set then it will check the card set to see if its placeable
function check_set_card(elm, set, rtn) {
	var elm_data = set.parentNode
	//console.log(elm, set, rtn)
	if (set.id.includes("set")) {elm_data = set}
	// If the player moves a card into the finished cards elements
	if (elm_data.className.includes("finish_card")) {
		if ((elm_data.childElementCount == convertLetter_toNumber_solitaire(elm.id[0])) && (elm_data.firstChild.id[1].toUpperCase() == elm.id[1])) {move_card(elm.id, elm_data.id)} // If the cards number is equaled to the amount of elements in that container
		else {move_card(elm.id, old_cont.id)} // Moves the card to its origial Placement
		return
	}
	if (!(elm_data.lastChild)) { // If there is no element then it will just move the card since it is empty
		if (rtn !== true) {move_card(elm.id, elm_data.id)}
		return true;
	}
	// A list of the checking data
	var check_data = [
		parseInt(convertLetter_toNumber_solitaire(elm.id)),
		parseInt(convertLetter_toNumber_solitaire(elm_data.lastChild.id)),
		getCardSetColor(elm.id[1]),
		getCardSetColor(elm_data.lastChild.id[1])
	]

	// Checks if the numbers are in order and if they are not the same color
	if ((check_data[0] == check_data[1] - 1) && (check_data[2] !== check_data[3])) {
		if (rtn !== true) {move_card(elm.id, elm_data.id)}
		return true;
	}
	move_card(elm.id, old_cont.id) // Moves the card to its origial Placement
	return false;
}

// Makes Cards draggable
function clicked_card(e) {
	var card = e.target
	// This will move the card back to their old location based on where they click
	if (["drawed_cards","gamemode", "container", "board_left", "draw_container", "", "draw_cards", "finished-cards", "header"].includes(card.id)) {
		if ((drag_cards.childElementCount > 0)) {
			while (drag_cards.firstChild) {
				move_card(drag_cards.firstChild, old_cont.id)
			}
		}
		return
	} 
	// IF there is a card/s in the container then it will place them
	if (drag_cards.childElementCount == 0) {
		if (card.id.includes("set")) {return} // This will stop the whole set of cards moving to the draggable items container
		if (card.className.includes("finish_icon")) {return} // This stops the player from dragging the card finishing icon
		if (card.className.includes("finish_icon")) {return} // This stops the plaer from dragging the finish_card
		// Makes a list of 
		var set_list = Array.from(e.target.parentNode.children)
		var index = set_list.indexOf(card)
		old_cont = card.parentNode
		
		// If the player clicks a hidden card it will show that card
		if (card.className.includes("card_hidden")) {
			if (!(card.parentElement.id.includes("draw_cards")) && (card.parentElement.lastChild.id.includes(card.id))) {
				card.className = card.className.replace(" card_hidden", "")
			}
			return
		} 
		// Moves all the cards into the dragging_items container
		for (var i=index; i < set_list.length; i++) {move_card(set_list[i].id, "dragging_items")}
		return
	}
	// Moves the cards to selected place
	if (drag_cards.firstChild) {
		for (var i=drag_cards.childElementCount; i > 0; i--) {check_set_card(drag_cards.firstChild, card)}
	}
}

window.onload = function () {
	document.onmousedown = clicked_card // If the play is just moving the element
}

// Starts the Game 
function start_game() {
	// Places the cards in the draw_container
	for (var crd = card_deck.length; crd > 0; crd--) { 
		// Card is added to the board
		console.log(card_deck[crd-1])
		draw_cards.appendChild(make_card(card_deck[crd-1], "card card_hidden"))
	}
	// Moves the element to the board
	for (var set=1; set < 8; set++) {
		for (var crd=0; crd < set; crd++) {
			move_card(draw_cards.children[crd], `set${set}`)
		}
		document.getElementById(`set${set}`).lastChild.className = document.getElementById(`set${set}`).lastChild.className.replace(" card_hidden", "")
	}
	// Interactables
	draw_cards.onclick = function () { // If the player clicks the draw_cards elm
		if (draw_cards.childElementCount !== 0) {
			// If there are child elements in draw_cards then move the amount of cards need to be drawed
			for (var i = 0; i < draw_amount; i++) {
				// Moves the last top Card to the bottom cards
				draw_cards.lastChild.className = "card"
				move_card(draw_cards.lastChild, "drawed_cards", "card") // Draws amount of cards
			}
			return
		}
		if (drag_cards.childElementCount == 0) { // This will not allow the player to return the cards if they have a card in hand
			// Moves all the cards from drawed_cards back to the draw_cards contaienr
			while (drawed_cards.childElementCount !== 0) {
				drawed_cards.lastChild.className += " card_hidden"
				move_card(drawed_cards.lastChild, "draw_cards") // retsets all the cards
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