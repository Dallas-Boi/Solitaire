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
const noti_container = document.getElementById("notifications")
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
    constructor(name, cash, bet, cards, cash_elm, pot_elm, card_elm, card_val_elm) {
        this.name = name
        this.cash = cash
        this.bet = bet
        this.cards = cards
        this.cash_elm = cash_elm
        this.pot_elm = pot_elm
        this.card_elm = card_elm
        this.card_val_elm = card_val_elm
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
        card.style.top = "-500"
        // Starts an animation
        anime({
            targets: card,
            top: 48,
            rotateX: 360
        });
        this.cards.push(card)
        this.card_elm.appendChild(card)
        this.card_val_elm.textContent = this.get_player_total_val()
    }
    // Returns the players total card values
    get_player_total_val() {
        var total = 0
        for (var i=0; i < this.cards.length; i++) {
            total += convertLetter_toNumber_blackJack(this.cards[i].id)
        }
        return total
    }
    // This will reset the player for the next round
    reset_player() {
        this.cards = []
        this.set_player_bet(0)
        pot_info.textContent = 0
        this.pot_elm.textContent = 0
        this.card_elm.innerHTML = ""
        this.card_val_elm.textContent = 0
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
    var push = true
    for (var i=0; i < array.length; i++) {
        // Checks if the highest current number is less than the given value
        if (high < array[i]) {
            high = array[i]
            index = i
            push = false
        } else if (high == array[i]) {
            push = true
        }
    }
    // returns the rtn value
    if (push == true) {return 99}
    else if (rtn == "number") { return high }
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
    var noti = document.createElement("div")
    noti.id = `notif_txt_${noti_container.childElementCount}`
    noti.innerHTML = message
    noti.style.display = "none"
    noti_container.appendChild(noti)
    $(`#notif_txt_${noti_container.childElementCount-1}`).fadeIn()
    setTimeout(function() {
        $(`#notif_txt_${noti_container.childElementCount-1}`).fadeOut()
    }, 1500)
    setTimeout(function() {
        document.getElementById(`notif_txt_${noti_container.childElementCount-1}`).remove()
    }, 2500)
        
}

// When called this will end the current round and do the need calculations
function end_current_round(winner) {
    chips.style.display = "flex"
    playing.style.display = "none"
    // Gives the winner the money
    if (winner !== 99) { // If it was not a push
        players[winner].add_player_cash(pot)
        send_noti(`The Winner is Player ${winner+1}`)
    } else { // if was a push
        send_noti("It was a push")
    }
    setTimeout(function() {
        // Sets up everything for the next round
        for (var i=0; i < players.length; i++) {
            if (winner == 99) { players[i].remove_player_bet(players[i].get_player_bet())}
            players[i].reset_player()
        }
        change_turn("ppo")
    }, 2000)
}

// Changes the current turn
function change_turn(arg) {
    // If the player did not set any bet
    if ((arg == "betting") && (players[current_turn].get_player_bet() <= 0)) { return } 
    if (arg == "bust") {
        send_noti(`Player ${current_turn+1} Busted`)
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
    
    current_turn += 1
    if (current_turn > players.length-1) {
        if (arg) {current_turn = 0}
        else {
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
    } 
    // Resets the players back to zero
    turnTxt.textContent = ` Player ${current_turn+1}`
    send_noti(`It is now Player ${current_turn+1} Turn`)
    // Checks if the arg is "betting"
    if (arg == "betting") {
        if (current_turn+1 == players.length) {allow_bet();return}
        chips.style.display = "none" // Hides Chips
        playing.style.display = "flex" // Shows the action btns
        // Gives the players their cards
        play_card(0);play_card(0);
        play_card(1);play_card(1)
        hit_btn.onclick = function() { play_card(current_turn) }
        stand_btn.onclick = change_turn
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
    if (players[current_turn].get_player_total_val() > 21) {
        change_turn("bust")
        return
    }
}
// Updates the text for adding the bet
function add_bet(player, amount) {
    players[player].add_player_bet(amount)
    allow_bet()
}

// Disables the chips btns
function disable_chips() {
    chip1.style.display = "none"
    chip10.style.display = "none"
    chip25.style.display = "none"
    chip100.style.display = "none"
    chip250.style.display = "none"
    chip1500.style.display = "none"
    chip5000.style.display = "none"
    chip7500.style.display = "none"
}

// Allows the betting process
function allow_bet() {
    disable_chips()
    var i=0 
    var chipCost = ["1","10","25","100","250","1500","5000","7500"]
    while (i < chips.childElementCount) {
        var child = chips.children[i]
        var childAct = child.id.replace("chip", "")
        // Checks the chip action
        if (childAct == "Play") { child.onclick = function() { change_turn("betting") } }
        else if (chipCost.includes(childAct)) {
            // Checks if the player has enough money for the bet
            if (!(parseInt(childAct) > players[current_turn].get_player_cash())) {
                child.onclick = function() { add_bet(current_turn, parseInt(childAct))}
                child.style.display = "flex"
            }
        }
        i++
    }
}

// When the client hovers over a button with the action class
$(".action").hover(function(e) {
    var scaleNum = 1
    if (e.type == "mouseenter") { scaleNum = 1.5 } // If the client hovers over the btn

    anime({
        targets: e.currentTarget,
        scale: scaleNum,
        rotate: '1turn'
    });
})

// Starts a game
function start_new_game() {
    // Makes the players
    for (var i=0; i < 2; i++) { 
        players.push(new Player(`player${i}`, 1000, 0, [], document.getElementById(`p${i+1}_cash_val`), document.getElementById(`p${i+1}_pot`), document.getElementById(`p${i+1}_cards`), document.getElementById(`p${i+1}_card_val`))) 
        document.getElementById(`p${i+1}_cash_val`).textContent = 1000
    }
    allow_bet()
}

window.onload = function() {
    start_new_game()
}