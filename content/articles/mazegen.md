---
external: false
title: "Maze Generation and Pathfinding (C++)"
description: "A maze generator and flood-fill pathfinder written and visualized in C++"
tags: ["C++", "Maze generation", "maze", "Flood-fill", "A*", "Algorithm", "Pathfinding", "Recursive", "Backtracking"]
date: 2023-11-21
---

# Table of Contents
1. [Intro](#1.-intro)
2. [Generation](#2.-generation)
3. [Pathfinding](#3.-pathfinding)
4. [Conclusion](#4.-conclusion)

# 1. Intro

{% center_pic_width url="/images/mazegen.gif" wid="40%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The gif above shows my maze generation and pathfinding algorithm I wrote for my [Ascii-Graphics Horror Game (C++)](/articles/raycaster1.0). This project proved to be a fruitful exploration of recursive algorithms, maze generation, and pathfinding.

# 2. Generation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I explored many different forms of maze generation, but ultimately decided on a form of [recursive backtracking](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_implementation).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The trickiest part of this generation is that I wanted the spaces that walls and paths use to be permeable in regard to the same grid. Basically, I wanted a single 2D vector to contain the entire maze, and for it to be feasible for paths and walls to exist on any single coordinate. I wanted this both for the convienence of the single vector that holds the whole map, and because I wanted the walls to be the same thickness as the paths.

{% center_pic_width url="/images/mazegen2.gif" wid="40%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that if you compare this generation to the one at the start of this article, there are *far* less walls connecting to eachother. That is because in this implementation, before placing a pathway, it looks 2 nodes deep to ensure there are only untouched walls ahead. This prevents walls from connecting to previously generated walls (for the most-part at least, you can spot some buggy loops in the gif above). This makes a much more traditional maze, but it was not ideal for gameplay.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I went with a wall depth of 1 as that yielded the most interconnectedness. Note how often the path generated using a wall depth of 2 is long and windy, giving the player few options for exploration, and even fewer options for escape from monsters. A wall depth of 1 provides plenty of paths for the player to use, and plenty of avenues for monsters to sneak up on them.

# 3. Pathfinding

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The pathfinding uses a very simple version of flood-fill with depth-first-search. This is because the pathfinding is, in part, recycled from code using to generate the maze. The algorithm works as such:

```
FUNCTION labelNodes(position, stepsTaken)
    SET node[position]'s distance to stepsTaken
    SET openDirections to north, south, east, west
    FOR each direction in openDirections
        IF direction is open AND it's distance is greater than stepsTaken + 1 THEN
            labelNodes(position + direction, stepsTaken + 1)
        END IF
    END FOR
END FUNCTION
```

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After the distances of all of the nodes are labelled, the nodes are followed from high-to-low to reach the goal.

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This algorithm is guaranteed to find the shortest path to the objective. It is *also* guaranteed to mark absolutely every single open pathway node with its correct distance from the objective - regardless of how far out-of-the-way that is. A solution with 20 steps could have already been found, and the algorithm could continue searching and storing distances thousands of times larger.

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the context of my game, map size, and PC specs, this has not proved to be a problem peformance-wise (even when calling this algorithm 30 times every second - all on its own thread of course).

 # 4. Conclusion
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I don't intend on posting the code for this project, as it was nothing but a fun exploration that I learned a lot from. The lessons I learned in this project did wind up being used in some of my other projects that do have publicly available code including my [Fast Random Pathfinder (C++)](/articles/fast-random-pathfinder) and my [Dynamic Sudoku Solver (Rust)](/articles/pseudokude).