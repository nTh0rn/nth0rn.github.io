---
external: false
title: "Ascii Raycaster Game (C++)"
description: "An ascii-based raycaster running in C++"
date: 2024-01-22
tags: ["Raycaster", "C++", "ascii graphics", "ascii", "terminal", "retro", "analog", "horror", "analog horror", "Glitching"]
---

# Table of Contents
1. [Intro](#1.-intro)
2. [Showcase](#2.-showcase)
3. [Conclusion](#3.-conclusion)


# 1. Intro
{% center_pic_width url="/videos/raycaster1.0/walking_newest.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This article serves as a showcase of my first ever C++ project, a ascii-based raycaster horror game, pictured above. I have no plan to publish any source code or a playable version of this game, as it was nothing but a fun experiment. See also my article [Maze Generation and Pathfinding](/articles/mazegen) which is related to this project.

# 2. Showcase
{% center_pic_width url="/videos/raycaster1.0/glitch3_and_death.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;One core mechanic of my game is the avoidance of an entity made of exclamation points that chases you through the maze. The more you look at the entity, the more your screen semi-permanently glitches. Shown above is the enemy chasing you, the final form of glitching, and the death screen - and I'm not particularly happy with it.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To see why, let's follow a quick timeline of this raycaster. First, let's look at the first functioning demo I got running.

{% center_pic_width url="/videos/raycaster1.0/wrong_depth.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As you can probably tell, I had not yet figured out exactly how to calculate the depth of walls. This version of the raycaster lacked perfect parallax depth, which honestly gave a pretty cool effect.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I wrote to the screen line-by-line at this point just using ```cout```, and *boy* was it slow. As it turns out, writing 60 lines 30-60 times a second to the screen takes a *lot* out of C++. ```cout``` is very CPU intensive, which is why I eventually started printing directly to the terminal-buffer. However, its this line-by-line approach that allowed for my favorite form of visual glitching.

{% center_pic_width url="/videos/raycaster1.0/old_glitch.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To understand how this glitching works, you first need to understand a bit about how my initial raycaster worked.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All possible vertical columns that represent walls are stored horizontally as strings in a giant array that is referenced character-by-character when printing to the screen. The screen is glitched by replacing the characters that surround the top and bottom of walls in the strings in this array with unicode characters instead of ascii characters.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unicode characters are of the form "```\uAAA```" where "`AAA`" is the identifier for the character. Unicode characters are interpretted at runtime by the console, but iterated over character-by-character in my raycaster like normal ascii text. This causes a mish-mash of unicode misinterpretation in the console at runtime, causing this wonderful glitching.

{% center_pic_width url="/videos/raycaster1.0/fixed_depth.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eventually I figured out how to propertly calculate the wall distances. Around this time I moved away from printing text line-by-line and started writing to the buffer directly. The biggest downside of this is that the size of the buffer is a ```const``` determined at runtime (meaning the resolution cannot be changed while running) and the screen is stored as one giant 1D array.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This means any glitching that occurs is going to push back any later text, causing this skewing effect shown below. I still also tried to implement the same form of unicode-corruption glitching that I preferred from before with little success. I also moved all calculations done for visuals to a seperate thread to increase performance.

{% center_pic_width url="/videos/raycaster1.0/glitch2.webp" wid="70%" /%}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I honestly prefer this to the most recent form of glitching, but I fear it gives too much of a genuine headache from jittering.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the end, the thing that actually made me step away from this form of unicode-based corruption is that I needed UI elements to exist on the screen. When corrupting the screen buffer, it also corrupted any UI elements, as it was impossible to know what would end up being offset after the characters were interpretted by the console. This is why I settled on that earlier shown form of glitching.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eventually I got a fully functioning settings menu, a warning indicator for how near the monster is, and a debug HUD that displays things like the framerate across the main thread, pathfinding thread, and screen thread. These can be seen in the [first](#1.-intro) and [second](#2.-showcase) videos in this article.

# 3. Conclusion
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project ended up being a very fun way to learn C++. As stated in the [intro](#1.-intro), I do not intend to publish any playable version of this game or any of its source code. I actually worked on this raycaster inbetween also working on my [Integer-only Raycaster (Batch)](/articles/batch_raycaster), which tackles many of the same challenges from this project and does have publicly viewable code.