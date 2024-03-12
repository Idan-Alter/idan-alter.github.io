---
layout: post
title: "u-Substitution: My Very First Pullback"
tags: Analysis Integration
import_MathJax3: true
--- 
You usually hear about **pullbacks** in advanced calculus, but we've already snuck one by you in calc 1. Let me show you where.
<!--more-->
#### Contents:
- [The setup](#the-setup)
- [Going fast](#going-fast)
- [Pullbacks galore](#pullbacks-galore)
- [Reverse chain rule](#reverse-chain-rule)

<script type="module" crossorigin src="\assets\jspacks\u-Substitution\index-0a23f6bd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
<style>
.prevent-select .katex {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  white-space: nowrap
}
</style>

### The setup

1. Walk along the $$ x $$ axis. 
2. Stop for a sec every once in while and calculate $$ f(x) $$. 
3. Sum up the areas of some (red) rectangles. 
4. Do step 2. often enough and you get

    $$ \int_{a}^{b}f(x)dx \approx \sum f(x_i)\Delta x_i.$$

Try it out live:

<div id="root_0" ></div>

### Going fast 

Stopping every $$ \Delta t_i $$ seconds (this is the *once in a while* from step 2.) is really easy, just keep an eye on your watch. On the downside, there's the side effect that the **rectangle bases are uneven** when we speed up or slow down. We can fix the aesthetics by **bringing time front and center**.

<div id="root_1" ></div>

Somewhat surprisingly, the blue and the red rectangles give us different numbers. **What went wrong?** We slowed down at the top to look at the view, but the relevant **blue rectangle doesn't know** we haven't moved much during his $$ \Delta t_i $$ (*Time waits for no one*...). Conveniently, his **red friend knows exactly** how much we moved during that time, it's his $$ \Delta x_i $$. 

>You might want to **click a rectangle** up there right now.

Let's redo the sum **with this new information.**

<div id="root_2" ></div>


This time, each blue rectangle reminded us how much $$ x $$ we moved during his $$ \Delta t_i $$. **It momentarily expanded\contracted to the right size** by multiplying its base by $$ \frac{\Delta x_i}{\Delta t_i} $$ and then snapped back once we were done with it. this gave us the right number:

$$\sum f(x(t_i))\frac{\Delta x_i}{\Delta t_i}\Delta t_i = \sum f(x_i)\Delta x_i.$$

At the limit $$ \Delta t_i \to 0 $$ this becomes **integration by substitution:**

$$\int_{x^{-1}(a)}^{x^{-1}(b)}f(x(t))x^\prime (t)dt = \int_{a}^{b}f(x)dx.$$


### Pullbacks galore
We moved geometric information (about lengths of $$ \Delta x_i $$'s) from the world of $$ x $$ back to the world of $$ t $$. The jargon for this is **pullback** and it shows up everywhere once you start looking. **Start looking here:**
- You've used a map with a scale, so now you know. In this case the map pulls back lengths from the actual world to the paper it's printed on.

    <div class="centerme">
    <img style="width: 200px" src="/assets/imgs/Map_scale_-_8km,_5mi.png" alt="Map Scale" />
   <figcaption>A pullback</figcaption>
   </div>
- for really good maps, this 1d scale doesn't cut it anymore. You need to pull back a **metric tensor**. The first 10 mins of this [video](https://www.youtube.com/watch?v=TvFvL_sMg4g) are a great intro, though it picks up speed afterwards. 
- [Steve Mould](https://youtu.be/wk67eGXtbIw?t=369) has some other, physics inspired examples. 

### Reverse chain rule
Summing rectangles is cute, but you should check out the proof [[Wiki]](https://en.wikipedia.org/wiki/Integration_by_substitution#Proof). It's a **one liner** using the chain rule:

$$ \frac{df}{dt}=\frac{df}{dx}\frac{dx}{dt}.$$

You understand this one intuitively if you've ever switched gears in a car. If not, check out the viz [here](https://webspace.ship.edu/msrenault/geogebracalculus/derivative_intuitive_chain_rule.html). 


