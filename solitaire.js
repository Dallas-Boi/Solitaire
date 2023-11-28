// Made Friday, November 17th, 2023
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
    "set1_top": [],
    "set2_top": [],
    "set3_top": [],
    "set4_top": [],
    "set5_top": [],
    "set6_top": [],
    "set7_top": [],
    "draw_cards":[],
    "drawed_cards":[],
    "top_card": []
}
const divChange_event = [] // This will hold all observe events for set_top
const draw_cards = document.getElementById("draw_cards")
const drawed_cards = document.getElementById("drawed_cards")
const top_card = document.getElementById("top_card")
const check_Overlap = (elm1, elm2) => (elm1.right < elm2.left || elm1.left > elm2.right || elm1.bottom < elm2.top || elm1.top > elm2.bottom)
var draw_amount = 1
var cur_drag = "null"

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

// Converts the cards Letter to a Number
function convertLetter_toNumber(letter) {
  if (letter == "A") {return 1}
  else if (letter == "J") {return 11}
  else if (letter == "Q") {return 12}
  else if (letter == "K") {return 13}
  else {return letter}
}

// Returns the card set color
function getCardSetColor(card_set) {
  if (["D", "H"].includes(card_set)) {return "red"}
  else if (["C", "S"].includes(card_set)) {return "black"}
}

// Fixex any misplacement issues
function fix_card_location(elm) {
  console.log(elm.parentNode.firstChild)
  move_card(elm.id, elm.parentNode.firstChild.id, elm.parentNode.id)
}

// When the player draw
function move_card(id, fromList, toList, clsName) {
  console.log(id, fromList, toList, clsName)
  // Moves the id in onBoard
  onBoard[fromList].splice(0, 1)
  onBoard[toList].push(id)
  // Checks if there is a vale for clsName
  if (clsName) {document.getElementById(id).className = clsName}
  // Checks to see if the card needs to fix its placement issue
  if (["set1_top","set2_top","set3_top","set4_top","set5_top","set6_top","set7_top"].includes(toList)) {
    fix_card_location(document.getElementById(id))
  }
  // Moves the card
  $(`#${id}`).appendTo(`#${toList}`); // jQuerry Moving
  // ALlows the card to be moveable
  if (fromList == "draw_cards") {
    make_element_drag(document.getElementById(id))
  }
}

// If the card was found to be overlapping a card set then it will check the card set to see if its placeable
function check_set_card(elm, set) {
  let check_data = [
    parseInt(convertLetter_toNumber(elm.id[0])),
    parseInt(convertLetter_toNumber(onBoard[set][onBoard[set].length-1][0])),
    getCardSetColor(elm.id[1]),
    getCardSetColor(onBoard[set][onBoard[set].length-1][1])
  ]
  // Fixes the issue with 10 being used as 1
  if (elm.id[1] == "0") {check_data[0] = 10}
  // Checks if the numbers are in order and if they are not the same color
  if ((check_data[0] == check_data[1]-1) && (check_data[2] !== check_data[3])) {
    move_card(elm.id, elm.parentElement.id, set)
  }
}

