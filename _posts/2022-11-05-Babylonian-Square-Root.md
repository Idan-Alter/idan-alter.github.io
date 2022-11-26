---
layout: post
title: "How Did They Calculate Square Roots in 1700 BCE?"
tags: Approximation Algorithms Geometry
import_MathJax3: true
import_p5_widget: true
import_p5_lib: true
---

The *Babylonian method* might be the first known algorithm for approximating square roots. In this post we're going to visualize its amazing geometric interpretation.

<!--more-->
#### Contents:
- [Exposition belongs on Wikipedia](#exposition-belongs-on-wikipedia)
- [But... Pythagoras was Greek!](#but-pythagoras-was-greek)
- [This is all you need to see, basically](#this-is-all-you-need-to-see-basically)
- [Final thoughts and random sqrt trivia](#final-thoughts-and-random-sqrt-trivia)

### Exposition belongs on Wikipedia
So, in case you're not aware, there's a Babylonian clay tablet from ~1700 BCE with an incredibly accurate approximation of $$ \sqrt{2} $$ written on it [\[Wiki\]](https://en.wikipedia.org/wiki/YBC_7289). This is a big thing: it seems like they knew it's just an approximation of (what we call today) an irrational number. More than 1,000 years later, the Pythagoreans allegedly drowned Hippasus because he rediscovered this fact [\[more Wiki\]](https://en.wikipedia.org/wiki/Hippasus). Obviously `Math.sqrt(2)` didn't exist yet, so how did they calculate it?


### But... Pythagoras was Greek!
To approximate $$ \sqrt{2} $$ like they do in Babylon we need to think like the ancients, and they were really big on **geometry**. What's $$ \sqrt{2} $$ in geometry? Well, the usual suspect is the hypotenuse of a right triangle with two legs of length 1.

Let's draw one in p5.js:
<script type="text/p5" data-height="300" data-preview-width="300">
createCanvas(210, 210);
background(220);
triangle(20, 80, 20, 180, 120, 180);
// The vertices of the triangle are:
// (20,80), (20, 180), and (120, 180). 
text('a', 60, 195);
text('b', 5, 130);
text('c', 70, 120);
</script>
Most of the numbers you see in this code point to locations in that gray canvas on the right. We start from the top-left and count in pixels. Since pixels are so small, let's say that 100 of them are worth one unit of length. Then, by the Pythagorean theorem,

$$ c^2 = a^2 + b^2 = 1^2+1^2 $$

$$ c = \sqrt{2}.$$

There are over 300 proofs of Pythagoras' theorem, and if you've seen a few of them you know that $$c^2$$ usually comes into play as the area of a square sitting on the hypotenuse. Da Vinci's proof is one example of this, expertly animated on [YouTube](https://www.youtube.com/watch?v=ZlGaQdNRdqA).

The Babylonian method is all about finding this **square** with area 2:

**Step 1:** start with a **rectangle** of area 2, but one with side lengths that you can actually calculate, like 1 for the short side and 2 for the long side.

<script type="text/p5" data-height="300" data-preview-width="300">
createCanvas(210, 210);
background(220);
let a = 1;
let b = 2;
rect(5, 5, a*100, b*100);
text('a', 50, 200);
text('b', 10, 105);
</script>

**Step 2:** the short side is obviously too short, so let's make it a bit bigger. How much bigger? Let's just split the difference.

<script type="text/p5" data-height="300" data-preview-width="300">
createCanvas(210, 210);
background(220);
let a = 1;
let b = 2;

//This is new:
let new_side = (a+b)/2;
rect(5, 5, new_side*100, b*100);
</script>
OK, but now the rectangle is too big! Its area is `new_side*b` and that's surely more than 2. Patience please, we're not done yet.

**Step 3:** shorten that long side so that the total area is still 2.

<script type="text/p5" data-height="330" data-preview-width="300">
createCanvas(210, 210);
background(220);
let a = 1;
let b = 2;

let new_side = (a+b)/2;

//Now this is new:
let new_side2 = 2/new_side;
rect(5, 5, new_side*100, new_side2*100);
</script>
Are the sides equal?
   - Yes? Congratulations, you just found a square of area 2. Conveniently, you also know its side length, `new_side`, that's your $$ \sqrt{2} $$. 
   - Oh, they're not? Then back to **Step 2:** make the short side a bit bigger...

### This is all you need to see, basically

Let's see the method in play. I already drew that first rectangle, it's up to you to make it <button onclick="updateSketch()">GO</button> (click a bunch of times). Also useful:  <button onclick="resetSketch()">RESET</button>

<figure class="centerme">
<div id  ="long_side"></div>
<div id  ="short_side"></div>
<div id="sketch_div"> </div>
<figcaption> You can run this sketch yourself in the <a href="https://editor.p5js.org/Idan-Alter/sketches/wEjTnaAz0">p5.js web editor </a>BTW.</figcaption>
</figure>
<script>
  let sqrt_sketch_fact = function (p) {
  p.a = 1;
  p.b = 2;
  p.scl = 120;
  p.shift = 5;
  p.bckgrnd = 220
  p.setup = function () {
    p.createCanvas(520, 250);
    p.background(220);
    p.rect(p.shift, 5, p.a * p.scl, p.b * p.scl);
    p.frameRate(1);
    p.noLoop()
  }
  p.iterate = function() {
    p.shift += p.a * p.scl;
    p.new_side = (p.a + p.b) / 2;
    p.new_side2 = 2 / p.new_side;

    p.a = p.min(p.new_side, p.new_side2);
    p.b = p.max(p.new_side, p.new_side2);

    if (p.shift + p.a * p.scl > p.width) {
      p.shift = 5;
      p.bckgrnd -= 50
      p.background(p.bckgrnd);
    }
    p.rect(p.shift, 5, p.a * p.scl, p.b * p.scl);
  }
};
  function ExtractSideLenghts(){
  long_side.innerHTML = `<code>long side = ` + sqrt_sketch.nfc(sqrt_sketch.b,15) +`<\code>`;
  short_side.innerHTML = `<code>short side = ` + sqrt_sketch.nfc(sqrt_sketch.a,15) +`<\code>`;
  }
  let sqrt_sketch = new p5(sqrt_sketch_fact,'sketch_div');
  ExtractSideLenghts()

  function resetSketch(){
  sqrt_sketch.remove()
  sqrt_sketch = new p5(sqrt_sketch_fact,'sketch_div');ExtractSideLenghts()
  }

  function updateSketch(){
  sqrt_sketch.iterate()
  ExtractSideLenghts()
  }
</script>


> Up for a challenge? Rewrite the code to calculate the square root of any given `x`. If you still draw squares after a few iterations, it works.
>
> Are you ***sure*** it works? Did you check with `x` smaller than 1?

### Final thoughts and random sqrt trivia

- We only used basic arithmetic for the calculations, cool huh? Even cooler is the fact that almost 4,000 years later, the algorithm behind `Math.sqrt(2)` is not *that much* different.
- Does it always work? Yes. Why? [\[Wiki\]](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method).
 - Look at this line of code:
    ```
    i  = * ( long * ) &y; // evil floating point bit level hacking
    ```
    This is part of the "Quake III" algorithm for the (inverse) square root, and it gets even better. I obviously can't write about approximating square roots without mentioning this immortal stroke of genius. Read up on it [\[Wiki\]](https://en.wikipedia.org/wiki/Fast_inverse_square_root), or watch this [great video](https://www.youtube.com/watch?v=p8u_k2LIZyo) if you're not afraid of C and its pointers, but at the very least, read this [xkcd comic](https://www.explainxkcd.com/wiki/index.php/664:_Academia_vs._Business).
- Did you know that the A series of paper sizes, which includes the GOAT, A4 paper, is designed such that the long side is exactly $$ \sqrt{2} $$ times the length of the short side. Why? It has to do with preserving the ratio when you fold it in half [\[Wiki\]](https://en.wikipedia.org/wiki/Paper_size#A_series).
