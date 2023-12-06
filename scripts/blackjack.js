// Made Demeber 4th, 2023 
// Vairables
var pot = 0
var current_turn = 0
const players = []
// Other Elements
const turnTxt = document.getElementById("player")
const chips = document.getElementById("chips_container")
const playing = document.getElementById("play_container")
const pot_info = document.getElementById("pot")
// Betting Buttons
const chip1 = document.getElementById("chip1")
const chip10 = document.getElementById("chip10")
const chip25 = document.getElementById("chip25")
const chip100 = document.getElementById("chip100")
const chip250 = document.getElementById("chip250")
const chip1500 = document.getElementById("chip1500")
const chip5000 = document.getElementById("chip5000")
const chip7500 = document.getElementById("chip7500")
const chipPlay = document.getElementById("chipPlay")
// Action Buttons
const hit_btn = document.getElementById("hit_btn")
const stand_btn = document.getElementById("stand_btn")

// The player class
class Player {
    constructor(name, cash, bet, cards, cash_elm, pot_elm, card_elm) {
        this.name = name
        this.cash = cash
        this.bet = bet
        this.cards = cards
        this.cash_elm = cash_elm
        this.pot_elm = pot_elm
        this.card_elm = card_elm
    }
    // Player data
    get_player_name() {return this.name}
    get_player_cash() {return this.cash}
    // Cash
    add_player_cash(amount) {
        this.cash += amount
        this.cash_elm.textContent = this.cash
    }
    remove_player_cash(amount) {
        this.cash -= amount
        this.cash_elm.textContent = this.cash
    }
    get_player_bet() {return this.bet}
    // Player Betting
    add_player_bet(amount) {
        this.bet += amount
        pot += amount
        pot_info.textContent = pot
        this.remove_player_cash(amount)
        this.pot_elm.textContent = this.bet
        
    } 
    remove_player_bet(amount) {
        this.bet -= amount
        pot -= amount
        pot_info.textContent = pot
        this.add_player_cash(amount)
        this.pot_elm.textContent = this.bet
    }
    set_player_bet(amount) {this.bet = amount} 

    // Cards
    get_player_cards() {return this.cards}
    add_player_cards(card) {
        console.log(card)
        this.cards.push(card)
        this.card_elm.appendChild(card)
    }
    // Returns the players total card values
    get_player_total_val() {
        var total = 0
        console.log(this.cards)
        for (var i=0; i < this.cards.length; i++) {
            console.log(convertLetter_toNumber_blackJack(this.cards[i].id))
            total += convertLetter_toNumber_blackJack(this.cards[i].id)
        }
        return total
    }
    reset_player() {
        this.cards = []
        this.set_player_bet(0)
        pot_info.textContent = 0
        this.pot_elm.textContent = 0
        this.card_elm.innterHTML = ""
    }
}

// Return the index of the highest number / or number 
function find_highest(array, rtn) {
    // Error handler
    if (!array) {console.error("Array Not given");return}
    if (!rtn) {console.error("Return Arg not given");return}
    // Finds the highest number
    var high = 0
    var index = 0
    for (var i=0; i < array.length; i++) {
        // Checks if the highest current number is less than the given value
        if (high < array[i]) {
            high = array[i]
            index = i
        }
    }
    // returns the rtn value
    if (rtn == "number") { return high }
    else if (rtn == "index") {return index}
}

// Converts the cards Letter to a Number
function convertLetter_toNumber_blackJack(letter) {
	if (letter[0] == "A") { return 11 }
	else if ((["J", "Q", "K"].includes(letter[0])) || (letter[1] == "0")) { return 10 }
	else { return parseInt(letter[0]) }
}

// Sends a notification
function send_noti(message) {
    document.getElementById("notif_txt").innerHTML = message
    $("#notification").fadeIn()
    setTimeout(function() {
        $("#notification").fadeOut()
    }, 1500)
}

// When called this will end the current round and do the need calculations
function end_current_round(winner) {
    chips.style.display = "flex"
    playing.style.display = "none"
    // Gives the winner the money
    players[winner].add_player_cash(pot)
    pot = 0
    // Sets up everything for the next round
    for (var i=0; i < players.length; i++) {
        players[i].reset_player()
    }
}

