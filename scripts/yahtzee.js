// Made Friday, December 8th, 2023
// Game variables
var currTurn = 1
var saved = []
// Makes the player
class Player {
    constructor(id, points, data) {
        this.id = id
        this.points = points
        this.data = data
    }
}

// This will make the dice with the given number
function change_dice(dice, num) {
    // Checks if the num given is over 6
    if (num > 6) {console.error(`The given dice is over 6 | Given Num: ${num}`);return}
    var curDice = $(`#dice${dice}`)[0]
    curDice.innerHTML = "" // Removes all the content in the dice
    var clsList = []
    // Makes the dice
    if (num == 1) {clsList = ["middle mid"]} 
    else if (num == 2) { clsList = ["bottom left", "top right"]} 
    else if (num == 3) { clsList = ["bottom left", "middle mid", "top right"]}
    else if (num == 4) { clsList = ["top left", "top right", "bottom left", "bottom right"]} 
    else if (num == 5) { clsList = ["top left", "top right", "middle mid", "bottom left", "bottom right"]}
    else if (num == 6) { clsList = ["top left", "top right", "middle left", "middle right", "bottom left", "bottom right"]}

    // Appends to the dice Elm
    for (var i=0; i < clsList.length; i++) {
        var elm = document.createElement("div")
        elm.className = `dot ${clsList[i]}`
        curDice.appendChild(elm)
    }

    // Animates the Elements movement
    anime({
        targets: curDice,
        translateX: function() {
            return anime.random(0, -80);
        },
        translateY: function() {
            return anime.random(-100, -400);
        },
        easing: 'easeInOutQuad',
        duration: 100
    })
    // Allows the dice to be saved
    curDice.onclick = function() {save_die(dice)}
}
// Saves the dice 
function save_die(dice) {
    anime({
        targets: $(`#dice${dice}`)[0],
        translateX: 0,
        translateY: 0,
        easing: 'easeInOutQuad',
        duration: 100
    })
    saved.push(`dice${dice}`)
    console.log(saved)
}

// Rolls the dice 
function roll_dice() {
    for (var i=1; i < 6; i++) {
        if (saved.includes(`dice${i}`)) {continue} // If the dice is saved dont roll it
        change_dice(i, anime.random(1, 6))
    }
}

// Allows the roll btn to be interactive
$("#action").click(function() {roll_dice()})