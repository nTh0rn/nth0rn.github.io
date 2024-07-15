---
external: false
title: "Chess \"Engine\" (Batch)"
description: "A chess program written in Batch and abandoned."
tags: ["Chess", "Chess engine", "Engine", "Algorithm", "Batch"]
date: 2021-09-06
---
![](/images/chessbit/default.png)

[**Checkout the code for this over on GitHub**](https://github.com/nTh0rn/chessbit).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I made this in Batch with the intent of making it a full chess engine.
Rather quickly, I realized that Batch was not at all powerful enough
to run the computations needed to calculate future moves. This is as
far as I got before I moved making this project into another language.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In it's current version, it only sees whether or not the king is
checked only if the piece checking the king is on a lower row, or if
its on the same row, it'll only detect the check if its to the right
of the king. I don't plan on returning to this project and fixing this.
# How to use
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To move, type the coordinates of the piece you want to move and where
you want it to move to. For example:
```e2e4```

![](/images/chessbit/e2e4.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Upon opening, whoever's move it is is determined by who actually moves first.
This was done to avoid additional fen-parsing.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Still a pretty cool demo though in my opinion! I might someday write up a full article about the challenges of this project and how I approached legal-move calculation. So for now, I encourage you to look at the code if you're curious!

# Evaluation
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The evaluation only works by using piece-tables, obtained from [here](https://www.chessprogramming.org/Simplified_Evaluation_Function) (The Chess Programming Wiki is a goldmine, I highly recommend it.). Again, I was going to implement an actual chess-engine, and then I wised up.
![](/images/chessbit/eval.png)
## A statement on switch-statements and the goto function.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A lot of what I wanted to do when writing this program was use switch-statements and goto loops. Unfortunately, Batch does not have switch statements. What it does have, however, is a dynamic text system that allows you to imbed variables into variable names.

This means the following code:
```
switch(input) {
    case x:
        ...
        break;
    case y:
        ...
        break;
    case z:
        ...
        break;
}
```
In Batch, is written as this:
```
goto switch_%input%

:switch_x
    ...
    goto :eof
:switch_y
    ...
    goto :eof
:switch_z
    ...
    goto :eof
```
The bad news, however, is that when using the goto function in Batch, it doesn't just jump straight to the line that has that function. Instead, Batch immediately jumps to the start of the file and reads downward until it finds the function. That means loops or switch statements kept near the top of your code will run faster than if they were at the bottom of your code.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;I hope it is apparent now way I moved away from writing this in Batch. Be sure to check out the code for this over on [GitHub](https://github.com/nTh0rn/chessbit).