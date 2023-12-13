// Made Friday, December 8th, 2023
// Game variables
var currTurn = 1
var rolls = 0
var diceVal = []
var dieList = [] // All the dice classes
// Makes the player
class Player {
    constructor(id, points, data) {
        this.id = id
        this.points = points
        this.data = data
    }
}
// Makes the dice
class Dice {

    constructor(dice) {
        this.dice = dice
        this.saved = false
        this.dice_num = 1
        this.x = 0
        this.y = 0
        this.rotate = 0
    }
    // Get 
    get_dice() { return this.dice }
    get_dice_num() {return this.dice_num}
    isSaved() {return this.saved}
    // saves the dice
    save_die() {
        this.saved = true
        anime({
            targets: this.dice,
            translateX: 0,
            translateY: 0,
            rotate: 0,
            easing: 'easeInOutQuad',
            duration: 100
        })
    }
    // Unsaves the dice
    unsave_die() {
        this.saved = false
        // Brings the die back to the its original position
        anime({
            targets: this.dice,
            translateX: this.x,
            translateY: this.y,
            rotate: this.rotate,
            easing: 'easeInOutQuad',
            duration: 100
        })
    }

    // When the player rolls the dice
    roll_dice(num) {
        this.dice_num = num
        // Checks if the num given is over 6
        if (num > 6) {console.error(`The given dice is over 6 | Given Num: ${num}`);return}
        this.dice.innerHTML = "" // Removes all the content in the dicew
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
            this.dice.appendChild(elm)
        }
        // Sets X and Y
        this.x = anime.random(0, -80)
        this.y = anime.random(-100, -400)
        this.rotate = anime.random(0, 360)
        // Animates the Elements movement
        anime({
            targets: this.dice,
            translateX: this.x,
            translateY: this.y,
            rotate: this.rotate,
            easing: 'easeInOutQuad',
            duration: 100
        })
        // Allows the dice to be saved
        $(this.dice)[0].onclick = function(e) {saveDice(e.target)}
   }
}

// Saves the dice
function saveDice(elm) {
    var die = dieList[parseInt(elm.id[4])-1]
    // If the dice is saved
    if (die.isSaved()) {die.unsave_die()}
    else if (!die.isSaved()) {die.save_die()}
}

function update_diceVal() {
    for (var i=0; i <dieList.length; i++) {
        diceVal[i] = dieList[i].get_dice_num()
    }
    diceVal.sort(function(a, b){return a - b})
}

// Rolls the dice 
function roll_dice() {
    for (var i=0; i < dieList.length; i++) {
        if (dieList[i].isSaved() == true) {continue} // If the dice is saved dont roll it
        dieList[i].roll_dice(anime.random(1, 6))
    }
}

// Returns the number of times the given value is in the list
function get_all_item(value) {
    var seen = 0
    // Goes through the list
    for (var i=0; i < diceVal.length; i++) {
        if (diceVal[i] == value) {seen++}// Checks for the given value
    }
    return seen
}

// Returns if it is in order
function inNumOrder(values) {
    console.log(values, "before")
    values.sort(function(a, b){return a - b})
    console.log(values)
    for (var j=0; j < values.length; j++) {
        if (!(diceVal[j]+1 == diceVal[j+1])) {return false}
    }
    return true
}

// Returns the total of the list of dice values
function getTotal() {
    var sum=0
    diceVal.forEach(num => {
        sum += num;
    })
    return sum
}

// When called it will update the paper inputs ( A lot of Checks )
function update_inputs() {
    var items = ["ones", "twos", "threes", "fours", "fives", "sixes"]
    var otherItm = [items, "three_kind", "four_kind", "house", "sm_straight", "lar_straight", "chance", "yahtzee"]
    update_diceVal()
    
    // Goes through the items list and does checks || For single nums
    for (var i=1; i < items.length+1; i++) {
        // Resets all innerHTMLs
        for (var j=0; j < otherItm.length; j++) {
            if ($(`#p${currTurn}_${otherItm[j]}`).children().length > 0) {$(`#p${currTurn}_${otherItm[j]}`).html(``)}
        }
        // Updaates all HTMLs
        if (diceVal.includes(i)) {
            // This will update the single digit inputs
            var times = get_all_item(i)
            $(`#p${currTurn}_${items[i-1]}`).html(`<div>${times*i}</div>`)
            // This will do check on the unique
            // This checks for Three of a kind
            if (times >= 3) { $(`#p${currTurn}_three_kind`).html(`<div>${getTotal()}</div>`)}
            // This checks for Four of a kind
            if (times >= 4) { $(`#p${currTurn}_four_kind`).html(`<div>${getTotal()}</div>`)}
            // This checks for YAHTZEE
            if (times >= 5) { $(`#p${currTurn}_yahtzee`).html(`<div>${50}</div>`)}
        }
        // This checks for Full House
        var arr_dieVal = Array.from(new Set(diceVal))
        if (arr_dieVal.length == 2) { // If the arr_dieVal is only 2 values
            console.log(arr_dieVal)
            console.log(get_all_item(arr_dieVal[0]), get_all_item(arr_dieVal[1]))
            // It checks if the items have at least 2 or 3 times
            if ((get_all_item(arr_dieVal[0]) == 3) || (get_all_item(arr_dieVal[0]) == 2)) {
                if ((get_all_item(arr_dieVal[1]) == 3) || (get_all_item(arr_dieVal[1]) == 2)) {
                    $(`#p${currTurn}_house`).html(`<div>${25}</div>`)
                }
            }   
        }
        // This checks for small straight
        if (arr_dieVal.length == 4) {
            inNumOrder(arr_dieVal)
            $(`#p${currTurn}_sm_straight`).html(`<div>${30}</div>`)
        }
        // This checks for large straight
        if (arr_dieVal.length == 5) {$(`#p${currTurn}_lar_straight`).html(`<div>${40}</div>`)}
    }
}

// Makes the dice list
for(var i=0; i < 5; i++) {dieList.push(new Dice($(`#dice${i+1}`)[0]))}

// Allows the roll btn to be interactive
$("#action").click(function() {
    roll_dice()
    update_inputs()
    rolls++
    console.log(rolls)
    // If the player has rolled 3 times
    if (rolls == 3) { $("#action").prop("disabled", true);}
})