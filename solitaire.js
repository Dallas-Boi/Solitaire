// Made Friday, November 17th, 2023
var x = new MutationObserver(function (e) {
    //if (e[0].removedNodes) { updateMarginTop() };
});
// Observes weather a element was edited
//x.observe(document.getElementById('set2'), { childList: true });

// Main Values
const card_deck = [
    "AH","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH",
    "AS","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS",
    "AD","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD",
    "AC","2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC",
]
const onBoard = {
    "set1":[],
    "set2":[],
    "set3":[],
    "set4":[],
    "set5":[],
    "set6":[],
    "set7":[],
    "draw_cards":[],
    "drawed_cards":[]
}
const draw_container = document.getElementById("draw_container")
const drawed_cards = document.getElementById("drawed_cards")
var draw_amount = 1

// Shuffles the given array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

// When the player draw
function player_drawed(id) {
    // Moves the id in onBoard
    onBoard["draw_cards"].splice(0, 1)
    onBoard["drawed_cards"].push(id)
    document.getElementById(id).className = "card"
    // Moves the card
    $(`#${id}`).appendTo(`#drawed_cards`); // jQuerry Moving
}

// Allows the Card to be moveable
function make_element_drag(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
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
    // Ranomizes the Cards
    shuffle(card_deck)
    // Places the cards on the board
    for (var set=1; set < 8; set++) {
        for (var crd=0; crd < set; crd++) {
            if (crd+1 == set) {place_card(card_deck[0], `set${set}`, "card");continue}
            place_card(card_deck[0], `set${set}`, "card_hidden card")
        }
    }

    // Places the cards in the draw_container
    for (var crd=0; crd < card_deck.length; crd++) {
        place_card(card_deck[0], `draw_cards`, "card_hidden card")
    }
    // Interactables
    draw_container.onclick = function() {
        for (var i=0; i < draw_amount; i++) {
            player_drawed(onBoard["draw_cards"][0])
        }
    }
}

start_game()