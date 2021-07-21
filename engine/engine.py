import numpy as np
import sys
from sudoku_gen import generate
from enum import Enum
# for debugging
# import pdb
# pdb.set_trace()

user_input = sys.argv[1]

class Difficulty(Enum):
    EASY = 30
    MEDIUM = 24
    HARD = 17

def int_to_diff(num):
    if num == '30':
        return Difficulty.EASY
    if num == '24':
        return Difficulty.MEDIUM
    if num == '17':
        return Difficulty.HARD

# Set the given user difficulty input to enum.
DIFF = int_to_diff(user_input)

# Generate new puzzle.
new_puzzle = np.array(generate(difficulty=DIFF)[0])

# Backtracking to solve given sudoku puzzle.
def fill_puzzle(puzzle, row = 0, col = 0):
    row, col = find_indices(puzzle)

    # If there are no cells to fill, the puzzle is solved.
    if row == -1:
        print(puzzle)
        return True
    for num in range(1,10):
        if safe_assign(puzzle, row, col, num):
            # If the first assignment is okay, set the puzzle and continue.
            puzzle[row][col] = num
            if fill_puzzle(puzzle, row, col):
                return True
            # If num was not a safe assignment set it back to 0.
            puzzle[row][col] = 0
    return False

# Find the indices for the first unassigned spot in the puzzle. 
# If none, return -1, -1.
def find_indices(puzzle):
    for r in range(9):
        for c in range(9):
            # If the cell is empty, return the indicies.
            if puzzle[r][c] == 0:
                return r, c
    return -1, -1,

# Is the given number a safe assignment in its respective 
# 3x3 square of the puzzle?
def not_in_square(puzzle, row, col, num):
    min_row, min_col = 3*(row//3), 3*(col//3)
    select = np.ix_([min_row, min_row+1, min_row+2],
                    [min_col, min_col+1, min_col+2])
    square = puzzle[select].flatten()
    return all([num != square[x] for x in range(9)])

# Is the assignment unsafe?
def safe_assign(puzzle, row, col, num):
    row_safe = all([num != puzzle[row][y] for y in range(9)])
    column_safe = all([num != puzzle[x][col] for x in range(9)])
    # Check if num is not already in a row, col, or it's respective 3x3 square.
    return row_safe and column_safe and not_in_square(puzzle, row, col, num)

# print the puzzle to be solved
print(str(new_puzzle))

# print the soluntion (new_puzzle is shaped to 9x9 np array).
fill_puzzle(np.reshape(new_puzzle, (9,9)))

sys.stdout.flush()

