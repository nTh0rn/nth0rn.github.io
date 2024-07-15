---
external: false
draft: false
title: "Diagonal Matrix Traversal (Python)"
description: "An algorithm to traverse across a square matrix diagonally."
date: 2024-04-24
tags: ["Matrix", "Linear Algebra", "Traversal", "Diagonal", "Transformation"]
---
```
Pre-diagonal string: "123456789"
['1', '2', '3']
['4', '5', '6']
['7', '8', '9']

Post-diagonal string: "142753869"
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The goal of this project is to traverse a matrix diagonally and store the contents of each cell visited to a string. Be sure to checkout the full code on [Github](https://github.com/nTh0rn/diagonal_wrapping_traversal). To understand why exactly someone might want to do this, read up on the random-test I developed, [The FLS Test](/blog/fls_test), for my [HRNG research](https://arxiv.org/abs/2404.09395).

So the tasks are relatively simple:
1. [Convert the string to a matrix](#convert-a-string-to-a-matrix)
2. [Traverse the matrix diagonally](#traverse-the-matrix-diagonally) **<- The Fun Part!**
3. [Output the diagonal path as a string](#output-the-diagonal-path-as-a-string.)

## Convert a String to a Matrix
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First, we must convert our string to a matrix (or in the context of Python, a list). This is extremely simple, as shown.
```
#Convert string of square-length to list
def string_to_list(input):
	outp=[[]]
	x = 0
	y = 0
	for char in input:
		x += 1
		if x == np.sqrt(len(input))-1:
			outp.append([])
			y += 1
			x = 0
		outp[y].append(char)
	return outp
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This code simple iterates through the string character-by-character, adding each character to a sub-list within our list, detects when it reaches what would be the end of the row, and wraps to a new sub-list. The output of an example string is shown below.
```
>>> print(string_to_list("12345679"))
['1', '2', '3']
['4', '5', '6']
['7', '8', '9']
```
## Traverse The Matrix Diagonally
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the trickiest and also the funnest part of this project. Let's examine that matrix from earlier, except let's rewrite it without the fluff.
```
1 2 3
4 5 6
7 8 9
```
Now let's rotate this matrix 45 degrees counter-clockwise and show it as a diamond.
```
  1
 4 2
7 5 3
 8 6
  9
```
What we want to do is walk this diamond left-to-right starting at the top. That means the order of cells visited when traversing would be:
```
1 -> 4 -> 2 -> 7 -> 5 -> 3 -> 8 -> 6 -> 9
```
This means our expected output of traversing this matrix would be ```"142753869"```.
Now let's rewrite the original matrix, except we'll replace the contents of each cell with its x and y corrdinate in the form ```xy```.
```
00 10 20
01 11 21
02 12 22
```
Now let's turn this into a diamond.
```
    00
  01  10
02  11  20
  12  21
    22
```
Just like before, let's show the path of cells we would walk along diagonally.
```
00 -> 01 -> 10 -> 02 -> 11 -> 20 -> 12 -> 21 -> 22
```
What we want to do is create an algorithm that can generate this list of coordinates for any matrix size, at which point we can just jump to each coordinate to obtain our final string.
### The Basis
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's take that list from earlier and display it vertically.
```
x y
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
Now let's mark everytime we reach the end of the row on the diamond shown earlier.
```
x y
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
Where each ```###``` is the end of the row in the diamond. Almost immediately, a pattern presents itself. Let's specifically look at the x-coordinates, which can be visualized as such:
```
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
The range of values used all exist within the list ```[0, 1, 2]```. As a matter of fact, they also are always in linear-order from the list (meaning, for example, that we never see the x coordinate path `0 -> 2 -> 1`). The length of this list that contains all coordinates used is notably ```3```, which is the same as the side-length of our matrix. Let's take this list and call it the ```Basis```. We can also create a basis for any side length as follows:
```
basis = []
for i in range(0, len(matrix)):
	basis.append(i)
```
### The Slider
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's imagine a slider that selects a range of values within the basis.
```
        BASIS
      |0  1  2|
      ^-------^
       SLIDER
