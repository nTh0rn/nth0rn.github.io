---
external: false
title: "Fast Random Pathfinder"
description: "The development of a fast random pathfinder which self-optimizes."
tags: ["C++", "Pathfinding", "Maze Generation", "Code Optimization", "Documentation", "Algorithmic Design", "Raycasting"]
date: 2024-07-30
draft: false
language: "C++"
---

# Table of Contents
1. [Intro](#1.-intro)\
1.1 &nbsp;[Demo / Source Code](#1.1-demo-source-code)
2. [Random Pathfinding Algorithm](#2.-random-pathfinding-algorithm)\
2.1 &nbsp;[Finding a Random Path](#2.1-finding-a-random-path)\
2.2 &nbsp;[Filling the Path](#2.2-filling-the-path)\
2.3 &nbsp;[Optimizing the Path](#2.3-optimizing-the-path)
3. [The Disadvantages](#3.-the-disadvantages)\
3.1 &nbsp;[Map Size/Terrain](#3.1-map-size-terrain)\
3.2 &nbsp;[Impossible Optimizations](#3.2-impossible-optimizations)\
3.3 &nbsp;[Worst Case Runtime](#3.3-worst-case-runtime)
4. [Bonus: Maze Generation](#4.-bonus:-maze-generation)

# 1. Intro
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This article discusses the development of a "fast" pathfinder that operates via random traversal.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It should be said that there is little use for a pathfinder that relies solely on random chance when traversing. This project exists solely for curiosity's sake, and should not ever be considered for actual use cases when alternatives like [A*](https://en.wikipedia.org/wiki/A*_search_algorithm) exist.

## 1.1 Demo / Source Code
[Source code on GitHub](https://github.com/nTh0rn/fast-random-pathfinder)

{% center_pic_width url="/images/fast-random-pathfinder/fast-random-pathfinder.gif" wid="300px" /%}

# 2. Random Pathfinding Algorithm

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An easy and almost instinctual solution to developing a random pathfinder is to simply move in random directions until reaching the goal. While this is algorithmically simple, it is far too computationally inefficient. In my testing, pathfinding by moving to random immediately adjacent directions often yields paths consisting of millions of steps even for miniscule 20x20 mazes.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;That is why an alternative random pathfinding algorithm will be explored, the Fast Random Pathfinder. This algorithm is still truly random in its solution, but it is much faster.

## 2.1 Finding a Random Path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fast Random Pathfinder operates by checking whether any two distinct points on the map can see each other without any obstructions between. In this implementation, a simple grid is used alongside [DDA raycasting](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)) for determining whether any two points have sight-line of each other.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cells on the map are randomly selected and checked for whether they have sight-line to the last node in the path. If they can see each other, then that random cell gets added to the path as a node and the process continues until the goal is in sight.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the key to Fast Random Pathfinder's efficiency compared to randomly moving to open adjacent cells. Although time is lost from checking many cells that wind up intersecting with walls, the nodes that are found are often far away, allowing for faster traversal and an ultimately shorter path.

```
WHILE the last node in path[] cannot see the goal
    randomNode = a random position on the map
    IF randomNode can see the last node in path[] THEN
        APPEND randomNode to path[]
    END IF
END WHILE
APPEND goal to path[]
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View the drop-downs below to see the C++ code for `findPath()`, which selects random nodes, and `canSee()`, which determines node visible using DDA raycasting. Some functionality has been stripped from how these normally operate within [`fast-random-pathfinder.cpp`](https://github.com/nTh0rn/fast-random-pathfinder/blob/main/fast-random-pathfinder.cpp) in order to make their use in this specific case more apparent.

{% cpp_fill_path /%}
{% cpp_can_see /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The traversal of a path generated using this algorithm is visualized below. This path had a total of 8969 nodes before reaching the goal, which is exponentially faster than any path that the originally discussed random-direction-based-algorithm would've been able to consistently generate.

{% center_pic_invert url="/images/fast-random-pathfinder/findpath.webp" /%}

## 2.2 Filling the Path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Now that a path has been found, we fill in the spaces between nodes that are not immediately adjacent to the previous node. This provides more options for optimization later.

{% center_pic url="/images/fast-random-pathfinder/unoptimized_path.png" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The above image is an example of a random path which has no available optimizations, each node can only see the next node ahead and the previous node behind. We can increase the number of potential optimizations by filling in the spaces between the nodes with new nodes, as shown below.

{% center_pic url="/images/fast-random-pathfinder/filled_path.png" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nodes 1 and 9 now have sight-line of each other. This means that the other nodes can be trimmed from the path, which will be expanded upon in [2.3](#2.3-optimizing-the-path).

```
FOR each node in path[], i
    IF path[i] and path[i+1] are not immediately adjacent THEN
        INSERT all the cells between the nodes path[i] and path[i+1]
    END IF
END FOR
```

## 2.3 Optimizing the Path

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finally, we iterate forwards and backwards through the path and find nodes that can be skipped entirely. We erase these nodes from the path until no more optimizations can be made. Here is the previous example after being optimized.

{% center_pic url="/images/fast-random-pathfinder/optimized_path.png" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that this is not the most optimal path between the first and last nodes, but it is the only one that Fast Random Pathfinder is able to find given its linear nature. This is further discussed in [3.2](#3.2-impossible-optimizations).

```
FOR each node at the start of path[] moving forwards, i
    FOR each node at the end of path[] moving backwards, j
        IF i-j=1 THEN BREAK ENDIF
        IF path[i] can see path[j] THEN
            ERASE the nodes between i and j in path[]
        END IF
    END FOR
END FOR
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View the drop-down below to see the C++ code for `optimizePath()`. Note the use a `goto` rather than an outer while-loop. By using `goto`, the outer for-loop can be broken and restarted from within the inner for-loop without the need of an additional method or variable.
{% cpp_optimize_path /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The traversal of the initial optimized path with jumps in between nodes is shown below. The filled in version of the optimized path is also shown, using the same algorithm from [2.2](#2.2-filling-the-path).

{% center_pic_invert url="/images/fast-random-pathfinder/optimizeandtraverse.webp" /%}

# 3. The Disadvantages

## 3.1 Map Size / Terrain 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As the map gets larger, the odds of any particular randomly selected cell having sightline to the last node at the end of the path become increasingly slim. This is also worsened depending on the layout of the walls. This is by and large the biggest downside of this pathfinder, and of all random pathfinders.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The visualizations shown thus far demonstrate Fast Random Pathfinder in a maze where there is only 1 path to the exit (recursive maze generation with a depth of 2). This, in some ways, is actually optimal in regard to ensuring that the path that is found is (almost) the perfect and shortest path. Whether or not this is actually the most efficient path is covered in [3.2](#3.2-impossible-optimizations).

## 3.2 Impossible Optimizations

{% float_left_pic url="/images/fast-random-pathfinder/bad_optimizations.png" width="float:left; padding-right:2%; padding-left:2%"/%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On the left, you can see the optimizations that you'd expect labelled with blue arrows, but the path actually taken is shown with red arrows.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;During optimization, Fast Random Pathfinder only cares whether an earlier node can see a later node, and trashes any nodes in between. However, there are circumstances where the nodes that are trashed actually held the key to what could've been a slightly faster route. This happens most frequently when optimizing around corners that split into 2 different paths. This causes Fast Random Pathfinder to overshoot occasionally.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shown below is the previous example's true optimized path. Finding this path is impossible with the linear-approach that Fast Random Pathfinder uses, as it would require testing which optimizations are actually the most optimal.

{% center_pic url="/images/fast-random-pathfinder/true_optimized_path.png" /%}

## 3.3 Worst Case Runtime

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The most glaring issue with Fast Random Pathfinder is the main reason no one would ever actually use a random pathfinder, fast or slow. The path to the goal is randomly generated, meaning that, worse-case, Fast Random Pathfinder is $ O(\infty) $. There is definitely some math that could be done to determine how probable it is that Fast Random Pathfinder finds a given path in a given environment after a certain number of iterations, but such efforts are not explored here.

# 4. Bonus: Maze Generation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alongside developing Fast Random Pathfinder, I also implemented a maze generator to test it out. I have explored maze generation [previously](/articles/mazegen) using recursive backtracking, but I encountered memory issues (it was also just a poor implementation) that resulted in imperfections.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This time, I implemented backtracking using stacks instead of recursion. This yielded much better results. Below is an example of backtracking maze generation with a depth of 2.

{% center_pic_invert url="/images/fast-random-pathfinder/mazegen.webp" /%}
