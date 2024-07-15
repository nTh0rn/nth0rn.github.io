---
external: false
title: "Maze Generation and Pathfinding (C++)"
description: "A maze generator and flood-fill pathfinder written and visualized in C++"
tags: ["C++", "Maze generation", "maze", "Flood-fill", "A*", "Algorithm", "Pathfinding", "Recursive", "Backtracking"]
date: 2024-04-21
---
![](/images/mazegen.gif)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The gif above shows my maze generation and pathfinding algorithm I wrote for my upcoming untitled 3D ascii-graphics analog-horror game (Check out the raycaster I wrote for that [here](/articles/raycaster1.0)). This project proved to be a fruitful exploration of recursive algorithms as well as, obviously, maze generation and pathfinding.

## Generation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I explored many different forms of maze generation, but ultimately decided on a form of [recursive backtracking](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_implementation) that searches only 1 layer of walls deep.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The trickiest part of this generation is that I wanted the spaces that walls and paths use to be permeable in regard to the same grid. Basically, I wanted a single 2D vector to contain the entire maze, and for it to be feasible for paths and walls to exist on any single coordinate. I wanted this both for the convienence of the single vector that holds the whole map, and because I wanted the walls to be the same thickness as the paths. This caused some difficulties when attemping 2-level-deep recursive backtracking.

![](/images/mazegen2.gif)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that if you compare this generation to the one at the start of this article, there are *far* less walls connecting to eachother. That is because this implementation, before placing a pathway, checks a particular direction up to 2 nodes away. This prevents walls from connecting to previously generated walls (for the most-part at least, you can spot some loops in the gif above). This makes a much more traditional maze, but was not ideal for gameplay.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Since I allow a path or a wall to exist on any node, that also means large amounts of the map go to waste as the algorithm fails to fully search what otherwise might be potential paths due to the complex combinations of walls and paths that the algorithm cannot discern are pathable within a 2-depth search. Ultimately, I decided I do not like the winding nature of 2-depth search.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I went with 1-depth search as that yielded the most interconnectedness. Note how often the path generated using 2-depth search is long and windy, giving the player few options for exploration, and even fewer options for escape from monsters. 1-depth search provides plenty of paths for the player to use, and plenty of avenues for monsters to sneak up on them.

## Pathfinding

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As this was my first true pathfinding algorithm, I implemented the most general form of flood-fill that I could. You may be familiar with flood-fill in the form of [A*](https://en.wikipedia.org/wiki/A*_search_algorithm). A* uses floodfill by only searching nodes that have the highest potential to reach the target first, a heuristic that changes as the flooding encounter walls. This also means that since A* hops to whatever node shows the highest potential, it cannot (or maybe just should not) be implemented using recursion.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My implementation of pathfinding was, in part, recycled from code using to generate the maze - meaning its recursive. The algorithm works as such:
 1. Within the current node, store how many steps it took to get here.
 2. Pick a random open pathway along a cardinal direction.
    * If there are no open pathways besides the one used to get here, then return function.
 3. Does the node in selected direction have a stored distance higher than the distance of the current node + 1? (untouched nodes store infinity distance by default)
    * If yes, call self at that new node (**recursion occurs here**).
    * If no, pick a new direction.
       * If no new directions can be picked, then return function.
 
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After the distances of all of the nodes are labelled, you just follow whatever nearest cell has the lowest distance to reach the goal.

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This algorithm is guaranteed to find the shortest path to the objective. It is *also* guaranteed to mark absolutely every single open pathway node with its correct distance from the objective - regardless of how far out-of-the-way that is. A solution with 20 steps could have already been found, and the algorithm could continue searching and storing distances thousands of times larger.

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the context of my game, map size, and PC specs, this has not proved to be a problem peformance-wise (even when calling this algorithm 30 times every second - all on its own thread of course). I believe that I, as a programmer, am a victim (lol) of how good computers are now-a-days, as I've really faced no consequences for this atrociously innefecient algorithm besides the shame of this article.
 # Conclusion
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I'm not quite ready to post the code for this project, as there are still a few minor bugs (note the loops forming in the 2-depth search). Keep an eye out for it though on my [GitHub](https://github.com/nTh0rn).