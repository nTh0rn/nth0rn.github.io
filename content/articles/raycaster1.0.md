---
external: false
title: "Ascii-Raycaster 1.0 (C++)"
description: "An ascii-based raycaster running in C++ in command prompt."
date: 2024-04-22
tags: ["Raycaster", "C++", "ascii graphics", "ascii", "terminal", "retro", "analog", "horror", "analog horror", "Glitching"]
---
#### Raycaster 1.0 demo
![](/videos/raycaster1.0/walking_newest.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pictured above is an early version of my ascii-based raycaster for my upcoming ascii-graphics analog horror game (see the post I made about the maze generation [here](/articles/mazegen)).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project has been one of my most exhausting yet, as this project has been my foray into C++. Skip to the end to read my thoughts on C++ as a whole, but in the meantime enjoy these videos showing the phases of development.
---
#### Current (not great) version of glitching and death
![](/videos/raycaster1.0/glitch3_and_death.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;One core mechanic of my game is the avoidance of an entity made of exclamation points that chases you through the maze. The more you look at the entity, the more your screen semi-permanently glitches. Shown above is the current implementation of glitching - and I'm not happy with it.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To see why, let's follow a quick timeline of this raycaster. First, let's look at the first functioning demo I got running.
#### First running version of raycaster
![](/videos/raycaster1.0/wrong_depth.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As you can probably tell, I had not yet figured out exactly how to calculate the depth of walls. This version of the raycaster lacked parallax depth, which honestly gave a pretty cool effect. I also wrote to the screen line-by-line at this point using ```cout << "";```, and *dear God* was it slow. As it turns out, writing 60 lines 30-60 times a second to the screen takes a *lot* out of C++. Basically, ```cout``` is very CPU intensive, which is why I eventually moved onto printing directly to the terminal-buffer. However, its this line-by-line approach that allowed for my favorite form of visual glitching.
#### First iteration of screen glitching
![](/videos/raycaster1.0/old_glitch.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To understand how this glitching works, you first need to understand a bit of how my program works.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Basically, all possible vertical columns that represent walls are stored horizontally as strings in a giant array that is referenced character-by-character when printing to the screen. The screen is glitched by replacing the characters that surround the top and bottom of walls in this array with unicode characters. In C++, unicode characters are stored in strings in the form ```\uAAA``` where AAA is the unicode identifier for the character. When printing the string as a whole, this is fine, but if you iterate through the string character-by-character, like I do, then the unicode identifying characters after the escape code could be anything. This causes the wonderful glitching.

#### Fixed wall-depth
![](/videos/raycaster1.0/fixed_depth.webp)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eventually I figured out how to propertly calculate the wall distances. Around this time I wonder moved away from printing text line-by-line and started writing to the buffer directly. The biggest downside of this is that the size of the buffer is a ```const``` determined at runtime (meaning the resolution cannot be changed while running) and the screen is stored as one giant 1D array.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;That's right, the whole screen is just a giant array that just wraps around the screen border when it reaches the edge. That means if you want to print to the coordinate x:0 y:1 and the width if your screen is 50 characters, you need to print to the 51st characters to wrap down to the next line. This destroyed any chance of emulating the original form of glitching. This means any glitching that occurs is going to push back any later text, causing awful skewing. I tried to implement the same form of unicode-corruption glitching anyways, as shown.

#### Second form of glitching
![](/videos/raycaster1.0/glitch2.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I honestly prefer this to the current form of glitching, but I fear it gives too much of a genuine headache from jittering.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the end, the thing that actually made me step away from this form of unicode-based corruption is that I wanted UI elements to exist on the screen. When corrupting the screen buffer, it also corrupted any UI elements, as it was impossible to know how exactly the glitching would offset later after the characters were interpretted by the console. This is why I settled on that earlier shown underwhelming form of glitching.

## Conclusion
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If there is one thing I can say about C++, its that in many respects coding in it was almost exactly like coding in most other languages,

***EXCEPT WHEN IT WASN'T***.

I honestly have never had a bigger headache than trying to setup my PC environment for C++ compilation. There are many ways to go about it, and when googling for help, you'll more often than not stumble across answers for every other method of compilation than the method you selected.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;By far, the worst part of working in C++, has been the online support. The vast majority of the time I went to Google a problem, the top result would be a forum post from over 15 years ago, where the top reply is someone telling the user that their question has already been answered and that they're stupid for not Googling it. Sometimes, if you're lucky, the top responder will just link to a thread actually answering the question - [but half the time that happens, the links are dead!](https://en.sfml-dev.org/forums/index.php?topic=6781.0)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have a careful eye, you may note that that linked article is for SFML, which would imply the use of graphics outside of the native C++ terminal. To my shame, it is true that I am moving away from the native terminal.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project was originally supposed to be written in Batch and ran in command-prompt, but in the face performance yielidng a consistent 0.1 frames per second, I was forced to adapt. Why I decided to go from Batch straight to C++? I have no clue. In the end, however, the native terminal graphics have not been suffecient for the level of graphical complexity that I want - **I still fully intend to use ascii-graphics though!** I just intend to visualize these ascii graphics using a more traditional graphics engine that does not fall prone to the downfalls of a genuine text-buffer based terminal.