---
external: false
draft: false
title: "Diagonal Matrix Traversal"
description: "An algorithm to traverse across a square matrix diagonally."
date: 2024-04-24
tags: ["Matrix", "Linear Algebra", "Traversal", "Diagonal", "Transformation"]
language: "Python"
---
# Table of Contents
1. [Intro](#1.-intro)\
1.1 &nbsp;[Demo / Source Code](#1.1-demo-source-code)
2. [String to Matrix](#2.-string-to-matrix)
3. [Diagonal Traversal](#3.-diagonal-traversal) **<- THE FUN PART!**\
3.1 &nbsp;[The Basis](#3.1-the-basis)\
3.2 &nbsp;[The Slider](#3.2-the-slider)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.2.1 &nbsp;[The Head / Tail](#3.2.1-the-head-tail)\
3.3 &nbsp;[Generating Coordinates](#3.3-generating-coordinates)
4. [Diagonal Coordinates to String](#4.-diagonal-coordinates-to-string)
5. [Conclusion](#5.-conclusion)

# 1. Intro
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This articles discusses the development of a unique diagonal matrix traversal algorithm. Although more efficient algorithms exist, this article discusses the development of a theoretical process and algorithmic implementation originating from simple numerical pattern recognition.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It is important to note that this algorithm was originally developed for [The FLS Test](/articles/fls_test), with the purpose of providing an alternative transformation type for bitstreams. As a result, this project expects a single string input where each character is a relevant item (originally intended to be a string of 1s and 0s), and outputs a single string where each character has been moved around per the algorithm.

## 1.1 Demo / Source Code
[Source code on GitHub](https://github.com/nTh0rn/diagonal_wrapping_traversal)

```bash
Original string: "123456789"
Original string as matrix:
['1', '2', '3']
['4', '5', '6']
['7', '8', '9']

Diagonal string: "142753869"
```
&nbsp;
# 2. String to Matrix
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First, we must convert our string to a matrix. There are much more clever ways to do this in Python, but the following implementation is possible across most languages,
```py
#Convert string of square-length to list
def string_to_list(string):
    output=[]
    side_len = math.isqrt(len(string))
    for i in range(0,len(string)):
        if (i) % side_len == 0:
            output.append([])
        output[-1].append(string[i])
    return output
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This code iterates through the string character-by-character, adds each character to a sub-list within the output, wraps to a new sub-list when reaching the end of a row, and returns the output. See an example matrix below,
```
>>> print(string_to_list("12345679"))
['1', '2', '3']
['4', '5', '6']
['7', '8', '9']
```
&nbsp;
# 3. Diagonal Traversal
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To traverse the matrix diagonally, we're going to search for any patterns in a manual $3$x$3$ traversal and come up with an algorithm for any $n$x$n$ traversal. Let's examine that matrix from earlier,
```
1 2 3
4 5 6
7 8 9
```
Let's rotate this matrix 45 degrees counter-clockwise and show it as a diamond,
```
  1
 4 2
7 5 3
 8 6
  9
```
What we want to do is traverse this diamond from left-to-right starting at the top row, wrapping back to the left at the end of each row.
```
1 -> 4 -> 2 -> 7 -> 5 -> 3 -> 8 -> 6 -> 9
```
This means the diagonally traversed output of this matrix is ```142753869```. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's rewrite the original matrix, except we'll replace the contents of each cell with its x and y coordinate in the form $xy$,
```
00 10 20
01 11 21
02 12 22
```
Let's turn this into a diamond by rotating it 45 degrees counter-clockwise,
```
    00
  01  10
02  11  20
  12  21
    22
```
Just like before, let's show the ordering of the cells visited when diagonally traversing,
```
00 -> 01 -> 10 -> 02 -> 11 -> 20 -> 12 -> 21 -> 22
```
What we want to do is create an algorithm that can generate this list of coordinates for any $n$x$n$ matrix.
## 3.1 The Basis
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's examine the cell ordering from the $3$x$3$ matrix from earlier and display it vertically.
```
x y
---
0 0
0 1
1 0
0 2
1 1
2 0
1 2
2 1
2 2
```
Let's mark every time we reach the end of the row on the diamond using `###`.
```
x y
---
0 0
###
0 1
1 0
###
0 2
1 1
2 0
###
1 2
2 1
###
2 2
```
Almost immediately, a pattern presents itself. Let's look at the x-coordinates, which can be visualized as the following,
```
x coordinates
-------------
0
###
0 -> 1
###
0 -> 1 -> 2
###
1 -> 2
###
2

0 -> 0 -> 1 -> 0 -> 1 -> 2 -> 1 -> 2 -> 2
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The range of values used all exist within the list ```[0, 1, 2]```. As a matter of fact, they also are always in linear-order from the list (meaning, for example, that we never see the x coordinate path `0 -> 2 -> 1`). The length of this list that contains all coordinates used is notably ```3```, which is the same as the side-length of our matrix. Let's take this list and call it our ```Basis```. We can create a basis for any matrix size using the following,
```
basis = []
for i in range(0, len(matrix)):
    basis.append(i)
```
## 3.2 The Slider
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's imagine a slider that is capable of selecting a range of values within the basis, up to the entire basis.
```
        BASIS
      |0  1  2|
      ^-------^
       SLIDER
```
Let's save what values fall within the `Slider selection` per step.
```
Slider selection: [0, 1, 2]
```
Now let's imagine this slider starting at the far left of the basis, moving it over one index per step. Everytime the slider moves, let's append `Slider selection` to the ```Slider total``` list,
```
        BASIS
      |0  1  2|
^-------^
 SLIDER

Slider selection: [0]
Slider total: [0]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        BASIS
      |0  1  2|
   ^-------^
    SLIDER

Slider selection: [0, 1]
Slider total: [0, 0, 1]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        BASIS
      |0  1  2|
      ^-------^
       SLIDER

Slider selection: [0, 1, 2]
Slider total: [0, 0, 1, 0, 1, 2]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        BASIS
      |0  1  2|
         ^-------^
          SLIDER

Slider selection: [1, 2]
Slider total: [0, 0, 1, 0, 1, 2, 1, 2]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        BASIS
      |0  1  2|
            ^-------^
             SLIDER

Slider selection: [2]
Slider total: [0, 0, 1, 0, 1, 2, 1, 2, 2]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
The slider total, ```[0, 0, 1, 0, 1, 2, 1, 2, 2]```, has every x-coordinate we need to move diagonally across the 3x3 matrix in order, as desired.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To get the y-coordinates, all we have to do is reverse the `Slider selection` list before adding it to the `Slider total` list.
### 3.2.1 The Head / Tail
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We have already created our Basis, so next we need our slider. The most important parts of the slider are its start and end, or its ```Head``` and ```Tail```. We can move the Head to any position in the Basis, but we should probably start at 0 and move up from there. We set the Tail equal to the head minus the width of the matrix plus 1, ```head-len(matrix)+1```, since the Tail is always as many items behind the Head as there are items in the Basis. We add 1 since the difference between the start and end of any list is the length of the list + 1.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's go ahead and create a variable to represent the width of the matrix.
```
l = len(matrix)
```
Since we want the Head and Tail to reference ranges within the Basis, we need to make sure they never reach outside the bounds of the list.
```
# If head or tail is out of bounds of the basis, reset them to the start/end
if tail < 0:
    tail += l - (head + 1)
if head > l - 1:
    head -= head - (l - 1)
```
Now that we've defined our bounds, we can iterate through the Basis from the Tail to the Head.
```
# Iterate through the basis from the tail to head
for index in range(tail, head + 1):
    output.append(basis[index])
```
We also need to make sure that the selection is reversed if we're calculating y-coordinates. We can tie whether to reverse the selection or not to a variable ```y```.
```
# Reverse this output if its for the y-direction
if y == True:
    output.reverse()
```
Let's turn this all into a function that accepts a Head position, and yields the selection of the slider from the Basis.
```
# Slides along the basis, start/end denoted by head/tail.
def slider(head, y=False):
    output = []
    tail = head - len(basis) + 1

    # If head or tail is out of bounds of the basis, reset them to the start/end
    if tail < 0:
        tail += l - (head + 1)
    if head > l - 1:
        head -= head - (l - 1)

    # Iterate through the basis from the tail to head
    for index in range(tail, head + 1):
        output.append(basis[index])

    # Reverse this output if its for the y-direction
    if y == True:
        output.reverse()
    return output
```
## 3.3 Generating Coordinates
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At this point, we're capable of generating the x and y coordinates for diagonally traversing any square matrix. We can generate and store the coordinates as shown.
```
for i in range(0, l * 2 - 1):
    x_coords.extend(slider(i))
    y_coords.extend(slider(i, True))
```
In the case of our 3x3 matrix, this will yield the following:
```
x_coords=[0, 0, 1, 0, 1, 2, 1, 2, 2]
y_coords=[0, 1, 0, 2, 1, 0, 2, 1, 2]
```
&nbsp;
# 4. Diagonal Coordinates to String
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We generate our output string by visiting each of our slider-generated matrix coordinates and appending each cell to our final string.
```
# Walk along the matrix using the generated x and y coordinates.
final_string = ""
for i in range(0, l * l):
    final_string += matrix[y_coords[i]][x_coords[i]]
```
Now we can wrap all of our previous code into one function, ```diagonal_conversion(matrix)```, that accepts a matrix and returns `final_string`.
```
>>> original_string="123456789"
>>> diagonal_string=diagonal_conversion(string_to_list(original_string))
>>> print(diagonal_string)
142753869
```
&nbsp;
# 5. Conclusion
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thank you for reading! Be sure to check out the final product [over on Github](#1.1-demo-source-code) and read about what this algorithm was originally developed for, [The FLS Test, a unique test for determining the quality of random numbers](/articles/fls_test).


*This article was updated on Apr 13, 2025.*