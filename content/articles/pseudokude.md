---
external: false
title: "Dynamic Sudoku Solver"
description: "A dynamic sudoku solver made in Rust."
tags: ["Rust", "Code Optimization", "Mathematics", "Algorithmic Design", "Problem Solving"]
date: 2024-09-30
draft: false
language: "Rust"
---

# Table of Contents
1. [Intro](#1.-intro)\
1.1 &nbsp;[Source Code](#1.1-source-code)
2. [Boards / Cells](#2.-boards-cells)
3. [Row/Column/House Traversal](#3.-board-traversal)
4. [Candidate Analysis](#4.-candidate-analysis)\
4.1 &nbsp;[Update Candidates / Single Candidate Elimination](#4.1-update-candidates-single-candidate-elimination)\
4.2 &nbsp;[Hidden Single Candidate Elimination](#4.2-hidden-single-candidate-elimination)
5. [Backtracking](#5.-backtracking)
5. [Conclusion](#6.-conclusion)

# 1. Intro
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This article discusses Pseudokude (pseudocode + sudoku), an algorithm made in Rust for solving sudoku boards of any size up to a `u16`. Pseudokude makes use of backtracking as well as candidate analysis.

## 1.1 Source Code
[Source code on GitHub](https://github.com/nTh0rn/rust-pseudokude)

{% center_pic url="/images/rust-pseudokude/solving_example.gif" /%}

# 2. Boards / Cells

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pseudokude makes use of two different objects, the `Board` object, and the `Cell` object.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The `Board` object represents an entire sudoku board, including its size, the size of its houses, what the last modified `Cell` was, and most importantly, it contains a 2D vector of `Cell` objects.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The `Cell` object represents individual cells, containing its digit, the coordinates of all other cells in its row/column/house, as well as all of its candidates and banned candidates.

{% center_pic_invert url="/images/rust-pseudokude/board-cell-uml.png" /%}

# 3. Board Traversal
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To allow for backtracking and candidate analysis, a cell must be able to compile a list of all its surrounding cells to determine what possible digits it could be. These lists are the vectors `row`, `col`, and `house`. There is an additional list titled `aoe` for "area of effect", which is defined as the union of `row`, `col`, and `house`, $ \text{row}\cup \text{col}\cup \text{house} $.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Special care is taken to ensure that the cell's own coordinates are not included in any of these lists. See `Board.init()` below, which initializes all cells. Note that color functionality have been removed from this codeblock and all other codeblocks in this article. See also the visualization of each cell's area-of-effect.

{% rust_board_init /%}

{% center_pic_width url="/images/rust-pseudokude/example_init.gif" wid="300px" /%}

# 4. Candidate Analysis

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Candidate analysis has three steps: updating each cell's individual candidates, searching for cells that contain only one candidate, and determining whether a cell's candidate is unique to at least one of its areas.

## 4.1 Update Candidates / Single Candidate Elimination

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Before a cell can be eliminated, we must first determine its candidates. This is done by iterating through and compiling all digits from the cell's area-of-effect.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Every cell's candidate list is updated all at once when the board is first loaded as well as when popping the Board stack during backtracking. When filling in a cell, only that cells within the area-of-effect are updated. This stand-alone update is where single candidate elimination occurs.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Below is the pseudocode for `update_cand()`. Note that this function is recursive. If a single candidate elimination is possible, then this function is further called for all cells in that coordinate's area. Another very similar version of this function exists that updates all candidates, `update_all_cand()`, the code for which is almost exactly the same as the following code.

```
FUNCTION update_cand(cell)
    FOR each empty coordinate in the cell's area of effect
        CLEAR coordinate's candidates
        APPEND all free digits to the coordinate's candidates
        IF coordinate has only 1 candidate THEN
            SET coordinate's digit to that candidate
            update_cand(coordinate)
        END IF
    END FOR
END FUNCTION
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;See the Rust code for `update_cand()` below. To gather what digits are in a cell's area, the additional function `coords_to_digits()` is used. `coords_to_digits()` is multi-purpose, as it is also used for obtaining all candidates within a cell's area, which will be required for [4.2](#4.2-hidden-single-candidate-elimination).

{% rust_update_cand /%}

{% rust_coords_to_digits /%}

## 4.2 Hidden Single Candidate Elimination

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Single hidden candidate elimination is the process of determining whether a cell has a candidate that is unique to its row, column, or house. If a candidate only exists within a single cell in an area, then that cell must be that candidate, regardless of whether or not the cell has other candidates and regardless of whether or not that digit exists as a candidate in the other areas.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The following is an example of a cell that can be solved using hidden single candidate elimination.

{% center_pic url="/images/rust-pseudokude/unfilled_cand.png" /%}
Credit to [smartsudoku.com](https://www.smartersudoku.com/sudoku#/) for image.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that the highlighted cell has multiple candidates, however it is the only cell in its row that has 4 as a candidate. This means it must be 4, which further decreases the candidates in the house as shown below.

{% center_pic url="/images/rust-pseudokude/filled_cand.png" /%}
Credit to [smartsudoku.com](https://www.smartersudoku.com/sudoku#/) for image.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The function `process_of_elimination()` is shown below, which is responsible for single hidden candidate analysis. Note that the function makes use of `update_cand()` from [4.1](#4.1-update-candidates-single-candidate-elimination).

```
FUNCTION process_of_elimination()
    WHILE there are potentially more eliminations DO
        FOR each empty cell on the board
            FOR each of cell's candidates
                FOR each coordinate in cell's areas (row, column, and house)
                    IF candidate exists in area THEN CONTINUE
                    SET digit to candidate
                    update_cand(coordinate)
                END FOR
            END FOR
        END FOR
    END WHILE
END FUNCTION
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Rust code for the function `process_of_elimination()` is also below. Note that the function makes use of `update_cand()` and `coords_to_digits()` from [4.1](#4.1-update-candidates-single-candidate-elimination).

{% rust_process_of_elimination /%}

# 5. Backtracking

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Candidate analysis is extremely effective for most sudoku puzzles, but as the board size increases and the amount of given information decreases, more advanced strategies must be implemented. In the case of Pseudokude, backtracking is used starting from the top-left of the board and working its way to the right.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pseudokude uses a fairly standard backtracking algorithm. For every board iteration, a new copy of the board is pushed to a stack. If the board is determined to be unsolvable, then the stack is popped and the most recently backtracked cell gets its digit added to its list of banned candidates and resets, ensuring that branch is never traversed again.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Below is the pseudocode for the backtracking algorithm used. This is the main algorithm of Pseudokude, as it makes use of all the previous functions described. Note that the condition for popping is encountering a cell that is empty but that has zero candidates. This only occurs if the board is impossible to solve.

```
SET board equal to the board to be solved
SET board_stack to a stack of boards
board.init()
board.update_all_cand()
board.process_of_elimination()
PUSH board to board_stack
WHILE the board isn't solved DO
    SET board to the top of board_stack
    FOR each empty cell in board
        IF cell has candidates THEN
            SET cell to the first of its candidates
            SET board's last_modified to cell's coordinate and digit
            board.update_cand(cell)
            board.process_of_elimination()
            PUSH board to board_stack
        ELSE THEN
            POP board_stack
            PUSH top of stack's last_modified digit to its cell's banned candidate list
            SET top of stack's last_modified cell to empty
            top of board_stack.update_all_cand()
            top of board_stack.process_of_elimination()
            CONTINUE outer WHILE loop
        END IF
    END FOR
END WHILE
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Below is the Rust code for backtracking, which is just Pseudokude's `main()` function. Some functionality has been stripped from this example code, including color functionality and error checking.

{% rust_backtracking /%}

# 6. Conclusion

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There are some optimizations that could be made to Pseudokude. I could've implemented solving methods such as the [X-Wing Strategy](https://www.sudokuwiki.org/x_wing_strategy), but I felt that it would have been nothing but more of the same in regard to the challenge of implementing it. Alternative optimizations include using a single-coordinate system (versus working with an x and a y) and using bitwise operations for determining candidates (this comes at the cost of not being able to solve boards wider than 64 cells).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Overall I consider Pseudokude a success. It has been a very fun exercise in code optimization and problem solving. Again, be sure to check out the source code over on [GitHub](#1.1-source-code).