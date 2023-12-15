// Made Friday, December 8th, 2023
// Game variables
var currTurn = 0
var rolls = 0
var diceVal = []
const dieList = [] // All the dice classes
const plyList = []
// All paper items
var items = ["ones", "twos", "threes", "fours", "fives", "sixes"]
var otherItm = [...items, "three_kind", "four_kind", "house", "sm_straight", "lar_straight", "chance", "yahtzee"]

// Handles the players
class Players {
    constructor(id) {
        this.id = id
        // Score values
        // Upper
        this.ones = 0
        this.twos = 0
        this.threes = 0
        this.fours = 0
        this.fives = 0
        this.sixes = 0
        this.bonus = 0
        this.upper_total = 0
        // Lower
        this.threeKind = 0
        this.fourKind = 0
        this.full_house= 0
        this.small_straight = 0
        this.large_straight = 0
        this.chance = 0
        this.yahtzee = 0
        this.total_yahtzee = 0
        this.all_total = 0
        // Other Data
        this.turnAmount = 0
        this.turnRoll = 0
        this.turnData = []
        this.turnData[this.turnAmount] = []
        this.won = false
    }
    // Gets
    get_player_id() {return this.id}
    get_upper_total() {return this.upper_total}
    get_all_total() {return this.all_total}
    get_total_yahtzee() {return this.total_yahtzee}
    change_win(val) {this.win = val}
    // Sets / Adds / Removes
    // when the players turn gets changed
    changed_turn() {
        
    }
    // This will add the turn data when called
    player_rolled(data) {
        console.log(this.turnAmount, this.turnRoll)
        this.turnData[this.turnAmount][this.turnRoll] = data
        this.turnRoll++
    }
    // When called it will add the give value to the given variable
    add_value(itm, add) {
        this.all_total += parseInt(add)
        // When the user selects an score card value
        if (itm !== "bonus") {
            this.turnData[this.turnAmount][this.turnRoll] = itm
            this.turnAmount++;
            this.turnRoll = 0;
            this.turnData[this.turnAmount] = []
        }
        // Check if it apart of the upper inputs
        if (items.includes(itm)) {
            if (itm == "ones") {this.ones += parseInt(add)}
            else if (itm == "twos") {this.twos += parseInt(add)}
            else if (itm == "threes") {this.threes += parseInt(add)}
            else if (itm == "fours") {this.fours += parseInt(add)}
            else if (itm == "fives") {this.fives += parseInt(add)}
            else if (itm == "sixes") {this.sixes += parseInt(add)}
            this.upper_total += parseInt(add)
            return
        }
        // If its not apart of the upper inputs
        if (itm == "bonus") {this.bonus += parseInt(add)}
        else if (itm == "three_kind") {this.threeKind += parseInt(add)}
        else if (itm == "four_kind") {this.fourKind += parseInt(add)}
        else if (itm == "house") {this.full_house += parseInt(add)}
        else if (itm == "sm_straight") {this.small_straight += parseInt(add)}
        else if (itm == "lar_straight") {this.large_straight += parseInt(add)}
        else if (itm == "chance") {this.chance += parseInt(add)}
        else if (itm == "yahtzee") {this.yahtzee += parseInt(add);this.total_yahtzee++}
    }
    
    // This will return the data that is logged for AI
    rtnData() {
        return this.turnData
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
    plyList[currTurn-1].changed_turn()
    rolls = 0 // Resets rolls
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
        // This will log the all the players rolls
        plyList[currTurn-1].player_rolled(diceVal)
        // If the player has rolled 3 times
        if (rolls == 3) {$("#action").prop("disabled", true)}
    })
}