// Allows the Card to be moveable
function make_element_drag(elmnt) {
  // This is the setup process of the dragging element
  function dragMouseDown(e) {
    elmnt.attributes[0].ownerElement.parentElement.id
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    // If the card is in one of these sets then it will move the card to the set_top element
    console.log(elmnt.parentElement.id)
    if (["set1","set2","set3","set4","set5","set6","set7"].includes(elmnt.parentElement.id)) {
      move_card(elmnt.id, elmnt.parentElement.id, `${elmnt.parentElement.id}_top`, "card")
    }
  }
  // When the user moves their mouse
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
  // When the user lets go of the mouse down
  function closeDragElement(card_elem) {
    console.log(elmnt.attributes)
    var elm_id = elmnt.attributes[0].value
    var elm_parent = elmnt.attributes[0].ownerElement.parentElement.id
    // This will fix the card Element when first moving the card
    try {
      card_elem.toElement.firstChild.firstChild
      elmnt = card_elem.toElement.firstChild.firstChild
    } catch {}
    // Checks what set that the card is overlapping
    var i = 1
    while (i < 8) {
      let set = document.getElementById(`set${i}`)
      try {
        if (check_Overlap(elmnt.getBoundingClientRect(), set.getBoundingClientRect()) == false) {
          check_set_card(elmnt, set.id)
          break
        }
        // Places the card back to where it was originally
      } catch {}
      i++
    }
    // stop moving when mouse when button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    console.log(elm_id)
    move_card(elm_id, elm_parent, `${elm_parent.replace("_top", "")}`, "card")
    elmnt.style=""
  }
}
// Makes Cards draggable
function startDrag(e) {
  console.log(e)
  // determine event object
  if (!e) {
    var e = window.event;
  }
          if(e.preventDefault) e.preventDefault();

  // IE uses srcElement, others use target
  targ = e.target ? e.target : e.srcElement;

  if (targ.className != 'card') {return};
  // calculate event X, Y coordinates
    offsetX = e.clientX;
    offsetY = e.clientY;

  // assign default values for top and left properties
  if(!targ.style.left) { targ.style.left='0px'};
  if (!targ.style.top) { targ.style.top='0px'};

  // calculate integer values for top and left 
  // properties
  coordX = parseInt(targ.style.left);
  coordY = parseInt(targ.style.top);
  drag = true;

  // move div element
    document.onmousemove=dragDiv;
          return false;
  
}
function dragDiv(e) {
  if (!drag) {return};
  if (!e) { var e= window.event};
  // var targ=e.target?e.target:e.srcElement;
  // move div element
  targ.style.left=coordX+e.clientX-offsetX+'px';
  targ.style.top=coordY+e.clientY-offsetY+'px';
  return false;
}
function stopDrag() {
  var i=0;
  while (i < 8) {
    let set = document.getElementById(`set${i}`)
    try {
      if (check_Overlap(elmnt.getBoundingClientRect(), set.getBoundingClientRect()) == false) {
        check_set_card(elmnt, set.id)
        break
      }
      // Places the card back to where it was originally
    } catch {}
    i++
  }
  drag=false;
}
window.onload = function() {
  document.onmousedown = startDrag;
  document.onmouseup = stopDrag;
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
    for (var i=0; i < parseInt(Math.random()*10); i++) {
      shuffle(card_deck) // Ranomizes the Cards
    }
    // Places the cards on the board
    for (var set=1; set < 8; set++) {
        for (var crd=0; crd < set; crd++) { // If the card is not hidden
            if (crd+1 == set) {
              place_card(card_deck[0], `set${set}`, "card");
              continue
            } 
            place_card(card_deck[0], `set${set}`, "card card_hidden") // If the card is hidden
        }
    }

    // Places the remaining cards in the draw_container
    for (var crd=0; crd < card_deck.length; crd++) {place_card(card_deck[0], `draw_cards`, "card card_hidden")}
    // Interactables
    draw_cards.onclick = function() { // If the player clicks the draw_cards elm
        for (var i=0; i < draw_amount; i++) {
          if (top_card.childElementCount !== 0) {
            move_card(onBoard["top_card"][0], "top_card", "drawed_cards", "card")
          }
          // Moves the last top Card to the bottom cards
          move_card(onBoard["draw_cards"][0], "draw_cards", "top_card", "card") // Draws amount of cards
        }
    }

    drawed_cards.onclick = function() { // If the player clicks the drawed_cards elm
      if (draw_cards.childElementCount == 0) { // If there are no cards in the elm
          while(drawed_cards.childElementCount !== 0) {
              move_card(onBoard["drawed_cards"][0], "drawed_cards", "draw_cards", "card card_hidden") // retsets all the cards
          }
          move_card(onBoard["top_card"][0], "top_card", "draw_cards", "card card_hidden") // retsets all the cards
      }
    }
}

start_game()