---
external: false
title: "Ascii-Raycaster 1.0 (C++)"
description: "An ascii-based raycaster running in C++ in command prompt."
date: 2024-01-22
tags: ["Raycaster", "C++", "ascii graphics", "ascii", "terminal", "retro", "analog", "horror", "analog horror", "Glitching"]
---
#### Raycaster 1.0 demo
![](/videos/raycaster1.0/walking_newest.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pictured above is an early version of my ascii-based raycaster for my upcoming untitled ascii-graphics analog horror game (see the post I made about the maze generation [here](/articles/mazegen)).
---
#### Current (not great) version of glitching and death
![](/videos/raycaster1.0/glitch3_and_death.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;One core mechanic of my game is the avoidance of an entity made of exclamation points that chases you through the maze. The more you look at the entity, the more your screen semi-permanently glitches. Shown above is the current implementation of glitching - and I'm not happy with it.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To see why, let's follow a quick timeline of this raycaster. First, let's look at the first functioning demo I got running.
#### First running version of raycaster
![](/videos/raycaster1.0/wrong_depth.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As you can probably tell, I had not yet figured out exactly how to calculate the depth of walls. This version of the raycaster lacked parallax depth, which honestly gave a pretty cool effect. I also wrote to the screen line-by-line at this point using ```cout```, and *boy* was it slow. As it turns out, writing 60 lines 30-60 times a second to the screen takes a *lot* out of C++. ```cout``` is very CPU intensive, which is why I eventually moved onto printing directly to the terminal-buffer. However, its this line-by-line approach that allowed for my favorite form of visual glitching.
#### First iteration of screen glitching
![](/videos/raycaster1.0/old_glitch.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To understand how this glitching works, you first need to understand a bit of how my program works.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Basically, all possible vertical columns that represent walls are stored horizontally as strings in a giant array that is referenced character-by-character when printing to the screen. The screen is glitched by replacing the characters that surround the top and bottom of walls in this array with unicode characters. In C++, unicode characters are stored in strings in the form ```\uAAA``` where AAA is the unicode identifier for the character. When printing the string as a whole, this is fine, but if you iterate through the string character-by-character, like I do, then the unicode identifying characters after the escape code could be anything. This causes the wonderful glitching.

#### Fixed wall-depth
![](/videos/raycaster1.0/fixed_depth.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eventually I figured out how to propertly calculate the wall distances. Around this time I wonder moved away from printing text line-by-line and started writing to the buffer directly. The biggest downside of this is that the size of the buffer is a ```const``` determined at runtime (meaning the resolution cannot be changed while running) and the screen is stored as one giant 1D array.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This destroyed any chance of emulating the original form of glitching. This means any glitching that occurs is going to push back any later text, causing awful skewing. I tried to implement the same form of unicode-corruption glitching anyways, as shown.

#### Second form of glitching
![](/videos/raycaster1.0/glitch2.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I honestly prefer this to the current form of glitching, but I fear it gives too much of a genuine headache from jittering.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the end, the thing that actually made me step away from this form of unicode-based corruption is that I wanted UI elements to exist on the screen. When corrupting the screen buffer, it also corrupted any UI elements, as it was impossible to know how exactly the glitching would offset later after the characters were interpretted by the console. This is why I settled on that earlier shown underwhelming form of glitching.

## Conclusion
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project was originally supposed to be written in Batch and ran in command-prompt, but in the face performance yielidng a consistent 0.1 frames per second, I was forced to adapt . . .

**EDIT 05/26/24.** While writing up an article on my [Batch raycaster](/articles/batch_raycaster), I actually implemented many fixes that greatly increased its rendering speed.

. . . Why I decided to go from Batch straight to C++? I have no clue. In the end, however, the native terminal graphics have not been suffecient for the level of graphical complexity that I want - **I still fully intend to use ascii-graphics though!** I just intend to visualize these ascii graphics using a more traditional graphics engine that does not fall prone to the downfalls of a genuine text-buffer based terminal.