// When called it will add the value to the input
function add_paperVal(elm, ply) {
    // If the element has no children
    if ($(elm).children().length == 0) {return}
    $(elm).html(elm.textContent) // Sets the content to be the number
    // Checks if the clicked elm is part of the first 6
    plyList[ply-1].add_value(elm.id.replace(`p${ply}_`, ""), elm.textContent)
    change_turn() // Changes the turn
    // This will check the main 6 inputs if they are 
    var list6 = 0
    for (var i=0; i < items.length; i++) {
        if ($(`#p${ply}_${items[i]}`).text().length !== 0) {list6++}
    }
    // If the first 6 inputs have values then this will check for bonus points
    if (list6 == 6) {
        var bonus = 0
        $(`#p${ply}_total`).html(plyList[ply-1].get_upper_total())
        // If the player has over 63 points in the first 6 inputs then they get a bonus
        if (plyList[ply-1].get_upper_total() >= 63) {bonus = 35}
        $(`#p${ply}_bonus`).html(bonus) // Sets the players bonus text
        plyList[ply-1].add_value("bonus", bonus) // Adds the bonus to the all_total value
    }

    // Checks if all inputs are entered
    var all_inp = 0 + list6
    for (var i=6; i < otherItm.length; i++) {
        if ($(`#p${ply}_${otherItm[i]}`).html().length !== 0) {all_inp++}
    }
    // If all inputs are enter then it will end the game and add all the items
    if ((all_inp >= 13) && (ply == 2)) {
        var p1_score = 0
        var p2_score = 0
        otherItm.splice(6, 0, "total", "bonus")
        // Goes through otherItms and adds the values up
        const endGame = async () => {
            $("#end_table").prop("hidden", false)
            for (var i=0; i < otherItm.length; i++) {
                $(`#p1_${otherItm[i]}`).parent().addClass("end_select")
                if (otherItm[i] !== "total") {
                    // Adds to the score
                    p1_score += parseInt($(`#p1_${otherItm[i]}`).html())
                    p2_score += parseInt($(`#p2_${otherItm[i]}`).html())
                } else { // If it equals total then it will just set the total
                    p1_score = parseInt($(`#p1_${otherItm[i]}`).html())
                    p2_score = parseInt($(`#p2_${otherItm[i]}`).html())
                }
                // Shows the score
                $("#p1_add").html(p1_score);$("#p2_add").html(p2_score)
                await wait(1000)
                $(`#p1_${otherItm[i]}`).parent().delay( 1500 ).removeClass("end_select")
            }
            // Sets the total score on the players card
            $(`#p1_total_score`).html(p1_score)
            $(`#p2_total_score`).html(p2_score)
            $("#winnerTitle").prop("hidden", false)
            // Finds out who won
            if (p1_score > p2_score) { // If Player 1 Wins
                $("#winnerTitle").html("<div>Player 1 Wins</div>")
                plyList[0].change_win(true)
            } else if (p1_score < p2_score) { // If Player 2 Wins
                $("#winnerTitle").html("<div>Player 2 Wins</div>")
                plyList[1].change_win(true)
            } else { // If It was a Tie
                $("#winnerTitle").html("<div>Tie Game</div>")
            }
        }
        endGame()
        console.log(plyList[0].rtnData())
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
            if ($(`#p${currTurn}_${items[i-1]}`).html().length == 0) {
                $(`#p${currTurn}_${items[i-1]}`).html(`<div class="temp">${times*i}</div>`)
                hasInput = true
            }
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
                if (plyList[currTurn-1].get_total_yahtzee() == 0) {$(`#p${currTurn}_yahtzee`).html(`<div class="temp">50</div>`);}
                else { // If the player gets another yahtzee
                    setOpen_inputs(getTotal())
                    ply[currTurn-1].add_value("yahtzee")
                    $(`#p${currTurn}_yahtzee`).html(`${50+(plyList[currTurn-1].get_total_yahtzee()*100)}`)
                } 
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
                hasInput = true
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
    if ($(`#p${currTurn}_chance`).html().length == 0) {
        $(`#p${currTurn}_chance`).html(`<div class="temp">${getTotal()}</div>`);hasInput = true
    }
    // No Inputs
    if (hasInput == false) {
        for (var i=0; i < otherItm.length; i++) {
            if ($(`#p${currTurn}_${otherItm[i]}`).html().length == 0) { // Makes all empty inputs be 0
                $(`#p${currTurn}_${otherItm[i]}`).html(`<div class="temp">0</div>`)
            }
        }
    }
}

// When the window loads start the game
window.onload = function() {
    // Makes the dice list
    for(var i=0; i < 5; i++) {dieList.push(new Dice($(`#dice${i+1}`)[0]))}
    for(var i=0; i < 2; i++) {plyList.push(new Players(`player${i}`))} // Makes the players
    change_turn()
}