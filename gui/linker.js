// Sudoku table
const table = document.createElement('table');

// Console
const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

// Sudoku solution
let solution;

// Get the difficulty level from the url
function getParam() {
    let param;
    const idx = document.URL.indexOf('?');
    if (idx != -1) {
        const pair = document.URL.substring(idx + 1, 
                     document.URL.length).split('&');
        nameVal = pair[0].split('=');
        param = nameVal[1];
    }
    // Default is Medium = 24
    else {
        param = 24;
    }
    return param;
}

// Difficulty of sudoku puzzle
const diff = getParam();

function buildTable() {
    // Set the Sudoku table's attributes
    table.setAttribute("id", "grid");

    for (let i = 0; i < 9; i++) {
        const drow = table.insertRow(-1);
        drow.setAttribute("id", "row");

        for (let j = 0; j < 9; j++) {
            drow.insertCell(-1).innerHTML = '';
        }
    }
    document.getElementById('tablediv').appendChild(table);
}

function launchPython() {
    let exec = require('child_process').exec;
    //var nodeConsole = require('console');
    //var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

    // Execution of python
    let child = exec("python3 engine/engine.py " + diff.toString(),
        function(error, stdout, stderr) {
            if (error !== null) {
                myConsole.log('exec error: ' + error);
            }
        });

    // this is a listener to get data from python engine output
    child.stdout.on('data', (data) => {
        myConsole.log('Piped from python engine: ' + data.toString());

        // Get all the numbers in the data string
        let numPattern = /\d+/g;
        let puzzle = data.match(numPattern);

        // fill the table with the puzzle
        fillPuzzle(puzzle.slice(0, 81));
        // get the solution
        solution = puzzle.slice(81);
    });

    // kill the child process
    myConsole.log('Timeout');
    // Timeout is 9 sec
    setTimeout(function() {
        myConsole.log('kill');
        child.stdin.pause();
        child.kill();
    }, 9000);
}

function solvePuzzle(evt) {
    fillPuzzle(solution);
}

function newPuzzle(evt) {
    let blanks = [];
    for (let i = 0; i < 81; i++) {
        blanks.push('');
    }
    
    // fill the puzzle with blanks
    fillPuzzle(blanks);

    // get another puzzle
    launchPython();
}

function fillPuzzle(array) {
    //var table = document.getElementById('grid');
    let k = 0;

    for (let i = 0; i < 9; i++) {
        let row = table.rows[i].cells;
        for (let j = 0; j < 9; j++) {
            // if puzzle number is 0, it is an input cell (only for new puzzles)
            if (array[k] === '0') {
                row[j].innerHTML =
                '<input type="number" id="num_input" min="1" max="9"/>';
            } else {
                row[j].innerHTML = array[k];
            }
            k++;
        }
    }
}

function checkPuzzle() {
    //let nodeConsole = require('console');
    //let myConsole = new nodeConsole.Console(process.stdout, process.stderr);
    //var table = document.getElementById('grid');
    let nums = document.getElementById('num_input').value;
    let count = 0;
    let blanks = 0;
    let k = 0;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // Cell is of type input and is not blank.
            if (row[i].cells[j].firstChild.id === 'num_input' && 
                row[i].cells[j].firstChild.value !== '') {
           	    let num = row[i].cells[j].firstChild.value;
                // If num is incorrect, turn the cell background to red.
                if (num !== solution[k]) {
                	count++;
                    row[i].cells[j].firstChild.style.backgroundColor = "red";
                }
                // If num is now correct, turn the cell background to white.
                if (num === solution[k]) {
                	row[i].cells[j].firstChild.style.backgroundColor = "white";
                }
            }
            // Count the blank cells.
            if (row[i].cells[j].firstChild.id === 'num_input' && 
                row[i].cells[j].firstChild.value === '') {
                blanks++;
            }
            k++;
        }
    }
    // Display text if the user won
    myConsole.log(count);
    if (count === 0 && blanks === 0) {
    	myConsole.log("won!");
    }
}

// Build the table
buildTable()

// Run pyton
launchPython()