// Changes the current turn
function change_turn(arg) {
    // If the player did not set any bet
    if ((arg == "betting") && (players[current_turn].get_player_bet() <= 0)) { return } 
    if (arg == "bust") {
        console.log(`Player ${current_turn+1} Busted`)
        end_current_round()
        return
    }   
    // Checks if the arg is "betting"
    current_turn += 1
    if (current_turn > players.length-1) {
        if (arg) {current_turn = 0}
        // This will check who is the winner
        var harray = []
        for (var i=0; i < players.length; i++) {
            if (players[i].get_player_total_val() <= 21) {
                harray.push(players[i].get_player_total_val())
                continue
            }
            harray.push(0)
        }
        end_current_round(find_highest(harray, "index"))
        return
    } 
    // Resets the players back to zero
    turnTxt.textContent = ` Player ${current_turn+1}`
    send_noti(`It is now Player ${current_turn+1} Turn`)
    if (arg == "betting") {
        if (current_turn != 0) {allow_bet();return}
        chips.style.display = "none"
        playing.style.display = "flex"
        // Gives the players their cards
        play_card(0);play_card(0);
        play_card(1);play_card(1)
        hit_btn.onclick = function() { play_card(current_turn) }
        stand_btn.onclick = function() {
            if (current_turn+1 != players.length) {change_turn(arg);return}
            change_turn()
        }   
        
    }
}

// Place the next card
function play_card(player) {
    // Adds the card to the player
    players[player].add_player_cards(make_card(card_deck[played_cards.length], "card"))
    played_cards.push(card_deck[played_cards.length])
    // Resets the deck if the deck has all the played cards
    if (played_cards.length > 51) {played_cards = []}
    // Checks if the total of this players cards is 21 or under
    console.log(players[current_turn].get_player_total_val())
    if (players[current_turn].get_player_total_val() > 21) {
        change_turn("bust")
        return
    }
}
// Updates the text for adding the bet
function add_bet(player, amount) {
    players[player].add_player_bet(amount)
    console.log(players[player].get_player_cash())
    allow_bet()
}

// Disables the chips btns
function disable_chips() {
    chip1.disabled = "disabled"
    chip10.disabled = "disabled"
    chip25.disabled = "disabled"
    chip100.disabled = "disabled"
    chip250.disabled = "disabled"
    chip1500.disabled = "disabled"
    chip5000.disabled = "disabled"
    chip7500.disabled = "disabled"
}

// Allows the betting process
function allow_bet() {
    disable_chips()
    // Checks if the player can bet that chip
    if (players[current_turn].get_player_cash() >= 7500) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
        chip100.disabled = ""
        chip250.disabled = ""
        chip1500.disabled = ""
        chip5000.disabled = ""
        chip7500.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 5000) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
        chip100.disabled = ""
        chip250.disabled = ""
        chip1500.disabled = ""
        chip5000.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 1500) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
        chip100.disabled = ""
        chip250.disabled = ""
        chip1500.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 250) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
        chip100.disabled = ""
        chip250.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 100) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
        chip100.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 25) {
        chip1.disabled = ""
        chip10.disabled = ""
        chip25.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 15) {
        chip1.disabled = ""
        chip10.disabled = ""
    } else if (players[current_turn].get_player_cash() >= 1) {
        chip1.disabled = ""
    }

    chip10.onclick = function() { add_bet(current_turn, 10) }
    chip25.onclick = function() { add_bet(current_turn, 25) }
    chip100.onclick = function() { add_bet(current_turn, 100) }
    chip250.onclick = function() { add_bet(current_turn, 250) }
    chip1500.onclick = function() { add_bet(current_turn, 1500) }
    chip5000.onclick = function() { add_bet(current_turn, 5000) }
    chip7500.onclick = function() { add_bet(current_turn, 7500) }
    chipPlay.onclick = function() { change_turn("betting") }
}

// Starts a game
function start_new_game() {
    // Makes the players
    for (var i=0; i < 2; i++) { 
        players.push(new Player(`player${i}`, 1000, 0, [], document.getElementById(`p${i+1}_cash_val`), document.getElementById(`p${i+1}_pot`), document.getElementById(`p${i+1}_cards`))) 
        document.getElementById(`p${i+1}_cash_val`).textContent = 1000
    }
    console.log(card_deck)
    console.log(played_cards)
    allow_bet()
}

window.onload = function() {
    start_new_game()
}