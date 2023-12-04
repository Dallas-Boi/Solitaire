// Made Demeber 4th, 2023 

// Vairables
var pot = 0
const players = []
const p1_cards = document.getElementById("p1_cards")
const p2_cards = document.getElementById("p1_cards")

// The player class
class Player {
    constructor(name, id, cash, cards) {
        this.name = name
        this.id = id
        this.cash = cash
        this.cards = cards
    }
    // Player data
    get_player_name() {
        return this.name
    }
    get_player_id() {
        return this.id
    }
    get_player_cash() {
        return this.cash
    }
    // Cash
    add_player_cash(amount) {
        this.cash += amount
    }
    remove_player_cash(amount) {
        this.cash -= amount
    }
    // Cards
    get_player_cards() {
        return this.cards
    }
    add_player_cards(card) {
        this.cards.push(card)
    }
    set_player_cards(cards) {
        this.cards = cards
    }
}
// Starts a game
function start_new_game() {
    for (var i=0; i < 2; i++) {
        players.push(new Player("Dealer", "dealer", 1000, [card_deck[0], card_deck[1]]))
        played_cards.push(card_deck[0], card_deck[1])
        card_deck.slice(0, 2)
    }
}

window.onload = function() {
    start_new_game()
}