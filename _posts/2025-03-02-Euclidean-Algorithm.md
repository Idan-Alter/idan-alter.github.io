---
layout: post
title: "How Did the Greeks Prove √2 Is Irrational?"
tags: Algebra algorithms geometry history
import_MathJax3: true
--- 
They used **Euclid's algorithm**. Saved you a click.
<!--more-->

#### Contents:
- [Euclid's algorithm](#euclids-algorithm)
- [A stopping problem](#a-stopping-problem)
- [Name dropping](#name-dropping)

### Euclid's algorithm
<script defer="defer" src="\assets\jspacks\EuclidsAlgorithm.js"></script>

> *When two unequal numbers are set out, and the less is continually subtracted in turn from the greater, if the number which is left never measures the one before it until a unit is left, then the original numbers are relatively prime.*
> 
> *Proposition VII.I, Euclid's Elements*

The original formulation is quite a mouthful, so here's a translation to code and a viz:
<div  id="root_1" ></div>


### A stopping problem

The modern form of this algorithm saves a few iterations and uses <span class="mycode">a mod b</span> instead of subtractions. This is also helpful since any self-respecting <span class="mycode">mod</span> function would throw an error when either number is not an integer. But then, what happens if one of them *is*? 

<div  id="root_2" ></div>

After two iterations, we get a rectangle with the same side proportions as the original one. Zoom in, and you're back to square one. 

Three books after describing it, Euclid says (in *Prop. X.2*) that if you call his <span class="mycode">gcd(a,b)</span> with <span class="mycode">b=1</span> and it goes infinite, then you've just proved that <span class="mycode">a</span> is irrational. Congrats.


### Name dropping
In one of Plato's dialogues, a young mathematician tells Socrates that his teacher Theodorus *"was drawing some figures"* to prove $$\sqrt{3},\sqrt{5}, \ldots, \sqrt{17}$$ were irrational, but at that *"he stopped"*.

That's everything Plato gave us to work with, but Benno Artmann had [an idea](https://link.springer.com/article/10.1007/BF01228045) for what exactly these *"figures"* might be...

Why did Theodorus stop at $$\sqrt{17}$$ and not go for $$ \sqrt{19} $$? Maybe these two facts had something to do with it:
1. You'd need six iterations of Euclid's algorithm to get a rectangle with side proportions you've seen before.
2. Its area would be 0.000004 of the original area. 
