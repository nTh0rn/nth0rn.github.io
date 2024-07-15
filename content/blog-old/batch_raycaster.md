---
external: false
title: "Integer-only Raycaster (Batch)"
description: "A raycaster I wrote in Batch doesn't use any trigonometric functions or non-integers."
tags: ["Raycaster", "Challenge", "Engine", "Algorithm", "Batch", ""]
date: 2024-05-22
draft: false
---

# Table of Contents
1. [Intro](#intro)\
1.1 &nbsp;[Demo / Source Code](#demo)\
1.2 &nbsp;[What is Raycasting?](#)
2. [The Map](#)\
2.1 &nbsp;[Scaling](#)
3. [The Screen](#)\
3.1 &nbsp;[Vertical Columns](#)
4. [Raycasting](#) {% mark %}<--The fun part!{% /mark %} \
4.1 &nbsp;[Angle Calculation](#)\
4.2 &nbsp;[Wall Hit Detection](#)\
4.3 &nbsp;[Distance Calculation](#)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.1 &nbsp;[Projection Calculation](#)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.2 &nbsp;[Center FOV Vector Calculation](#)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.3.3 &nbsp;[Dot Product Calculation](#)
5. [Conclusion](#)


# 1. Intro
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This article explains the solutions I used in the creation of my Batch raycaster.
This is a notable challenge as Batch is very low level language and, quite frankly, an awful language. However, it can be incredibly fun
to code in, and always yields interesting solutions to what are otherwise trivial problems in most languages.

## 1.1 Demo / Source Code
[Source code on GitHub](https://github.com/nTh0rn/batch-raycaster)
{% table id="demo"%}
 * ![](/images/batch_raycaster/batch_raycaster_walking.gif) {% align="center" %}
{% /table %}



## 1.2 What is Raycasting?
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The basic jist of raycasting is that every single vertical column of the user's screen is assigned to a ray on a 2D top-down representation of the player's map. How far that ray can imminate from the player before hitting a wall corresponds to the length of a line drawn in its vertical column. This means walls that are far away yield small vertical lines, and walls that are close yield large vertical lines.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;So raycasting relies on one basic principle: ***Things look smaller when they are farther away***.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please check out [Lode Vandevenne's fantastic article on raycasting](https://lodev.org/cgtutor/raycasting.html) for a full explanation of floating point raycasting. My article focusses on explaining the integer-only solutions to raycasting, and will not recover the basics beyond unique solutions.


# 2. The Map
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The first thing I had to do was figure out some way to store the map. This was accomplished using dynamic variable naming, which is the Batch equivilent to arrays.
First the map is stored in a text file as shown.
{% table %}
 * ![](/images/batch_raycaster/room.txt.png) {% align="center" %}
{% /table %}
Note the hightlighted **P**. This denotes where the player is in the map. You may also note the dots used instead of blank spaces. Batch is basically incapable of comprehending blank spaces in strings, so some filler character must be used instead. This map is 10x10, but the raycaster can support larger maps.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The map is then read line by line, and character by character. Each character is then assigned to its appropriate coordinate, saving the player's coordinates seperately.
```batch
set mapx%x%y%y%=!char!
if "!char!"=="P" (
	set pcord=x%x%y%y%
	set /a px=!x!
	set /a py=!y!
)
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;One issue though, how do we navigate within cells on the map if we cannot use floating point numbers? The answer is to scale the map up. The higher the scale, the more accurate the raycasting - but also the longer it takes to calculate!

## 2.1 Scaling
{% table %}
 * ![](/images/batch_raycaster/raycaster_scale.png) {% align="center" %}
{% /table %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scaling is very simple. The coordinate system used is not actually 10x10 from the map. Instead, every x and y coordinate is scaled by some number, 500 for example, meaning your grid is actually 5000x5000, with a different cell every 500 units. Using 500 is a bit overboard, as anywhere between 150-300 can provide suffecient visual fidelity while also rendering faster.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Whether or not you'll collided with a cell is done by taking the current scaled coordinates and dividing them by the scale amount. The result will be the nearest rounded down integer, which can then be checked using the dynamic map variables for either a wall or blank space.

# 3. The Screen
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The coordinates for the screen are generated using dynamic variable naming.
```batch
for /l %%y in (1, 1, !height!) do (
	for /l %%x in (1, 1, !width!) do (
		set x%%xy%%y=·
	)
)
```
where `height=30` and `width=45`. As mentioned previously, a filler whitespace is used as Batch cannot easily process whitespace in strings.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The screen can then be printed by iterating through these variables as shown.
```batch
::Print the screen from the x and y coordinate variables
:print_screen
	set screen=
::  Used to replace the filler whitespace with true whitespace
	set "temp_whitespace=·"
	set "real_whitespace= "
	for /l %%y in (1, 1, !height!) do (
		for /l %%x in (1, 1, !width!) do (
			set screen=!screen!!x%%xy%%y!!x%%xy%%y!
		)
::      Print the screen row and replace the filler whitespace.
		echo: !screen:%temp_whitespace%=%real_whitespace%!
		set screen=

	)
	goto :eof
```

## 3.1 Vertical columns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Traditionally, you would generate the vertical columns on the fly in a raycaster. While that is undoubtedly the most dynamic solution, Batch runs the fastest when you go ahead and do as much of the work that you can for it. So instead, I use a set of variables that represent all possible vertical columns, stored horizontally as a string.

```batch
set d33=A···············‾··············B
set d32=A··············_‾··············B
set d31=A·············_##‾·············B
set d30=A·············—##—·············B
set d29=A············_####‾············B
set d28=A············—####—············B
set d27=A···········_######‾···········B
set d26=A···········—######—···········B
set d25=A··········_########‾··········B
set d24=A··········—########—··········B
set d23=A·········_##########‾·········B
set d22=A·········—##########—·········B
set d21=A········_############‾········B
set d20=A········—############—········B
set d19=A·······_##############‾·······B
set d18=A·······—##############—·······B
set d17=A······_################‾······B
set d16=A······—################—······B
set d15=A·····_##################‾·····B
set d14=A·····—##################—·····B
set d13=A····_####################‾····B
set d12=A····—####################—····B
set d11=A···_######################‾···B
set d10=A···—######################—···B
 set d9=A··_########################‾··B
 set d8=A··—########################—··B
 set d7=A·_##########################‾·B
 set d6=A·—##########################—·B
 set d5=A_############################‾B
 set d4=A—############################—B
 set d3=A##############################B
 set d2=A##############################B
 set d1=A##############################B
```
The `A` and `B` at the start and end of the line assist with whitespace later on in the code (as mentioned earlier, Batch is horrendous when dealing with whitespace.)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;These vertical columns are written to the screen by iterating through them character by character, and inversely iterating through the screen's coordinates.
```batch
::The vertical column for the distance calculated
set view=!d%distance%!

::Replace wall-characters with the associated character on
::the map or with the corner-defining character.
if !corner_hit! LSS 2 (
    set view=!view:#=%walltype%!
) else (
    set view=!view:#=█!
)

::Iterate through the screen and insert this vertical column
for /l %%y in (1, 1, !height!) do (
    set x!screenx!y%%y=!view:~%%y,1!
)
```
where `cornerhit` is a variable storing whether or not the current ray hit a corner, and `walltype` is the character that represents the wall that was hit on the map.

# 4. Raycasting
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the trickiest part of this project. Our main problem is that we cannot use cosine or sine to calculate the x and y change of our ray's movement vector as it imminates from the player. One possible solution is an implementation of sine and cosine via their Taylor Series definitions, but this is ultimately too costly of a calculation for each ray, and requires more and more iterations as the angle approaches multiples of 90. Instead, a solution that involves the simple addition and subtraction of the x and y component of the vector is used.
## 4.1 Angle Calculation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First, the input angle is noted. This angle defines the left-most ray to be used. First we divide this value by 45. Since Batch is integer-only, these yields a floored answer. This number denotes what octant the angle is in from 1 to 8. This is similar to quadrants, which are seperated by 90 degrees and number from 1 to 4.
```batch
::Define what octant the angle is within
set /a octant=!angle!/45
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The octant is then re-multiplied by 45, which results in the next-lowest 45 degree multiple relative to the original angle. The original angle then subtracts this number, which yields exactly how far inside the octant from 1-45 degrees the angle is.
```batch
set /a oct_angle=!octant!*45
set /a oct_angle=!angle!-!temp_angle!
set /a oct_angle=!temp_angle!
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is where things get weird. We have what octant we are in, and how far within it we are. The original angle we had, which could've been anything from 0 to 359, ceases to matter at this point. In fact, any degree-based angles as we know them cease to matter. We are now going to use the `oct_angle` as either an x or y component of our ray's movement vector. Which component it effects and whether it is increasing or decreases is decided by what `octant` the angle is current within. The subsequent ray will then move by subtracting or adding 2 to the `oct_angle`. This process is a bit weird to explain, but it can be easily visualized as shown below.
{% table %}
 * ![](/images/batch_raycaster/raycast_visualized.gif) {% align="center" %}
{% /table %}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As can be seen, the x and y component are defined by the `oct_angle` value, which moves 2 units inbetween every ray. When the x or y component reach -45 or 45, it sticks to that value and swaps to the other component. As can be seen in the distances between the rays, this isn't perfect. The `oct_angle` defines how far in the octant the desired ray is, but it is a measurement of degrees, and cannot be mapped 1-to-1 to either the x and y component independantly.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;However, if we bound the x and y components to within +45 and -45 units, a rough approximate of the desired angle can be obtained. The offset also equalizes out every 90 degrees, which is perfect for having an FOV of 90. This is why the screen is 45 pixels wide, as a change of 2 units per ray (and there are 45 rays) yields 90 degrees. Every single ray within the FOV will not move perfectly by 2 degrees, but it eventually aligns in the end and yields a close-enough approximation.

## 4.2 Wall Hit Detection
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Whether or not the current x and y coordinate of the ray, `vx` and `vy`, is checked by unscaling them and examining those floored coordinates against the map. Additionally, corner detection occurs here, where if the ray is 1/8th of the way between the corner of a cell then it draws a filled in line instead of the `walltype`. The code is shown below.
```batch
:v_search
::  Not all code is shown
    . . . 
::  Not all code is shown

::  Define the scaled-down coordiantes to check
    set /a checkx=!vx!/!scale!
    set /a checky=!vy!/!scale!

::  Corner-checking variables
    set /a corner_hit=0
    set /a ccx_low=!vx!-!corner_thresh!
    set /a ccx_high=!vx!+!corner_thresh!
    set /a ccy_low=!vy!-!corner_thresh!
    set /a ccy_high=!vy!+!corner_thresh!
    set /a ccx_low=!ccx_low!/!scale!
    set /a ccx_high=!ccx_high!/!scale!
    set /a ccy_low=!ccy_low!/!scale!
    set /a ccy_high=!ccy_high!/!scale!

::  Check whether the current vector + or - the corner threshhold is defined
::  as a different cell and, therefore, near the edges of the cell. This can
::  only ever be the case for 1 of the x checks and 1 of the y checks, but if
::  it is the case for both, then the ray must be near a corner. If this occurs
::  then corner_hit will get added to twice.
    if not "!mapx%ccx_low%y%checky%!"=="!mapx%checkx%y%checky%!" (
        set /a corner_hit=!corner_hit!+1
    )
    if not "!mapx%ccx_high%y%checky%!"=="!mapx%checkx%y%checky%!" (
        set /a corner_hit=!corner_hit!+1
    )
    if not "!mapx%checkx%y%ccy_low%!"=="!mapx%checkx%y%checky%!" (
        set /a corner_hit=!corner_hit!+1
    )
    if not "!mapx%checkx%y%ccy_high%!"=="!mapx%checkx%y%checky%!" (
        set /a corner_hit=!corner_hit!+1
    )

::  Check if the current cell is empty, the player, marked by the map's FOV
::  marker already, or a wall.
    if "!mapx%checkx%y%checky%!"=="·" (
        set mapx%checkx%y%checky%=#
        goto :v_search
    ) else if "!mapx%checkx%y%checky%!"=="P" (
        goto :v_search
    ) else if "!mapx%checkx%y%checky%!"=="#" (
        goto :v_search
    ) else (
        set walltype=!mapx%checkx%y%checky%!
        call :draw_line
    )

```

## 4.3 Distance Calculation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Calculating the distance between two points on the scaled map isn't necessarily too difficult - however we can't use just the unmodified distance. If we do that, we'll be left with a, admittedly sort of cool, but undesirable fish-eye-lense effect. In order to circumvent this, we need to calculate the distance of the wall hits to the normal vector of the center of the player's FOV. I tried illustrating this, but I honestly can't do better than [this fabulous stack overflow answer's illustration](https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer).

### 4.3.1 Projection Calculation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I actually stumbled across the answer to this problem the very same day I encountered it while attending my Calculus 2 class. We can calculate our desired distance without using any trigonometric functions or floating point numbers by using [Equation 1](#eq1).
{% table id="eq1" %}
&nbsp;
{% /table %}
$$ d=\frac{\left|\hat{n}\cdot \hat{v}\right|}{\left|\left|\hat{n}\right|\right|} $$
where *d* is our desired distance, *n* is the vector denoting the center of the player's FOV, and *v* is the ray's vector. Equation 2 is Equation 1 with the mathematical symbols fully expanded.
{% table id="eq2" %}
&nbsp;
{% /table %}
$$ d=\frac{|n_{x}v_{x}+n_{y}v_{y}|}{\sqrt{n_{x}^{2}+n_{y}^{2}}} $$
where *n{% sub %}x{% /sub %}*, *n{% sub %}y{% /sub %}*, *v{% sub %}x{% /sub %}*, and *v{% sub %}y{% /sub %}* are the *x* and *y* components of their respective vectors. This method is extremely useful because *n* can be any scalar multiple of itself, where its distance does define the scale of the projection.

### 4.3.2 Center FOV Vector Calculation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We need to find both the vector for the center of the player's FOV, as well as it's distance. To do this, we simply take the x and y component yielded from the method described in 4.X.X at the left-mode angle + 45. These are stored as `nx` and `ny`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Now we need to find the length of these vectors. Batch does not have a built-in square root function, which is needed to find the hypotenuse of the right triangle created by the x and y components. So we'll use an implementation of the [Babylonian method of square roots](https://blogs.sas.com/content/iml/2016/05/16/babylonian-square-roots.html). This algorithm is ran for 30 iterations, which yields accurate enough results.
```batch
:find mid
::  Not all code is shown
    . . . 
::  Not all code is shown

::  Scale n
    set /a tnx=!nx!*!scale_half!
	set /a tny=!ny!*!scale_half!

::  Square n
	set /a tnx=!tnx!*!tnx!
	set /a tny=!tny!*!tny!

::  Add squared components of n
	set /a toberooted=!tnx!+!tny!

::  Babylonian square root algorithm.
	set /a high=2
	for /l %%x in (1, 1, 30) do (
		set /a low=!toberooted!/!high!
		set /a high=!low!+!high!
		set /a high=!high!/2
	)

::  Final distance of n
	set /a nh=!high!
```
### 4.3.2 Dot Product Calculation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
# 5. Conclusion





