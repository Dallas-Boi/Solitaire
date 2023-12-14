// Made Friday, December 8th, 2023
// Game variables
var currTurn = 0
var rolls = 0
var diceVal = []
var dieList = [] // All the dice classes
var players = {"player1":{"total":0, "all_total": 0, "total_yahtzee": 0}, "player2":{"total":0, "all_total": 0, "total_yahtzee": 0}}
// All paper items
var items = ["ones", "twos", "threes", "fours", "fives", "sixes"]
var otherItm = [...items, "three_kind", "four_kind", "house", "sm_straight", "lar_straight", "chance", "yahtzee"]
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
    // Moves the dice
    move_die(x, y, rotate) {
        anime({
            targets: this.dice,
            translateX: x,
            translateY: y,
            rotate: rotate,
            easing: 'easeInOutQuad',
            duration: 100
        })
    }
    // saves the dice
    save_die() {
        this.saved = true
        this.move_die(0, 0, 0)
    }
    // Unsaves the dice
    unsave_die() {
        this.saved = false
        // Brings the die back to the its original position
        this.move_die(this.x, this.y, this.rotate)
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
        this.move_die(this.x, this.y, this.rotate)
        // Allows the dice to be saved
        $(this.dice)[0].onclick = function(e) {saveDice(e.target)}
    }
}

// Changes the current player turn
function change_turn() {
    $("#action").prop("disabled", false) // Removes the last click event for the action btn
    $("#action").unbind("click") // This will fix the issue when clicking the btn it will press it twice
    $(".input").unbind("click") // Removes the click action for all of the current players paper items
    $(".temp").remove() // Removes all .temp class elements
    $(".input").removeClass("input") // Removes input from all of the current players paper items
    // Resets all the dice to their original positions
    for (var i=0; i < dieList.length; i++) {
        dieList[i].move_die(0,0,0) // Moves the die to default position
        dieList[i].saved = false // Unsaves the die
    }
    // turns
    currTurn++
    if (currTurn >= 3) {currTurn = 1} // If the currTurn pass the amount of players
    
    // Changes the .current for the current player
    $(".current").removeClass("current") // Removes the old .current class
    $(`#p${currTurn}_name`).addClass("current")
    // Adds the input class for the current turn
    for (var i=0; i < otherItm.length; i++) {
        if ($(`#p${currTurn}_${otherItm[i]}`).text().length !== 0) {continue}
        $(`#p${currTurn}_${otherItm[i]}`).addClass("input")
    }
    // Allows the input class to be clicked
    $(".input").click(function(e) {add_paperVal(e.target, currTurn)})
    // Allows the roll btn to be interactive
    $("#action").html("Roll")
    $("#action").click(function() {
        roll_dice()
        update_inputs()
        rolls++
        // If the player has rolled 3 times
        if (rolls == 3) {$("#action").prop("disabled", true)}
    })
}

// When called it will add the value to the input
function add_paperVal(elm, ply) {
    
    if ($(elm).children().length == 0) {return}
    $(elm).html(elm.textContent) // Sets the content to be the number
    players[`player${ply}`]["all_total"] += parseInt(elm.textContent) // Adds to this players all_total
    // Checks if the clicked elm is part of the first 6
    if (items.includes(elm.id.replace(`p${ply}_`, ""))) {players[`player${ply}`]["total"] += parseInt(elm.textContent)}
    change_turn() // Changes the turn
    rolls = 0 // Resets rolls
    // This will check the main 6 inputs if they are 
    var list6 = 0
    for (var i=0; i < items.length; i++) {
        if ($(`#p${ply}_${items[i]}`).text().length !== 0) {list6++}
    }
    // If the first 6 inputs have values then this will check for bonus points
    if (list6 == 6) {
        var bonus = 0
        $(`#p${ply}_total`).html(players[`player${ply}`]["total"])
        // If the player has over 63 points in the first 6 inputs then they get a bonus
        if (players[`player${ply}`]["total"] >= 63) {bonus = 35}
        $(`#p${ply}_bonus`).html(bonus) // Sets the players bonus text
        players[`player${ply}`]["all_total"] += bonus // Adds the bonus to the all_total value
    }

    // Checks if all inputs are entered
    var all_inp = 0 + list6
    for (var i=6; i < otherItm.length; i++) {
        if ($(`#p${ply}_${items[i]}`).text().length !== 0) {all_inp++}
    }
    // If all inputs are enter then it will end the game and add all the items
    if ((all_inp == 13) && (ply == 2)) {
        otherItm.push("bonus", 6)
        for (var i=6; i < otherItm.length; i++) {
            if ($(`#p${ply}_${items[i]}`).text().length !== 0) {all_inp++}
        }
    }
}

// Saves the dice
function saveDice(elm) {
    var die = dieList[parseInt(elm.id[4])-1]
    // If the dice is saved
    if (die.isSaved()) {die.unsave_die()}
    else if (!die.isSaved()) {die.save_die()}
}

