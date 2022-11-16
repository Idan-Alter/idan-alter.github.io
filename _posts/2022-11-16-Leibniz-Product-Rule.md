---
layout: post
title: "The Geometry of Leibniz's Product Rule"
tags: calculus geometry
import_MathJax3: true
import_p5_lib: true
---

In high school you learned by rote how to calculate the derivative of *"f times g"*. In first year calculus you proved it mathematically. But can you say off the cuff why it *should* be true?
<!--more-->

Contents:
- [Credit where credit is due](#credit-where-credit-is-due)
- [This is going to be short](#this-is-going-to-be-short)
- [Bonus round](#bonus-round)

### Credit where credit is due

You know the rule, 

$$ (f\cdot g)^\prime = f^\prime \cdot g +f\cdot g^\prime .$$

It has a sweet geometric interpretation that we're going to make into a p5.js ([What's p5?]({% post_url 2022-11-01-JavaScript-Miscellanea %}#p5js)) interactive sketch here. This is pretty much general knowledge ([Wiki](https://en.wikipedia.org/wiki/Product_rule), [3Blue1Brown](https://www.3blue1brown.com/lessons/chain-rule-and-product-rule)), but I should mention I first saw it in a book by [Vladimir Arnol'd](https://en.wikipedia.org/wiki/Vladimir_Arnold). Arnol'd had a lot to say about how we teach math these days, and if what you see in this blog resonates with you, definitely check out his work.


### This is going to be short

Let's get to it. First, we draw $$ f\cdot g $$ as the **area** of a rectangle with sides $$ f $$ and $$ g $$ and imagine that both are actually some nice functions of $$ t $$. Something like this:

  <figure class="centerme">  
  <div id="fg"> </div>
  <figcaption class="centerme">
  Run this sketch yourself in the <a href="https://editor.p5js.org/Idan-Alter/sketches/0zK3E0gow">p5.js web editor</a>.
  </figcaption>
  </figure>

  <script>
  function skecth1(p) {
    p.f = (t) => Math.sqrt(t + 2);
    p.g = (t) => Math.sin(t);
    p.t = 0.2;
    p.setup = function () {
      p.createCanvas(350, 180);
      p.textSize(16);
    };
    p.draw = function () {
      p.background(220);
      let ft = 150 * p.f(p.t);
      let gt = 150 * p.g(p.t);
      p.t = p.t + 0.01;
      p.text("t = " + p.nfc(p.t, 2), p.width / 2 - 35, 20);
      p.translate(5, p.height - 5);
      p.scale(1, -1);
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(ft, 0);
      p.vertex(ft, gt);
      p.vertex(0, gt);
      p.endShape(p.CLOSE);
      p.scale(1, -1);
      p.textSize(16);
      p.text("f(t) = " + p.nfc(p.f(p.t), 2), ft / 2 - 30, -5);
      p.text("g(t) = " + p.nfc(p.g(p.t), 2), 5, -gt / 2);
      if (p.t >= 2.9) {
        p.t = 0.2;
      }
    };
  }
  let fgsketch = new p5(skecth1,"fg");
  </script>

Now, we freeze frame the sketch above, say at $$ t_0 = 0.7 $$, and scrub forward very slowly. I'll let you do it:


<figure class="centerme">  
<input type="range" min="0" max="1.2" value="0" step = "0.01" width ="100%" id="dt_range">
<div id="sketch2div"> </div>
<button onclick="addColor()">ADD COLOR</button>
<button onclick="removeColor()">REMOVE COLOR</button>
</figure>

<script>
function addColor(){
  sketch2obj.color_flag = true;
}

function removeColor(){
  sketch2obj.color_flag = false;
}

let slider = document.getElementById("dt_range");
slider.oninput = function() {
    sketch2obj.dt = parseFloat(slider.value);
};
</script>
<script>
sketch2 = function (p) {
  p.f = (t) => Math.sqrt(t + 2);
  p.g = (t) => Math.sin(t);
  p.t = 0.7;
  p.dt = 0;
  p.color_flag = false;

  p.setup = function () {
    p.createCanvas(350, 180);
    p.textSize(16);
  };

  p.ft = 150 * p.f(p.t);
  p.gt = 150 * p.g(p.t);

  p.draw = function () {
    p.background(220);
    p.text(
      "t = " + p.nfc(p.t, 2) + " + " + p.nfc(p.dt, 2),
      p.width / 2 - 50,
      20
    );

    p.translate(5, p.height - 5);
    p.scale(1, -1);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(p.ft, 0);
    p.vertex(p.ft, p.gt);
    p.vertex(0, p.gt);
    p.endShape(p.CLOSE);

    p.fdt = 150 * p.f(p.t + p.dt);
    p.gdt = 150 * p.g(p.t + p.dt);

    if (p.color_flag){
    p.push();
    p.fill("rgba(255,0,0,0.5)");
    p.beginShape();
    p.vertex(p.ft, 0);
    p.vertex(p.ft, p.gdt);
    p.vertex(p.fdt, p.gdt);
    p.vertex(p.fdt, 0);
    p.endShape(p.CLOSE);

    p.beginShape();
    p.vertex(0, p.gt);
    p.vertex(0, p.gdt);
    p.vertex(p.fdt, p.gdt);
    p.vertex(p.fdt, p.gt);
    p.endShape(p.CLOSE);

    p.fill(0);
    p.beginShape();
    p.vertex(p.ft, p.gt);
    p.vertex(p.ft, p.gdt);
    p.vertex(p.fdt, p.gdt);
    p.vertex(p.fdt, p.gt);
    p.endShape(p.CLOSE);
    p.pop();
    } else {
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0, p.gdt);
    p.vertex(p.fdt, p.gdt);
    p.vertex(p.fdt, 0);
    p.endShape(p.CLOSE);
    };
    p.scale(1, -1);
    p.text("f(t) = f(0.7) + " + p.nfc((p.fdt-p.ft)/150, 2), p.fdt / 2 - 65, -5);
    p.text("g(t) = g(0.7) + " + p.nfc((p.gdt-p.gt)/150, 2), 5, -p.gdt / 2);
  };
};
let sketch2obj = new p5(sketch2,"sketch2div");
</script>

How has the area $$ f(t)g(t) $$ changed? Put some color in that sketch and you'll see the added area conveniently divided into three small-ish rectangles:
  - The red one up top has long side $$ f(0.7) $$ and the short side is $$ g(t) - g(0.7),$$ AKA what's currently written up there after "g(t) = g(0.7) + ". The area then, is the product of the two.
  - Similarly, the red one to the right has area  $$ g(0.7) \cdot (f(t) - f(0.7)) $$.
  - That leaves the black area, but you can see right now that it's nothing in comparison to the red area, at least when  $$ t $$ is close to $$ 0.7 $$, so let's not bother with it anymore. 
    >This is not mathematically rigorous, but you're not here for rigor, are you? 

So we know by how much the area $$ f(t)g(t) $$ grew, but we're after the derivative, the **rate** of growth: per unit of $$ t $$, how much area did we get? Well, $$ t $$ grew by $$ t-0.7 $$ units of whatever, so after neglecting the black area, the rate is:

  $$\frac{\Delta\mathrm{Area}}{\Delta t}=\frac{f(0.7)(g(t)-g(0.7)) + g(0.7)(f(t)-f(0.7))}{t-0.7}.$$

Let me distribute the denominator, here:

$$\frac{\Delta\mathrm{Area}}{\Delta t}=f(0.7)\frac{g(t)-g(0.7)}{t-0.7} + g(0.7)\frac{f(t)-f(0.7)}{t-0.7}.$$


Now you see where it goes?  Take the limit $$ t\to 0.7 $$ and you get:

$$ (fg)^\prime = fg^\prime + gf^\prime.$$
  
>I should say that everything is evaluated at $$0.7$$, but obviously the result generalizes to any $$ t_0 $$.


To summarize in words what we've just shown:
- the rate of change of the entire area $$ fg $$ is (up to a negligible error) the rate of change of the red areas.
-  Each of these red rectangles grows **proportionally** to the length of only *one* of its sides, because the other one is fixed. The fixed side is the constant of proportionality.
-  The side lengths are $$ f $$ and $$ g $$, and they alternate roles between rectangles.

### Bonus round
It's worth mentioning that all of this works perfectly fine when one (or two) of $$ f$$, $$ g $$ is decreasing:

<figure class="centerme"> 

<div style="margin-bottom: 5px;">
<button onclick="sketch3go()">GO \ STOP</button>
</div>
<div id="sketch3div"> </div>
<figcaption class="centerme">
The code is <a href="https://editor.p5js.org/Idan-Alter/sketches/b_1K-6Sr1">here</a>.
</figcaption>
</figure>

This time we need to *subtract* the blue area. Conveniently, $$ g^\prime $$ is negative, so the formula stays the same.

<script>
  gostoptoggle = true;
function sketch3go(){
  if (gostoptoggle){
    sketch3obj.loop()
  } else {
    sketch3obj.noLoop()
  }
  gostoptoggle = !gostoptoggle;
}
function sketch3(p){
 
p.f = (t) => Math.sqrt(t + 2);
p.g = (t) => Math.sin(t);
p.t = 1.7;
p.dt = 0;

p.setup = function() {
  p.createCanvas(350, 180);
  p.textSize(16);
  p.noLoop()
};

p.ft = 150 * p.f(p.t);
p.gt = 150 * p.g(p.t);
p.draw = function() {
  p.background(220);
  p.text("t = " + p.nfc(p.t, 2) + " + " + p.nfc(p.dt, 2), p.width / 2 - 70, 20);

  p.translate(5, p.height - 5);
  p.scale(1, -1);
  p.beginShape();
  p.vertex(0, 0);
  p.vertex(p.ft, 0);
  p.vertex(p.ft, p.gt);
  p.vertex(0, p.gt);
  p.endShape(p.CLOSE);

  p.fdt = 150 * p.f(p.t + p.dt);
  p.gdt = 150 * p.g(p.t + p.dt);

  p.push();
  p.fill("rgba(255,0,0,0.5)");

  p.beginShape();
  p.vertex(p.ft, 0);
  p.vertex(p.ft, p.gdt);
  p.vertex(p.fdt, p.gdt);
  p.vertex(p.fdt, 0);
  p.endShape(p.CLOSE);

  p.fill("rgba(0,0,255,0.5)");
  p.beginShape();
  p.vertex(0, p.gt);
  p.vertex(0, p.gdt);
  p.vertex(p.fdt, p.gdt);
  p.vertex(p.fdt, p.gt);
  p.endShape(p.CLOSE);

  p.fill(0);
  p.beginShape();
  p.vertex(p.ft, p.gt);
  p.vertex(p.ft, p.gdt);
  p.vertex(p.fdt, p.gdt);
  p.vertex(p.fdt, p.gt);
  p.endShape(p.CLOSE);
  p.pop();

  p.scale(1, -1);
  p.text("f(t) = f(1.7) + " + p.nfc((p.fdt-p.ft)/150, 2), p.fdt / 2 - 30, -5);
  p.text("g(t) = g(1.7) - " + p.nfc((p.gt-p.gdt)/150, 2), 5, -p.gdt / 2);
  p.dt = p.dt + 0.006;
  if (p.dt > 0.6) {
    p.dt = 0;
  };
};
}
let sketch3obj = new p5(sketch3, "sketch3div")
</script>