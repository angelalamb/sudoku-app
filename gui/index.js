setDiff = function() {
    let selected = document.getElementById("difficulty");
    const diff = selected.options[selected.selectedIndex].value;
    // send the difficulty level to the the next html page
    window.location = "game.html?diff1=" + diff
}