// Updates the diceVal with the current dice values
function update_diceVal() {
    for (var i=0; i <dieList.length; i++) {diceVal[i] = dieList[i].get_dice_num()}
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
        if (diceVal[i] == value) {seen++} // Checks for the given value
    }
    return seen
}

// Returns if it is in order
function inNumOrder(values, rtn) {
    // rtn: The value that the vairable "times" needs to be
    console.log(values)
    var times = 0
    for (var j=0; j < values.length-1; j++) {
        //console.log(values[j]+1, "!==", values[j+1], values[j]+1 !== values[j+1])
        if (values[j]+1 == values[j+1]) {times++} // If the next value is one greater than the current value
        if (times >= rtn) {return true}
    }
    return false
}

// Returns the total of the list of dice values
function getTotal() {
    var sum=0
    diceVal.forEach(num => {sum += num;})
    return sum
}

// When called this will set all of the open inputs to the given value
function setOpen_inputs(value) {
    for (var i=0; i < otherItm.length; i++) {
        if ($(`#p${currTurn}_${otherItm[i]}`).text().length == 0) {$(`#p${currTurn}_${otherItm[i]}`).html(`<div class="temp">${value}</div>`)}
    }
}

// When called it will update the paper inputs ( A lot of Checks )
function update_inputs() {
    var hasInput = false
    update_diceVal()
    $(".temp").remove() // Removes the old .temp elements
    // Goes through the items list and does checks || For single nums
    for (var i=1; i < items.length+1; i++) {
        // Checks if i is a number in the dice values
        if (diceVal.includes(i)) {
            // This will update the single digit inputs
            var times = get_all_item(i)
            if ($(`#p${currTurn}_${items[i-1]}`).html().length == 0) {$(`#p${currTurn}_${items[i-1]}`).html(`<div class="temp">${times*i}</div>`)}
            // This will do check on the unique
            // This checks for Three of a kind
            if (times >= 3) { 
                if ($(`#p${currTurn}_three_kind`).html().length == 0) {
                    $(`#p${currTurn}_three_kind`).html(`<div class="temp">${getTotal()}</div>`);
                    hasInput = true
                }
            }
            // This checks for Four of a kind
            if (times >= 4) { 
                if ($(`#p${currTurn}_four_kind`).html().length == 0) {
                    $(`#p${currTurn}_four_kind`).html(`<div class="temp">${getTotal()}</div>`);
                    hasInput = true
                }
            }
            // This checks for YAHTZEE
            if (times >= 5) { 
                // If the player has their first YAHTZEE
                if (players[`player${currTurn}`]["total_yahtzee"] == 0) {$(`#p${currTurn}_yahtzee`).html(`<div class="temp">50</div>`);}
                else { // If the player gets another yahtzee
                    setOpen_inputs(getTotal())
                    $(`#p${currTurn}_yahtzee`).html(50+((players[`player${currTurn}`]["total_yahtzee"]+1)*100))
                } 
                players[`player${currTurn}`]["total_yahtzee"] += 1
                hasInput = true
            }
        }
    }
    // Full House
    var arr_dieVal = Array.from(new Set(diceVal))
    if (arr_dieVal.length == 2) { // If the arr_dieVal is only 2 values
        // It checks if the items have at least 2 or 3 times
        if ((get_all_item(arr_dieVal[0]) == 3) || (get_all_item(arr_dieVal[0]) == 2)) {
            if ((get_all_item(arr_dieVal[1]) == 3) || (get_all_item(arr_dieVal[1]) == 2)) {
                $(`#p${currTurn}_house`).html(`<div class="temp">25</div>`)
            }
        }   
    }

    // Small straight
    if (arr_dieVal.length >= 4) {
        if ((inNumOrder(arr_dieVal, 3)) && ($(`#p${currTurn}_sm_straight`).html().length == 0)) {
            $(`#p${currTurn}_sm_straight`).html(`<div class="temp">30</div>`);
            hasInput = true
        }
    }
    // large straight
    if (arr_dieVal.length == 5) {
        if ((inNumOrder(arr_dieVal, 4)) && ($(`#p${currTurn}_lar_straight`).html().length == 0)) {
            $(`#p${currTurn}_lar_straight`).html(`<div class="temp">40</div>`);
            hasInput = true
        }
    }
    // Chance
    if ($(`#p${currTurn}_chance`).html().length == 0) {$(`#p${currTurn}_chance`).html(`<div class="temp">${getTotal()}</div>`);hasInput = true}
    // No Inputs
    if (hasInput == false) {
        
    }
}

// When the window loads start the game
window.onload = function() {
    // Makes the dice list
    for(var i=0; i < 5; i++) {dieList.push(new Dice($(`#dice${i+1}`)[0]))}
    change_turn()
}