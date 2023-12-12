// Made Friday, December 8th, 2023

// Makes the player
class Player {
    constructor(id, points, data) {
        this.id = id
        this.points = points
        this.data = data
    }
}

// This will make the dice with the given number
function change_dice(num) {
    // Checks if the num given is over 6
    if (num > 6) {console.error("The given dice is over 6");return}
    var curDice = $(`dice${num}`)[0]
    curDice.innerHTML = "" // Removes all the content in the dice
    var clsList = []
    // Makes the dice
    if (num == 1) { // Makes dice equal 1
        var elm = document.createElement("div")
        elm.className = "dot middle mid"
        curDice.appendChild(elm)
    } else if (num == 2) { // Makes dice equal 2
        clsList = ["bottom left", "top right"]
    } else if (num == 3) { // Makes dice equal 3
        clsList = ["bottom left", "middle mid", "top right"]
        
    }

    // Appends to the dice Elm
    for (var i=0; i < clsList.length; i++) {
        var elm = document.createElement("div")
        elm.className = `dot ${clsList[i]}`
        curDice.appendChild(elm)
    }
}