---
layout: post
title: "The Gaussian Integral, a Geometrically Annotated Proof"
tags: probability calculus integration
import_MathJax3: true
---
*More* **3d graphics** and *less* symbol manipulations really make this classic proof shine.

<!--more-->
#### Contents:
- [What's this all about](#whats-this-all-about)
- [Slice and dice](#slice-and-dice)
  - [First approach](#first-approach)
  - [Second approach](#second-approach)
- [Tying ends](#tying-ends)

<script defer="defer" src="\assets\jspacks\Gaussian-Integral.js"></script>

### What's this all about
<canvas class="centerme nlbig" id="Sketch0" height="200" width="400"></canvas>

**The white area up there** is the [Gaussian integral](https://en.wikipedia.org/wiki/Gaussian_integral),

$$\int_{-\infty}^{\infty}e^{-x^2}dx = \sqrt{\pi}.$$

Aside from popping up everywhere, this integral is worth talking about because the Gaussian $$e^{-x^2} $$ doesn't have an explicit anti-derivative: calculating the integral the usual way doesn't work (try [Wolfram Alpha](https://www.wolframalpha.com/input?i=integrate+e%5E%28-x%5E2%29)). So **how** do we know its value? start by thinking **outside the box**.

<canvas class="centerme nlbig" id="Sketch1" height="200" width="400"></canvas>

We collect **all the points that the spinning half bell touches** into a [solid of revolution](https://en.wikipedia.org/wiki/Solid_of_revolution), whose top is described by the functions

$$ x(r,\theta) = r\cos{\theta},$$

$$y(r,\theta) = r\sin{\theta},$$

$$z(r,\theta) = e^{-r^2}.$$ 

> Legend: 
> - $$ r\ \ \ \ \    = $$ How far along the right pointing arrow to go before taking it for a spin.
> - $$e^{-r^2} = $$  The height of the half bell above that point.
> - $$ \theta \ \ \ \ \ = $$ How far to rotate the bell.

### Slice and dice

Now, the crux of the calculation is looking at **the volume** of this solid from **two different points of view**.

#### First approach
This one is common practice for solids of revolution, nothing unique here. 

**Step 1:** Chop up the bell with the provided circular blades.

<figcaption class="centerme"> Move the slider to slice the 3d bell.</figcaption>
<canvas class="centerme newline" id="Sketch3" height="200" width="400"></canvas>

**Step 2:** Calculate the **area** of each slice. Look carefully and convince yourself that **each slice is a cylinder**. Also of note, if the radius of the cylinder is some value $$ r $$ then its height has to be $$ z = e^{-r^2}$$ (that's how high the bell goes at the distance $$ r $$ from the origin).  Conclude that

$$ \mathrm{Area\  of\  cylinder} = 2\pi re^{-r^2}.$$

**Step 3:** Sum up the **area of all the cylinders** and you get the **volume of the 3d bell** (this is [shell integration](https://en.wikipedia.org/wiki/Shell_integration)). There's a cylinder for every radius between $$ 0 $$ and $$ \infty $$ (I'm showing you just a select few of them up above), so the "sum" of the areas is

$$\int_{0}^{\infty}2\pi re^{-r^2}dr.$$

While $$ e^{-r^2} $$ doesn't have a nice anti-derivative, $$ re^{-r^2} $$ *does*, so we can calculate this integral the usual way.

$$\int_{0}^{\infty}2\pi re^{-r^2}dr = 2\pi\left.\frac{-e^{-r^2}}{2}\right|_0^\infty = \pi.$$

> **Side note:** these days, this part of the proof is usually obfuscated by a **substitution to polar coordinates**. It's interesting to note that the earliest renditions of this proof still had the solid of revolution front and center. See more [here](https://www.york.ac.uk/depts/maths/histstat/normal_history.pdf) (item #4, partly in French).

#### Second approach

We'll slice up the bell again, but this time we use a **different set of blades**.

<figcaption class="centerme"> Move the slider to slice the 3d bell.</figcaption>
<canvas class="centerme newline" id="Sketch2" height="200" width="400"></canvas>

It's no coincidence that **these slices look like 2d bells themselves**, since each slice is obtained by:
1. Fixing some $$ x $$ value (that's the line on the floor where the blade is positioned).
2. Sweeping over all possible $$ y $$'s: from $$ -\infty $$ to $$ \infty $$ (that's you moving the blade).
3. Collecting all points $$ (x,y,z) $$ between the floor and the top of the bell as we sweep.

Now, looking back at the definitions of $$ x,y $$ and $$ z $$, we get:

$$z = e^{-r^2} = e^{-(x^2+y^2)} = e^{-x^2}e^{-y^2}.$$

> $$r^2 = x^2+y^2$$ comes from applying a trig identity.

This, combined with having $$ x $$ fixed at some value means that the top of each slice is indeed **the original Gaussian**, $$ e^{-y^2}$$, scaled down by the constant $$e^{-x^2}$$.

 >This part only works with Gaussians, you usually won't get such nice expressions by slicing a random solid of revolution this way. See the math [here](https://www.unf.edu/~dbell/Poisson.pdf).

From here we just **follow the recipe of the first approach.**

**Step 2**: calculate the **area of each slice**. This time it's just the scaled down area of the original 2d bell,

$$ e^{-x^2}\int_{-\infty}^{\infty}e^{-y^2}dy.$$

**Step 3:** sum all the areas. we have slices for **all possible values of** $$ x $$, which goes from $$ -\infty $$ to $$ \infty $$, so the sum of all of them is

$$\int_{-\infty}^{\infty}e^{-x^2}dx\int_{-\infty}^{\infty}e^{-y^2}dy.$$

Renaming $$ y $$ as $$ x $$, we finally get a second expression for the volume:

$$\left(\int_{-\infty}^{\infty}e^{-x^2}dx\right)^2.$$

### Tying ends

We now know that **volume** of the 3d bell is the **square of the area** of the 2d bell. We also know from the first approach that **the volume is $$ \pi $$**, so we can finish the calculation:

$$\left( \int_{-\infty}^{\infty}e^{-x^2}dx \right)^2=\pi$$

$$\int_{-\infty}^{\infty}e^{-x^2}dx =\sqrt{\pi}.$$