// for debugging
let nodeConsole = require('console');
let myConsole = new nodeConsole.Console(process.stdout, process.stderr);


setDiff = function() {
    let selected = document.getElementById("difficulty");
    const diff = selected.options[selected.selectedIndex].value;
    myConsole.log(diff);
    // send the difficulty level to the the next html page
    window.location = "game.html?diff1=" + diff
}
