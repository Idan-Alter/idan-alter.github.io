---
layout: post
title: "Discovering Euler's Formula Like a Physicist"
tags: approximation complex-numbers
import_MathJax3: true
---

Euler's identity is widely regarded as the prime example of **mathematical beauty**. In this post we'll rediscover it using high school math and a bit of common sense.
<!--more-->

#### Contents:
- [Euler's formula and Euler's identity](#eulers-formula-and-eulers-identity)
- [How do we calculate $$e^x$$?](#how-do-we-calculate-ex)
- [OK, we're good with $$e^x$$, but what does $$e^{ix}$$ *even mean*?](#ok-were-good-with-ex-but-what-does-eix-even-mean)
- [This is what you've come to see](#this-is-what-youve-come-to-see)
- [What's next?](#whats-next)


<script>
  function makeGrid(p,origin, v0, v1, myColor) {
    p.push();
    p.stroke(myColor);
    p.strokeWeight(0.5)
    
    let up = origin.copy();
    let down = origin.copy();
    
    let v1mega = v1.copy().setMag(10 ** 4 * p.max(p.width, p.height));
    
    for (let k = 0; k <= 15; k++) {
      
      let upv1 = p5.Vector.add(up, v1mega);
      let downv1 = p5.Vector.sub(up, v1mega);
      p.line(upv1.x, upv1.y, downv1.x, downv1.y);
        // I should calculate here the intersection of the line with the canvas, but taking a huge step up and down the line will usually cover the entire visible area. it's a hack, but it works.
      
      up.add(v0);
  
      upv1 = p5.Vector.add(down, v1mega);
      downv1 = p5.Vector.sub(down, v1mega);
      p.line(upv1.x, upv1.y, downv1.x, downv1.y);
      down.sub(v0);
    }
    p.pop();
  }
</script>

### Euler's formula and Euler's identity

You're here, so you probably know the identity is

$$e^{i\cdot\pi}+1=0.$$

It ties up all the mathematical constants we know from high school, namely $$0,1,e,\pi$$ and $$i=\sqrt{-1}$$ in one surprisingly neat formula. What's even more surprising is that this *identity* is effectively a special case of Euler's *formula*:

$$
e^{i\cdot x}=\mathrm{cos}(x)+i\cdot\mathrm{sin}(x).
$$

>Don't see it?
>Plug in $$x=\pi$$ and remember that $$\mathrm{cos}(\pi)=-1, \mathrm{sin}(\pi)=0.$$

You could argue that this one is even more beautiful: the trig functions also make an appearance now. Richard Feynman went as far as to say that it's *"the most remarkable formula in mathematics"*, but only after [having shown](https://www.feynmanlectures.caltech.edu/I_22.html) experimentally that the formula is actually true. What I'm going to show you is heavily inspired by his take on the matter, but today **you'll help me do the experiment**.


### How do we calculate $$e^x$$?

Using `Math.exp(x)` would be cheating! But no worries, there's a way to do it using only:

1. An estimate of $$e$$. $$2.718$$ is good enough for me, but go ahead and use something better.
2. Square roots (If the *Babylonians* [could do it]({% post_url 2022-11-05-Babylonian-Square-Root %}), so can we).
3. The exponent rules: 

    $$e^{a+b}=e^{a}\cdot e^{b},$$

    $$ (e^{a})^{b}= e^{a \cdot b}. $$

Let's calculate $$e^{3.626}$$ as an example. Start by rewriting the exponent:

$$
3.626 = 3 + 625/1000 + 1/1000.
$$

>Why are we even doing this? Give me a sec. 

Make sure you notice that 

$$625/1000 = 5/8,$$

which gives:

$$
e^{3.626} = e^{3\ +\ 5/8 \ +\ 1/1000} = e^{3}\cdot e^{5/8}\cdot e^{1/1000}.
$$

We can more or less easily calculate the three multiplicands on the right, but each requires his own treatment:

1. $$e^{3}=e\cdot e \cdot e \approx 2.718 \cdot 2.718 \cdot 2.718 \approx 20.08.$$ 
   >If you ever need a more accurate result, just plug in that fancier estimate of $$e$$ you've got.

2. For $$e^{5/8}$$, we need to know $$e^{1/8}$$ first, which we calculate by taking the square root three times in succession:

    $$
    e^{1/8} = \sqrt{e^{1/4}} = \sqrt{\sqrt{e^{1/2}}} = \sqrt{\sqrt{\sqrt{e}}} \approx
    $$

    $$ \approx \sqrt{\sqrt{\sqrt{2.718}}} \approx 1.133. $$

    Now we just multiply this number by itself five times:

    $$
    e^{5/8}=(e^{1/8})^{5}\approx 1.133^{5} \approx 1.867.
    $$

3. Finally, $$1/1000$$ is so small that we can just say
   $$
   e^{1/1000}\approx e^{0} = 1.
   $$
    > In case $$1/1000$$ is not so small after all, can you think of a way to get an even better estimate here? Hint: $$1/1000 = 1/1024 + 3/128000 $$.

Putting everything together, we get 

$$e^{3.626} \approx  20.08\cdot 1.867 \approx 37.49,$$

and as I hinted above, we can get as close as we want to the actual value with better approximations and more of the same work.

This example should make it clear that numbers like $$e^{5/8}=e^{5/2^{3}}$$ play a big role here: they're **the only ones we can actually calculate!** Let's go about this methodically and find a bunch of these all at once. Specifically, I want the values of:

$$
e^{0/16},\ e^{1/16},\ e^{2/16}, \ldots,\ e^{3}.
$$

You can run the following code in the [p5.js web editor](https://editor.p5js.org/Idan-Alter/sketches/nrNKniKQY), or, you know, just take my word for it.
{% highlight js %}
const e = 2.718281828459045;
let kth_sq_root = e;
for (let k = 1; k <= 4; k++) {
  kth_sq_root = Math.sqrt(kth_sq_root);
  console.log(kth_sq_root);
}
{% endhighlight %}

In every iteration of the loop we calculate another square root of $$ e $$, till we get to $$ e^{1/16} $$:

```
1.6487212707001282
1.2840254166877414
1.1331484530668263
1.0644944589178595
```

Now we take that last number and calculate

$$e^{2/16}=e^{1/16}\cdot e^{1/16} \approx 1.064 \cdot 1.064.$$

Using this result we get the next one,

$$e^{3/16}=e^{2/16}\cdot e^{1/16} \approx 1.064 \cdot 1.064 \cdot 1.064,$$

and so on.
{% highlight js %}
let x = [];
let ex = [];
let current = 1;
for (let k = 1; k <= 3 * 16; k++) {
  x.push(k / 16);
  ex.push(current);
  current = current * kth_sq_root;
}
{% endhighlight %}
plotting `ex` against `x`, we get:

<div id="x_ex_scatterplot"></div>
<script src="https://cdn.plot.ly/plotly-2.16.1.min.js"></script>
<script>
let e = 2.718281828459045;
let roots_of_e = [e];
kth_sq_root = e;
for (let k = 1; k <= 4; k++) {
  kth_sq_root = Math.sqrt(kth_sq_root);
  roots_of_e.push(kth_sq_root);
}

let x = [];
let ex = [];
let current = 1;

for (let k = 1; k <= 3 * 16; k++) {
  x.push(k / 16);
  ex.push(current);
  current = current * kth_sq_root;
}

var trace = {
  x: x,
  y: ex,
  mode: 'markers',
  type: 'scatter'
};

Plotly.newPlot('x_ex_scatterplot', [trace]);
</script>

You're saying: *"that's just $$e^{x}$$, I've seen it before, what's the big deal?"* You just did all the calculations here by "hand", take it in.

This isn't the end of it. We could fill in the blanks in the figure by taking $$ e^{1/32} $$ as `kth_sq_root` and we could run the loop a bit longer to go past $$ x=3 $$. **In short**, we know how to find $$ e^x $$ for any $$ x\ge0 $$, up to any desired accuracy.

 What about $$ e^{-x} $$?  That one's easy: $$e^{-x}=1/e^{x}.$$


  > If you feel like it, change the code above to calculate
  >
  > $$
e^{-1},\ldots,\ e^{-1/2^{10}},\ e^{0},\ e^{1/2^{10}},\ldots,\ e^{1}.
$$


### OK, we're good with $$e^x$$, but what does $$e^{ix}$$ *even mean*?

Obviously you *felt like it*, so I'm assuming you've seen this:

| $$k$$ | $$x=k/2^{10}$$ | $$e^{x}$$ |
| :---: | :------------: | :-------: |
|   1   |    0.000976    | 1.000977  |
|   2   |    0.001953    | 1.001955  |
|   3   |    0.002929    | 1.002933  |
|   4   |    0.003906    | 1.003913  |
|  ...  |      ...       |    ...    |
|  50   |    0.048828    | 1.050040  |

Did you notice the pattern though? It looks like 

$$e^x\approx1+x$$

is a really good approximation for small values of $$x$$, but it gets worse very fast as $$x$$ increases. This should come as no surprise to you if you've had some calculus. Otherwise, here's a proof by graphics:


<div id="1+x_vs_ex_lineplot"></div>
<script>
let x1 = [];
let ex1 = [];
let tangent = [];
let current_x = -1;
let num_samp = 10 ** 3;
let spacing = 2 / num_samp;
for (let k = 0; k <= num_samp; k++) {
  x1.push(current_x);
  ex1.push(Math.exp(current_x));
  tangent.push(1 + current_x);
  current_x = current_x + spacing;
}
  var trace1 = {
  x: x1,
  y: ex1,
  mode: 'line',
  type: 'scatter',
  name: 'e^x'
};
  var trace2 = {
  x: x1,
  y: tangent,
  mode: 'line',
  type: 'scatter',
  name: '1+x'
};
Plotly.newPlot('1+x_vs_ex_lineplot', [trace1,trace2]);
</script>

How does this apply to $$ e^{ix} $$? Well, the thing is, if $$ x \approx 0$$, then by multiplying both sides by $$ i $$ we get 

$$ i \cdot x \approx i\cdot 0 = 0$$

$$ ix \approx 0.$$


Now, we just said $$e^x\approx1+x$$ for small $$ x $$, and we just saw that $$ ix $$ is also small, so I'll go out on a limb and guess that 

$$ e^{ix} \approx 1+ix$$

is good (when $$ x $$ is not too large). We still have no idea what $$ e^{ix} $$ means in general, but having written the rest of this post already, I can tell you that we don't need anything more to see **Euler's formula materialize**.

### This is what you've come to see 

The recipe is as follows: 

1. $$ 0.1 $$ is a small number, so say that 
    
    $$ e^{0.1i} \approx 1+0.1i.$$ 

2. Use the exponent rule a lot:
   - \$$e^{0.2i} = e^{0.1i}\cdot e^{0.1i} \approx (1+0.1i)\cdot (1+0.1i)$$
   - \$$e^{0.3i} = e^{0.2i}\cdot e^{0.1i} \approx (1+0.1i)\cdot (1+0.1i)\cdot (1+0.1i)$$
   - \$$e^{0.4i} = e^{0.3i}\cdot e^{0.1i} \approx (1+0.1i)\cdot (1+0.1i)\cdot (1+0.1i)\cdot (1+0.1i)$$
      
      $$\vdots$$

Doesn't sound too complicated right? We just need to keep track of which number we've just calculated and keep on multiplying with $$1+0.1i$$:
 
 $$ (a+ib)(1+0.1i) = a-0.1b +i(0.1a+b).$$

In code it should look like this:
{% highlight js %}
// e^(0.1ni) = a_n + ib_n
const a_0 = 1;
const b_0 = 0;

iterate = function (a_n,b_n) {
  const a_n1 = a_n - 0.1*b_n;
  const b_n1 = 0.1*a_n + b_n;
  return [a_n1,b_n1]
}
{% endhighlight %}

The rest is just graphics.

<div class="centerme">
<button onclick="animateIterations()">ITERATE ONCE</button>
<button style="margin-bottom: 5px" onclick="animateIterations_10()">ITERATE 10 TIMES</button>
<button style="margin-bottom: 5px" onclick="animateIterations_reset()">RESET</button>
<div style="text-align: center;" id="complex_plane"> </div>
<figcaption>Check out the code for this sketch <a href="https://editor.p5js.org/Idan-Alter/sketches/2jIbqBVp9">here</a>.</figcaption>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.js"></script>

<script>
  let sketch_e01 = function (p) {
  p.x = 0.1;
  // e^ix = 1 + ix = a +ib
  p.a = 1;
  p.b = p.x;
  p.a_n = 1;
  p.b_n = 0;
  // e^inx = a_n + ib_n
  p.iterate = function () {
    return [p.a_n * p.a - p.b_n * p.b, p.a_n * p.b + p.b_n * p.a];
  };
  p.setup = function () {
    p.createCanvas(300, 300);
    p.background(220);
    p.fill(0);
    p.line(p.width / 2, 0, p.width / 2, p.height);
    p.line(0, p.height / 2, p.width, p.height / 2);
    p.translate(p.width / 2, p.height / 2);
    p.textSize(18);
    p.text("1", 85, 25);
    p.text("i", -15, -80);
    p.scale(1, -1);
    p.strokeWeight(7);
    p.point(100, 0);
    p.point(0, 100);
    p.origin = p.createVector(0,0);
    p.v0 = p.createVector(0,50);
    p.v1 = p.createVector(50,0);
    makeGrid(p,p.origin, p.v0, p.v1,"rgba(0,0,0,0.3)");
    makeGrid(p,p.origin, p.v1, p.v0,"rgba(0,0,0,0.3)");
  };
}
let p5complex_plane = new p5(sketch_e01,'complex_plane');
</script>

<script>
  flag_first = true;
  function animateIterations_reset(){
    flag_first = true;
    p5complex_plane.remove();
    p5complex_plane = new p5(sketch_e01,'complex_plane');
  }
  function animateIterations(){
    if (flag_first === true) {
      p5complex_plane.remove();
      p5complex_plane = new p5(exponentIterations,'complex_plane');
      flag_first = false;
    }
    p5complex_plane.draw_one();
  }
  function animateIterations_10(){
    if (flag_first === true) {
      p5complex_plane.remove();
      p5complex_plane = new p5(exponentIterations,'complex_plane');
      flag_first = false;
    }
    for (let k = 0; k<=9;k++) {
      p5complex_plane.draw_one();
      p5complex_plane.redraw();
    };
  }

  let exponentIterations = function (p) {
  p.x = 0.1;
  // e^ix = 1 + ix = a +ib
  p.a = 1;
  p.b = p.x;
  p.a_n = 1;
  p.b_n = 0;
  // e^inx = a_n + ib_n
  p.iterate = function () {
    return [p.a_n * p.a - p.b_n * p.b, p.a_n * p.b + p.b_n * p.a];
  };
  p.setup = function () {
    p.createCanvas(300, 300);
    p.background(220);
    p.line(p.width / 2, 0, p.width / 2, p.height);
    p.line(0, p.height / 2, p.width, p.height / 2);
    p.origin = p.createVector(p.width / 2,p.height/2);
    p.v0 = p.createVector(0,50);
    p.v1 = p.createVector(50,0);
    makeGrid(p,p.origin, p.v0, p.v1,"rgba(0,0,0,0.3)");
    makeGrid(p,p.origin, p.v1, p.v0,"rgba(0,0,0,0.3)");
  };
  p.draw = function (){
  }
  p.draw_one = function () {
    e_inx = p.iterate();
    p.a_n = e_inx[0];
    p.b_n = e_inx[1];
    p.translate(p.width / 2, p.height / 2);
    p.scale(1, -1);
    p.scale(100); 
    p.strokeWeight(1 / 20);
    p.point(p.a_n, p.b_n);
  };
};
</script>

Cool spiral... But how does this relate to Euler's formula? We just drew (what we believe to be) **the left hand side of**

$$
e^{ix}=\mathrm{cos}(x)+i\cdot \mathrm{sin}(x),\ \ x = 0,0.1,0.2,..
$$ 

Let's compare it head to head with the RHS. We need to keep track of the iteration number, `n`, and calculate

{% highlight js %}
cos_n = cos(n*0.1)
sin_n = sin(n*0.1)
{% endhighlight %}

I've colored these points red here:

<div class="centerme">
<button onclick="addSinCos()">GO</button>
<button style= "margin-bottom:5px" onclick="addSinCos_reset()">RESET</button>
<div style="text-align: center; margin-bottom: 15px;" id="LHS_vs_RHS"> </div>
</div>

<script>
  let p5LHS_vs_RHS = new p5(sketch_e01,'LHS_vs_RHS');
  function addSinCos(){
    if (p5LHS_vs_RHS !== null){
      p5LHS_vs_RHS.remove()
    }
    p5LHS_vs_RHS = new p5(exponentIterationsWithRHS,'LHS_vs_RHS');
  }
  function addSinCos_reset(){
    p5LHS_vs_RHS.remove()
    p5LHS_vs_RHS = new p5(sketch_e01,'LHS_vs_RHS');
  }
  let exponentIterationsWithRHS = function (p) {
  exponentIterations(p)
  p.n = 0
  p.draw = function () {
    e_inx = p.iterate();
    p.a_n = e_inx[0];
    p.b_n = e_inx[1];
    p.translate(p.width / 2, p.height / 2);
    p.scale(1, -1);
    p.scale(100); 
    p.strokeWeight(1 / 20);
    p.stroke("black");
    p.point(p.a_n, p.b_n);
    p.n++;
    p.cos_xn = p.cos(p.n * p.x);
    p.sin_xn = p.sin(p.n * p.x);
    p.stroke("red");
    p.point(p.cos_xn, p.sin_xn);
  };
};
</script>

Somewhat disappointing, no? Why do the black and red points diverge? 

Do you remember I said $$ 0.1 $$ is small, so $$ e^{0.1i} \approx 1+0.1$$ should be true? Maybe $$0.1$$ is just **not small enough**! Maybe. **You tell me:**

<div style="text-align: center;">
<input type="range" min="0.001" max="0.3" value="0.1" step = "0.001" width ="100%" id="x_range">

<div style="text-align: center; margin-bottom: 5px;" id  ="output"></div>
<button style="margin-bottom: 5px;" onclick="runFinalSketch()">GO</button>
</div>

<script>
  let slider = document.getElementById("x_range");
  let output = document.getElementById("output");
  output.innerHTML = `<code> 1 + ` + slider.value+`i<\code>`;
  slider.oninput = function() {
  output.innerHTML = `<code> 1 + ` + this.value+`i<\code>`;
}
</script>

<div style="text-align: center; margin-bottom: 15px;" id="final_sketch"> </div>
<script>
  let p5final = new p5(sketch_e01,'final_sketch');;
  function runFinalSketch() {
    if (p5final !== null) {
      p5final.remove();
    };
    p5final = new p5(final_sketch_closure,'final_sketch');
  }
  let final_sketch_closure = function (p) {
      exponentIterationsWithRHS(p);
      p.x = slider.value;
      p.b = slider.value;
      p.setup = function () {
        p.createCanvas(300, 300);
        p.background(220);
        p.line(p.width / 2, 0, p.width / 2, p.height);
        p.line(0, p.height / 2, p.width, p.height / 2);
        p.frameRate(30*0.1/p.x)
        p.origin = p.createVector(p.width / 2,p.height/2);
        p.v0 = p.createVector(0,50);
        p.v1 = p.createVector(50,0);
        makeGrid(p,p.origin, p.v0, p.v1,"rgba(0,0,0,0.3)");
       makeGrid(p,p.origin, p.v1, p.v0,"rgba(0,0,0,0.3)");
      };
      };
</script>

Take the slider **all the way to the left** and it's right on the money! That's it, we're done here.

### What's next?

- We now have **reasonable evidence** that Euler's formula is true, but how do we **prove** it? I particularly like Euler's original [proof](https://en.wikipedia.org/wiki/Euler%27s_formula#Using_power_series). Also, definitely watch [the video by 3Blue1Brown](https://www.youtube.com/watch?v=v0YEaeIClKY) for another intuitive explanation, using a completely different approach.
- Some would argue that Euler's formula is even more beautiful with $$ \tau $$ instead of $$ \pi $$. Read all about it (and much more) [here](https://tauday.com/tau-manifesto).a

Finally, some challenges to think about:
- Look closely at the last sketch. If you're patient enough, you'll see the black points diverge away from the origin, while the red ones stay on a circle. This always happens. Can you figure out why?
    > Hint: calculate the distance from the origin of $$1+ix,(1+ix)^{2},\ldots$$
-  It looks as if the black and red points go around **in phase**: they always complete a full circle at the same time. Can you use this "fact" to make the black points better approximate $$e^{ix}$$?
    > Check your idea by changing the function `iterate` and rerunning the sketch.