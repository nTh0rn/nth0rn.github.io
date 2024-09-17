---
external: false
title: "Development and Optimization of a Fast Random Pathfinder (C++)"
description: "The solutions used to optimize a pathfinding algorithm with worst-case infinite runtime."
tags: ["C++", , "Pathfinding", "Maze generation", "CraPath", "Crappy pathfinder"]
url: /articles/chessbit
date: 2024-08-20
draft: true
---

# Table of Contents
1. [Intro](#1.-intro)\
1.1 &nbsp;[Source Code](#1.1-source-code)\
1.2 &nbsp;[What is Raycasting?](#1.2-what-is-raycasting)
2. [The Map](#2.-the-map)\
2.1 &nbsp;[Scaling](#2.1-scaling)
3. [Raycasting](#3.-raycasting) {% mark %}<--The fun part!{% /mark %} \
3.1 &nbsp;[Angle Calculation](#3.1-angle-calculation)\
3.2 &nbsp;[Wall Hit Detection](#3.2-wall-hit-detection)\
3.3 &nbsp;[Distance Calculation](#3.3-distance-calculation)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3.1 &nbsp;[Ray Movement Calculation](#3.3.1-movement-calculation)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3.2 &nbsp;[Projection Calculation](#3.3.2-projection)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3.3 &nbsp;[Center FOV Vector Calculation](#3.3.3-center-fov-vector-calculation)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3.4 &nbsp;[Dot Product Calculation](#3.3.4-dot-product-calculation)

# 1. Intro
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This article explores the development of an efficient random pathfinder and the attempted optimization of it from a linear approach. This project serves as an example of a start-to-end-oriented approach to optimization failing to account for cases that could lead to better solutions before trimming them from the solution-tree.

## 1.1 Source Code
[Source code on GitHub](https://github.com/nTh0rn/crapath)

# 2. Random Pathfinding Algorithm
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An easy and almost instinctual solution to developing a random pathfinder is to simply move in random directions until reaching the goal. While this is algorithmically simple, it is far too computationally inefficient.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An alternative random path-finding algorithm will be used instead. Affectionately and somewhat unprofessionally titled **CraPath**, I first developed this algorithm when I was 13 after failing to grasp A*. This algorithm is still truly random in its solution and surprisingly efficient.

## 2.1 Finding a random path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cells on the map are randomly selected and checked for whether they have sight-line to the last node in the path. This is accomplished using [DDA raycasting](https://lodev.org/cgtutor/raycasting.html#The_Basic_Idea_). If they can see each other, then the random cell is added to the path as a node and the process continues until the goal is in sight.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the key to CraPath's efficiency compared to randomly moving along open adjacent cells. Although time is wasted checking many cells whose sight-line wind up intersecting with walls, the nodes that are found are often far away, allowing for faster traversal and an ultimately shorter set of nodes leading to the goal.

```
WHILE the last node in path[] cannot see the goal
    randomNode = a random position on the map
    IF randomNode can see the last node in path[] THEN
        APPEND randomNode to path[]
    END IF
END WHILE
APPEND goal to path[]
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View the drop-downs below to see the C++ code for `findPath()`, which selects random nodes, and `canSee()`, which determines node visible using DDA raycasting. Some functionality has been stripped from how these normally operate within [`CraPath.cpp`](https://github.com/nTh0rn/CraPath/blob/main/CraPath.cpp) in order to make their use in this specific case more apparent.

{% fill_path_cpp /%}
{% can_see_cpp /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The traversal of a path generated using this algorithm is visualized below. This path had a total of 8969 nodes before reaching the goal, which is exponentially faster than any path that the originally discussed random-direction-based-algorithm would've been able to consistently generate.

{% center_pic url="/images/crapath/findpath.webp" /%}

## 2.2 Filling the path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Now that a path has been found, we fill in the spaces between nodes that are not immediately adjacent to the previous node. This provides more options for optimization later.

```
FOR each node in path[], i
    IF path[i] and path[i+1] are not immediately adjacent THEN
        INSERT all the cells between the nodes at i and i+1 to path[]
    END IF
END FOR
```

## 2.3 Optimizing the path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finally, we iterate forwards and backwards through the path and find nodes that can be skipped entirely. We erase these nodes from the path until no more optimizations can be made.

```
FOR each node at the start of path[] moving forwards, i
    FOR each node at the end of path[] moving backwards, j
        IF i-j=1 THEN
            BREAK
        END IF
        IF path[i] can see path[j] THEN
            ERASE the nodes between i and j in path[]
        END IF
    END FOR
END FOR
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View the drop-down below to see the C++ code for `optimizePath()`.
{% optimize_path_cpp /%}


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The traversal of the initial optimized path with jumps inbetween nodes is shown below. The filled-in version of the optimized path is also shown, using the same algorithm from [2.2 Filling the path](#2.2-filling-the-path).

{% center_pic url="/images/crapath/optimizeandtraverse.webp" /%}

# 3. The Downsides of CraPath

## 3.1 Map Size / Terrain 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As the map gets larger, the chances for any particular randomly selected cell having sightline to the last node at the end of the path become increasingly slim. This is also worsened depending on the layout of the walls. The visualizations shown thus far demonstrate CraPath in a maze where there is only 1 path to the exit (recursive maze generation with a depth of 2). This is, in some ways, actually optimal in regard to ensuring the path found is (almost) the perfect and shortest path. This leads into the next issue.

## 3.2 Impossible Optimizations

{% float_left_pic url="/images/crapath/bad_optimizations.png" width="float:left; padding-right:2%; padding-left:2%"/%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I'm not quite sure what to label this issue, but it has to do with how CraPath works at it's core. On the left, you can see the optimizations that you'd expect labelled with blue arrows, but the path actually taken is shown with red arrows.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;During optimization, CraPath only cares whether an earlier node can see a later node, and trashes any nodes in-between. However, there are circumstances where the nodes that are trashed actually held the key to what could've been a slightly faster route. This happens most frequently when optimizing around corners that split into 2 different paths. This causes CraPath to overshoot occasionally.

## 3.3 Worst Case Runtime

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The most glaring issue with CraPath is that the first part of its algorithm relies on finding a path to the goal via random traversal. This means that the Big O notation for CraPath is, worst case, **infinity**.

# 3. Bonus: Maze Generation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alongside developing CraPath, I also implemented a maze generator to test it out. I have explored maze generation [previously](/articles/mazegen) using recursive backtracking, but I encountered memory issues that resulted in imperfections (it was also just a bad implementation).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This time, I implemented backtracking using stacks instead of recursion. This yielded much better results. Below is an example of backtracking maze generation with a depth of 2.

{% center_pic url="/images/crapath/mazegen.webp" /%}