```
Let's also save what values fall within this slider's selection in the basis.
```
Slider selection: [0, 1, 2]
```
Now let's imagine this slider starting at the far left of the basis and move it over 1 item at a time. Everytime the slider moves, let's add its current selection to the ```slider total``` list.
```
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
Now look at that! The slider total, ```[0, 0, 1, 0, 1, 2, 1, 2, 2]```, has, in order, every x-coordinate we need to move diagonally across the 3x3 matrix.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To get the y-coordinates, all we have to do is, at every state of selection, reverse the slider selection list before adding it to the total!
### Header and Tail
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At this point, we have a physical process that yields the x and y coordinates needed to walk along any matrix diagonally. Let's see how we can implement this into code.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We have already created our basis, so next we need our slider. The most important parts of the slider are its start and end, or its ```Header``` and ```Tail```. We can move the Header to any position in the Basis, but we should probably start at 0 and move up from there. We set the Tail equal to the header minus the width of the matrix plus 1, ```header-len(matrix)+1```, since the tail is always as many items behind the header as there are items in the basis. We add 1 since the difference between the start and end of any list is the length of the list + 1.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's go ahead and create a variable to represent the width of the matrix.
```
l = len(matrix)
```
Since we want the Header and Tail to reference ranges within the basis, we need to make sure they never reach outside the bounds of the list.
```
# If header or tail is out of bounds of the basis, reset them to the start/end
if tail < 0:
	tail += l - (header + 1)
if header > l - 1:
	header -= header - (l - 1)
```
Now that we've defined the bounds of where inside the basis we want, we can iteration through the basis from the Tail to the Header.
```
# Iterate through the basis from the tail to header
for index in range(tail, header + 1):
	output.append(basis[index])
```
We also need to make sure that the selection is reversed if we're calculating y-coordinates. We can tie whether or not to reverse the selection to a variable ```y```.
```
# Reverse this output if its for the y-direction
if y == True:
	output.reverse()
```
Let's turn this all into a function that accepts a Header position, and yields the selection of the slider from the basis.
```
def slider(header, y=False):
    output = []
    tail = header - len(basis) + 1

	# If header or tail is out of bounds of the basis, reset them to the start/end
	if tail < 0:
		tail += l - (header + 1)
	if header > l - 1:
		header -= header - (l - 1)

	# Iterate through the basis from the tail to header
	for index in range(tail, header + 1):
		output.append(basis[index])

	return output
```
### Storing the coordinates
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At this point, we're capable of generating the x and y coordinates for traversing the any square matrix diagonally. We can store the coordinates as shown.
```
for i in range(0, l * 2 - 1):
	for item in slider(i):
		x_coords.append(item)
	for item in slider(i, True):
		y_coords.append(item)
```
In the case of our 3x3 matrix, this will yield the following:
```
x-coords: [0, 0, 1, 0, 1, 2, 1, 2, 2]
y-coords: [0, 1, 0, 2, 1, 0, 2, 1, 2]
```
## Output the Diagonal Path as a String
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is quite possibly the most simple part of this project. We already have 2 lists representing the x and y coordinates of the diagonal path, so we can create our output string by just visiting each coordinate and adding it to a string.
```
# Walk along the matrix using the generated x and y coordinates.
final_string = ""
for i in range(0, l * l):
	final_string += matrix[y_coords[i]][x_coords[i]]
return final_string
```
Now we can wrap all of the previous code into one function, ```diagonal_conversion(matrix)```, that accepts a matrix. This yields our final results.
```
>>> pre_diag_string="123456789"
>>> post_diag_string=diagonal_conversion(string_to_list(pre_diag_string))
>>> print("\nPost-diagonal string: \"" + post_diag_string + "\"")
Post-diagonal string: "142753869"
```
## Conclusion
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thanks for reading! Quick reminder that all of this code can be found over on [Github](https://github.com/nTh0rn/diagonal_wrapping_traversal). Also be sure to read about my FLS Test, which is where I originally needed to be able to read a matrix diagonally.