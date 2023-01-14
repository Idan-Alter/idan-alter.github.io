---
layout: post
title: "Rejection Sampling and the Ziggurat Algorithm"
tags: probability approximations RNG
import_MathJax3: true
import_p5_lib: true
import_plotly: true
image: "assets/post_gifs/2023-01-12-Ziggurat-Algorithm.gif"
---

It's **blazingly** fast and is the best RNG you've never heard of. Let me show you how it works with some interactive sketches. We'll throw darts along the way!

<!--more-->
#### Contents:
- [Throwing darts](#throwing-darts)
- [Rejection blues](#rejection-blues)
- [I never liked y anyway](#i-never-liked-y-anyway)
- [The algorithm](#the-algorithm)
- [My very first ziggurat](#my-very-first-ziggurat)
- [Sampling from the ziggurat](#sampling-from-the-ziggurat)
- [You're still here?](#youre-still-here)

<script>
  function makeGrid(p,origin, v0, v1, myColor) {
    p.push();
    p.stroke(myColor);
    p.strokeWeight(0.5)
    
    let up = origin.copy();
    let down = origin.copy();
    
    let v1mega = v1.copy().setMag(10 ** 4 * p.max(p.width, p.height));
    
    for (let k = 0; k <= 10; k++) {
      
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
### Throwing darts

How do you calculate π? One way to do it is to throw (a lot) of darts.

<div style="text-align: center; margin-bottom: 5px;" id  ="myPI_html"></div>
<div id="estimating_pi_sktch" class="centerme"></div>
<figcaption class="centerme">
Run this sketch yourself in the <a href ="https://editor.p5js.org/Idan-Alter/sketches/evP67pvrG" >p5.js web editor</a>.
</figcaption>

<script>
estimating_pi_sktch = function(p){
  p.diameter = 200;
  p.radius = p.diameter/2;
  p.setup = function(){
    p.createCanvas(200,200)
    p.background(220);

    p.line(0,0,p.width,0);
    p.line(0,0,0,p.height);
    p.line(0,p.height,p.width,p.height);
    p.line(p.width,0,p.width,p.height);

    p.translate(p.width/2, p.height/2);
    p.circle(0,0,200);
    p.origin = p.createVector(p.width/2,p.height/2) 
    p.frameRate(10);
  };
  
  p.throwDart = function() {
    let x = Math.random();
    let y = Math.random();
    return p.createVector(x,y)
  };
  
  
  p.in_circle = 0;
  p.total = 0;
  
  p.draw = function(){
    let dart = p.throwDart();
    dart.mult(p.diameter);
  
    if (dart.dist(p.origin) < p.radius) {
      p.in_circle += 1;
      p.stroke("rgba(0,0,255,0.5)")
    } else {
      p.stroke("rgba(255,0,0,0.5)")
    };
    p.strokeWeight(5)
    p.point(dart.x, dart.y)
    p.total += 1;
  
    let myPI = 4*p.in_circle/ p.total;
    myPI_html.innerHTML = `<code> π ≈ `+p.nfc(myPI,5)+ `<\code>`;  };
};
p = new p5(estimating_pi_sktch,"estimating_pi_sktch");
</script>

**Huh?** I'll explain step by step. It might be useful to have the code open in another tab.

**Step 1:** First, we throw a dart randomly inside the square by calling this aptly named function:
{%highlight js%}
function throwDart() {
const x = Math.random();
const y = Math.random();
return createVector(x, y);
}
{% endhighlight %}

`Math.random()` gives us *i.i.d. standard uniform variates*, which is a fancy way to say that:
- Each time we call it we get any number between 0 and 1.
- There's no way to know in advance which one it'll be,
- but we do know no one is favored.

>Everything I just said is flat out wrong, but it's very practical to *pretend* this is the way it works. Go read about **true** randomness [somewhere else](https://www.random.org/).

**Step 2:** We check where the dart landed. That's line 31 in the code, `if (dart.dist(origin) < radius)` (you did open it in another tab, right?). If it falls within the circle, we color it blue and increase the counter `in_circle` by one. Otherwise we color it red.

**Step 3:** We do some math.
  - It is intuitively clear to some people that

    $$P(\mathrm{a\ dart\ is\ blue}) =\frac{\mathrm{circle\ area}}{\mathrm{square\ area}}.$$

    The intuition is that if no number is favored by the uniform coordinates `x` and `y` then every piece of the square should get its "fair share". The proof, however, just so happens to require some (slightly) nontrivial math. I'll go ahead and assume you're OK with the intuition.

  - The area of the circle is $$ \pi r^2 $$ while the area of the square is $$(2r)^2$$ (because its side is twice the length of the radius). Take the ratio of the areas and you have

    $$\frac{\mathrm{circle\ area}}{\mathrm{square\ area}} = \pi/4.$$

  - The law of large numbers says that
   
   $$P(\mathrm{a\ dart\ is\ blue})\approx \frac{\mathrm{\#\ of\  blue\ darts}}{\mathrm{\#\ of\ total\ darts}}.$$

**Step 4:** We calculate `4*in_circle/total` as our estimate for π, and it seems to work, in the long run.

### Rejection blues
Throwing darts in a *square* is easy, two portions of `Math.random()` and you're done. What if I wanted something a bit more special? Maybe **sampling uniformly in, say, a *circle***?

Let's change the game: now we throw the same old darts in the square, though **every time we miss** the circle **we start over**. About $$ \pi/4\approx 78 \%  $$ of the time we'll score on the first try, the rest of the time we've wasted a throw, but we pick ourselves up and try again.    


<div style="text-align: center; margin-bottom: 5px;" id  ="rejection_circle_text">`<code>THROWS: 0 | HITS: 0</code>`</div>
<div id="rejection_circle_sktch" class="centerme"></div>
<button class="centerme" onclick="do_a_throw()">THROW A DART</button>

<script>
rejection_circle_sktch = function(p){
  p.diameter = 200;
  p.radius = p.diameter/2;
  p.setup = function(){
    p.createCanvas(200,200);
    p.main = p.createGraphics(200,200);
    p.main.background(220);
    p.main.line(0,0,p.main.width,0);
    p.main.line(0,0,0,p.main.height);
    p.main.line(0,p.main.height,p.main.width,p.main.height);
    p.main.line(p.main.width,0,p.main.width,p.main.height);

    p.main.translate(p.main.width/2, p.main.height/2);
    p.main.circle(0,0,200);
     p.main.translate(-p.main.width/2, -p.main.height/2);
    p.origin = p.createVector(p.main.width/2,p.main.height/2) 
    p.image(p.main,0,0);

    p.red = p.createGraphics(200,200);

    p.frameRate(30);
  };
  
  p.throwDart = function() {
    let x = Math.random();
    let y = Math.random();
    return p.createVector(x,y)
  };
  
  p.red_alpha = 0;
  p.in_circle = 0;
  p.throw_flag = false;
  p.draw = function(){
      p.red_alpha =0.9*p.red_alpha;
    if (p.throw_flag){
      p.throw_flag = false;
      let dart = p.throwDart();
      dart.mult(p.diameter);
      if (dart.dist(p.origin) < p.radius) {
        p.in_circle += 1;
        p.main.stroke("rgba(0,0,255,0.5)")
        p.main.strokeWeight(5);  
        p.main.point(dart.x, dart.y);
        console.log(dart)
      } else{
        p.red_alpha = 120;
      }
      rejection_circle_text.innerHTML =`<code>THROWS: `+p.nfc(n_throws,0)+` | HITS: `+p.nfc(p.in_circle,0) +`</code>`;
    }
    p.image(p.main,0,0);
    p.red.clear();
    p.red.background(255,0,0,p.red_alpha)
    p.image(p.red,0,0);
   }
};
//darts thrown, hti
p_circle_rejection = new p5(rejection_circle_sktch,"rejection_circle_sktch");
let n_throws = 0;
function do_a_throw(){
  n_throws += 1;
  p_circle_rejection.throw_flag = true;
}
</script>

By clicking this button until you get a hit you manually iterate through the following loop:
{% highlight js%}
do {
  dart = throwDart();
} while (dart.dist(origin) > radius)
{% endhighlight %}

Once the loop terminates, we know for sure that the last dart landed within the white circle, it fulfilled the **condition**. In fact, 
{% highlight js%}
do {
  Sample X
} while (X does not fulfill condition A)
{% endhighlight %}

is a general way to get a sample of `X` **conditioned on** `A`. It's called the [acceptance-rejection method](https://en.wikipedia.org/wiki/Rejection_sampling). In our case we *reject* the red darts and start over until we *accept* a blue dart and move on. 

This works with everything, so **why limit ourselves to circles?** 

<div style="text-align: center; margin-bottom: 5px;" id  ="bell_rejection_text">`<code>THROWS: 0 | HITS: 0</code>`</div>
<div id="bell_rejection_sktch" class="centerme"></div>
<button id="bell_lets_go" class="centerme" onclick="bell_lets_go()">LET'S GO</button>

<script>
var x_hist = [];
bell_rejection_sktch = function(p){
p.scl = 50;
p.sig = 1;
p.normpdf = (x) => p.exp(-((x)**2)/(2*p.sig)) / p.sqrt(p.sig*2*p.PI);
p.bell = (x) => p.normpdf(x)/p.normpdf(0)*4;

p.setup= function () {
  p.createCanvas(200, 200);
  p.background(220);
  p.line(0,0,p.width,0);
  p.line(0,0,0,p.height);
  p.line(0,p.height,p.width,p.height);
  p.line(p.width,0,p.width,p.height);
 
  p.origin = p.createVector(p.width / 2, 200);
  p.e0 = p.createVector(p.scl,0);
  p.e1 = p.createVector(0,-p.scl);
  makeGrid(p,p.origin, p.e0, p.e1,"rgba(0,0,0,0.3)");
  makeGrid(p,p.origin, p.e1, p.e0,"rgba(0,0,0,0.3)");
  
  p.push()
  p.translate(p.origin.x,p.origin.y);
  p.scale(1,-1);
  p.beginShape()
  p.vertex(-p.width/2,0);
  for (let k=0; k<=p.width; k++){
    let x = -p.width/2 + k;
    p.vertex(x,p.bell(x/p.scl)*p.scl);
  }
  p.vertex(p.width/2,0);
  p.endShape(p.CLOSE);
  p.pop()

  p.frameRate(10);
}

p.throwDart = function() {
  let x = 4*Math.random()-2;
  let y = 4*Math.random();
  return p.createVector(x, y);
}

p.in_bell = 0;
p.total = 0;
p.go_flag = false;
p.draw = function() {
  if (p.go_flag){
  do {
    p.total += 1;
    var dart = p.throwDart();
    bell_rejection_text.innerHTML =`<code>THROWS: `+p.nfc(p.total,0)+` | HITS: `+p.nfc(p.in_bell,0) +`</code>`;
    //console.log(dart.y,dart.x, p.bell(dart.x))
    } while (dart.y > p.bell(dart.x));
  p.stroke("rgba(0,0,255,0.5)");
  p.strokeWeight(5);
  x_hist.push(dart.x);
  dart.x = dart.x * p.scl;
  dart.y = dart.y * p.scl;
  p.translate(p.origin.x,p.origin.y)
  p.scale(1,-1);
  p.point(dart.x, dart.y);
  

  p.in_bell +=1;
  bell_rejection_text.innerHTML =`<code>THROWS: `+p.nfc(p.total,0)+` | HITS: `+p.nfc(p.in_bell,0) +`</code>`;

}
}
}
</script>

<script>
p_bell_rejection = new p5(bell_rejection_sktch,"bell_rejection_sktch");
function bell_lets_go(){
  p_bell_rejection.go_flag = true;
  let button = document.getElementById("bell_lets_go");
  button.outerHTML= "<p> </p>";
}
</script>

What you see is a zoomed in bell curve:

$$ \mathrm{bell}(x) = C\cdot {e^{-x^2/2}}$$

Where $$ C $$ is just some constant I chose to make the bell curve touch the top of the sketch (It's $$ 4\sqrt{2\pi} $$ if you have to know). We want to accept any dart that hits **below** this curve, so the loop looks like this now:
{% highlight js%}
do {
  dart = throwDart();
  } while (dart.y > bell(dart.x))
{% endhighlight%}

There's one more thing that I've intentionally made easy to miss: **the square we're throwing at has changed**. It's now within these boundaries: 

$$ -2 <x <2 ,\   0< y < 4.$$

>Look very hard at the grid lines to see why.

This means we need to change the dart throwing function. Luckily, this is an easy fix:
{% highlight js%}
function throwDart() {
  const x = 4*Math.random() - 2; //x ~ U[-2,2]
  const y = 4*Math.random();     //y ~ U[0,4]
  return createVector(x, y);
}
{% endhighlight%}


### I never liked y anyway

**Let's do the same thing, but slower.** I want us to get just an `x` at first.
{% highlight js%}
function throwX() {
  return 4*Math.random() - 2; 
}
{% endhighlight%}

Now it's up to you to randomly choose `y`. Close your eyes and click the button.

<div style="text-align: center; margin-bottom: 5px;" id  ="bell__throw_x_text">`<code>THROWS: 0 | HITS: 0</code>`</div>
<div id="bell__throw_x_sktch" class="centerme"></div>
<div class = "centerme" style="margin-bottom: 15px;" >
<button onclick="throwXbutton(p_bell_throwx)">THROW X</button> <button onclick="STOPbutton(p_bell_throwx)">STOP Y</button> <button onclick="setXbutton(p_bell_throwx)">SET X=1.5</button>
</div>

<script>
bell__throw_x_sktch = function(p){
  p.scl = 50;
  p.sig = 1;
  p.normpdf = (x) => p.exp(-((x)**2)/(2*p.sig)) / p.sqrt(p.sig*2*p.PI);
  p.bell = (x) => p.normpdf(x)/p.normpdf(0)*4;
  
  p.back = function(){
    p.background(220);
    p.strokeWeight(1);
  
    p.origin = p.createVector(p.width / 2, 200);
    p.e0 = p.createVector(p.scl,0);
    p.e1 = p.createVector(0,-p.scl);
    makeGrid(p,p.origin, p.e0, p.e1,"rgba(0,0,0,0.3)");
    makeGrid(p,p.origin, p.e1, p.e0,"rgba(0,0,0,0.3)");
    p.push()
    p.stroke("rgba(0,0,0,1)");
    p.line(0,0,p.width,0);
    p.line(0,0,0,p.height);
    p.line(0,p.height,p.width,p.height);
    p.line(p.width,0,p.width,p.height);
    
    p.translate(p.origin.x,p.origin.y);
    p.scale(1,-1);
    p.beginShape()
    p.vertex(-p.width/2,0);
    for (let k=0; k<=p.width; k++){
      let x = -p.width/2 + k;
      p.vertex(x,p.bell(x/p.scl)*p.scl);
    }
    p.vertex(p.width/2,0);
    p.endShape(p.CLOSE);
    p.pop()
    p.stroke("rgba(0,0,0,1)");
  }
  p.setup= function () {
    p.createCanvas(200, 200);
   p.back();
  }
  p.throwX = function (){
    let x = 4*Math.random()-2; 
    return x
  }
  p.step = 4/60;
  p.y = 1;
  p.x = p.throwX();
  p.stop_flag = false;
  p.total = 0;
  p.in_bell = 0;
  p.draw = function (){
  p.back();
  let x = p.x
  let y_top = p.bell(x)*p.scl;
  if (p.y >= 4 || p.y <= 0){
    p.step = -p.step;
  }
  p.y += p.step
  let y = p.y;

  p.translate(p.origin.x,p.origin.y)
  p.scale(1,-1);
  p.strokeWeight(1.5);
  p.stroke("rgba(0,0,255,0.5)");
  p.line(x*p.scl, 0, x*p.scl, y_top);

  p.stroke("rgba(255,0,0,0.5)");
  p.line(x*p.scl, y_top, x*p.scl, p.height);

  p.push()
  p.stroke("rgba(0,0,0,1)");
  p.strokeWeight(7);
  let dart = {};
  dart.x = x * p.scl;
  dart.y = y * p.scl;
  if (p.stop_flag){
    p.total += 1;
    if (y > p.bell(x)){
      p.text_hit = false;
      p.stroke("rgba(255,0,0,1)");
    } else{
      p.text_hit = true;
      p.stroke("rgba(0,0,255,1)");
      p.in_bell += 1;

    }
    p.push();
    p.textSize(24);
    p.scale(1,-1);
    p.noStroke();
    p.strokeWeight(0.5)
    if (p.text_hit === true){
      p.text("HIT",-18,-90);
    } else{
      p.text("MISS",-28,-90);
    }
    p.pop()

    p.noLoop();
  }
  p.point(dart.x, dart.y);

  p.pop()
  bell__throw_x_text.innerHTML =`<code>THROWS: `+p.nfc(p.total,0)+` | HITS: `+p.nfc(p.in_bell,0) +`</code>`;
  }
}
</script>

<script>
p_bell_throwx = new p5(bell__throw_x_sktch,"bell__throw_x_sktch");

function throwXbutton(p){
  p.x = p.throwX();
  p.stop_flag = false;
  p.loop();
}

function setXbutton(p){
  p.x = 1.5;
  p.stop_flag = false;
  p.loop();
}

function STOPbutton(p){
  p.stop_flag = true;
}

</script>


Hopefully this experience convinced you that **it's harder to score the further $$x$$ is from zero**. How much harder though? Suppose `throwX()` gave us 1.5 back, what are the chances we'll score a hit? The vertical line above $$ x=1.5 $$ turns red at $$y= \mathrm{bell}(1.5)\approx 4/3$$, which is a third of the way up, so I'd say  

$$P(\mathrm{the\ dart\ is\ blue, \ given \ that\ } x=1.5) \approx 1/3.$$

The logic works the other way around as well: this *selection* process makes it less likely that we'll see darts with larger $$ x $$ values. In fact, it turns out that if we:
1. Take the blue darts.
2. Ignore their `y`'s.
3. Keep just the `x`'s.

Then what we get is no longer uniform, but normally distributed! I won't go through the proper proof here (it's Bayes' law, basically), but here's a **proof by statistics:** Below you'll find a live histogram generated from the darts we've been throwing automatically since you clicked "LET'S GO".

<div id="rejection_histogram"></div>

<script>
var data = [
  {
    x: x_hist,
    type: 'histogram',
	marker: {
    color: '"rgba(0, 0, 255,0.5)"',
	},
  }
];
var layout ={xaxis:{title:{text:'x Value'}},
             yaxis:{title:{text:'No. of Darts'}}};
setInterval(()=>{
Plotly.newPlot('rejection_histogram', data, layout);
},200)

</script>

>You should be thinking: Surely a sample or two should be farther out than $$ \pm2$$. We'll get to it later. 

### The algorithm
Our little game is actually an algorithm: it calls `Math.random()` a few times and spits out **other flavors of randomness**, all you need is to:
1. Draw the graph of the target density. In our case this is the bell curve.
2. Put a box around it.
3. Keep throwing darts at the box until one hits under the density. 
4. The $$ x $$ coordinate of the dart is a sample from this density.
  
### My very first ziggurat

Every time we miss a dart, we have to start over. That's a lot of wasted effort. Could we do something about this? Yes, think *inside* the box!

<div id="p_bell_to_zig" class="centerme"></div>
<div class="centerme" style="margin-bottom: 15px;">
<button onclick="make_the_zig()">ZIGGURATIFY</button>
<button  onclick="reset_the_zig()">RESET</button>
</div>

<script>
bell_to_zig_sktch = function(p){
  p.scl = 50;
  p.sig = 1;
  p.normpdf = (x) => p.exp(-((x)**2)/(2*p.sig)) / p.sqrt(p.sig*2*p.PI);
  p.bell = (x) => p.normpdf(x)/p.normpdf(0)*4;
  p.inv_bell = (y) => p.sqrt(2*p.sig*p.log(4/y))
  p.zig = [{x: 1.6680748679238604, y: 0.9950696727808446},
     {x:1.0983989302497676,y:2.1881452258216267}];
  
  p.setup= function () {
    p.createCanvas(200, 200);
    p.background(220);
    p.line(0,0,p.width,0);
    p.line(0,0,0,p.height);
    p.line(0,p.height,p.width,p.height);
    p.line(p.width,0,p.width,p.height);

   
    p.origin = p.createVector(p.width / 2, 200);
    p.e0 = p.createVector(p.scl,0);
    p.e1 = p.createVector(0,-p.scl);

    p.push()
    p.translate(p.origin.x,p.origin.y);
    p.scale(1,-1);
    p.beginShape()
    p.vertex(-p.width/2,0);
    for (let k=0; k<=p.width; k++){
      let x = -p.width/2 + k;
      p.vertex(x,p.bell(x/p.scl)*p.scl);
    }
    p.vertex(p.width/2,0);
    p.endShape(p.CLOSE);
    p.pop()
  
    p.line(0, p.origin.y, p.width, p.origin.y);
  }
  p.go_flag = false;
  p.step = 0.005;
  p.t = 1;
  p.draw = function() {
    if (p.go_flag){
    p.background(255);
    if (p.t > 0){
      p.t -= p.step
    }
      p.push();
      p.fill(220);
      p.translate(p.origin.x,p.origin.y);
      p.scale(1,-1);
      let x0 = -2*p.scl;
      let y0 = 0*p.scl;
      for (point of p.zig){
      var x1 = (1-p.t)*point.x*p.scl+ p.t*2*p.scl;
      var y1 = point.y*p.scl;
      p.rect(-x0, y0, 2*x0, y1-y0);      
      x0=x1;
      y0=y1;
      }
      p.rect(-x0, y1, 2*x0, 4*p.scl-y1);
      p.pop();

      p.push()
      p.fill("rgba(255,255,255,1)");
      p.translate(p.origin.x,p.origin.y);
      p.scale(1,-1);
      p.beginShape()
      p.vertex(-p.width/2,0);
      for (let k=0; k<=p.width; k++){
        let x = -p.width/2 + k;
        p.vertex(x,p.bell(x/p.scl)*p.scl);
      }
      p.vertex(p.width/2,0);
      p.endShape(p.CLOSE);
      p.pop()
           
      p.line(0, p.origin.y, p.width, p.origin.y);
  

      

    }
  }
}
</script>

<script>
p_bell_to_zig = new p5(bell_to_zig_sktch,"p_bell_to_zig");
make_the_zig = function (){
  p_bell_to_zig.go_flag=true;
}
reset_the_zig = function(){
    p_bell_to_zig.go_flag=false;
    p_bell_to_zig.t = 1;
    p_bell_to_zig.setup();
}
</script>
<!-- <script id ="Ziggoratify>
function Zigguratify(curve,inv_curve,box_right,box_top,n,x0){
  let xs = [box_right, x0];
  let ys = [0, curve(xs[1])];
  let area = xs[0]*ys[1];
  for (let k=1; k <= n-1; k++){
    let y = ys[k] + area/xs[k];
    let x = xs[k];
    if (y < box_top){
      x = inv_curve(y);
    }
    xs.push(x)
    ys.push(y)
  }
  return {xs:xs , ys:ys}
}



function bisect(l,fl,r,fr,func,tol=1e-10){
  if (fl*fr>0){
    console.error("bisection err")
  }
  let diff = (r-l)/2;
  let mid = (l+r)/2;
  if (diff<tol){
    return mid;
  }
  let val = func(mid);
  if (val*fr > 0){
    return bisect(l,fl,mid,val,func,tol);
  } else{
    return bisect(mid,val,r,fr,func,tol);
  }

}

let Zigf = function (x){
  let res = Zigguratify(curve,inv_curve,box_right,box_top,n,x);
  return res.ys[n]-box_top;
} 
res = bisect(0.1,Zigf(0.1),box_right,Zigf(box_right),Zigf)
console.log(Zigguratify(curve,inv_curve,box_right,box_top,n,res))
</script> -->

**The ziggurat hugs the density**, so there's very little leftover area. We'll throw darts within the ziggurat, and reject the small minority that land outside the bell curve. The incredible part is that **sampling from the ziggurat is even faster** than sampling from inside a plain old square: each throw is more accurate *and* cheaper!


### Sampling from the ziggurat

Play with the sketch and let's talk later.

<div class = "centerme">
<div id="div_text" style="margin-bottom: 5px;"><code>THROWS: 0 | HITS: 0</code></div>
<div id="zig_phases_sktch"></div>
<div style="margin-bottom: 15px;" id="div_buttons">
  <button onclick="zig_choose_level()">CHOOSE LEVEL</button>
</div>
</div>

<script>
zig_phases_sktch = function(p){
  p.scl = 300/4;
  p.sig = 1;
  p.normpdf = (x) => p.exp(-((x)**2)/(2*p.sig)) / p.sqrt(p.sig*2*p.PI);
  p.bell = (x) => p.normpdf(x)/p.normpdf(0)*4;
  p.inv_bell = (y) => p.sqrt(2*p.sig*p.log(4/y))
  p.zig = [{x: 1.6680748679238604, y: 0.9950696727808446},
     {x: 1.0983989302497676,y: 2.1881452258216267}];

  p.for_rect =[];
  let x0 = 2*p.scl;
  let y0 = 0*p.scl; 
  for (point of p.zig){
    var x1 = point.x*p.scl;
    var y1 = point.y*p.scl;
    p.for_rect.push([-x0, y0, 2*x0, y1-y0])
    x0=x1;
    y0=y1;
  }
  p.for_rect.push([-x0, y1, 2*x0, 4*p.scl-y1]);
  p.setup= function () {
    p.createCanvas(300, 303);
   
    p.origin = p.createVector(p.width / 2, 300);
    p.e0 = p.createVector(p.scl,0);
    p.e1 = p.createVector(0,-p.scl);


  }
  p.draw_back = function() {
    p.background(255);
    p.push();
    p.fill(220);
    p.translate(p.origin.x,p.origin.y);
    p.scale(1,-1);
    for (box of p.for_rect){
    p.rect(...box);      
    }
    p.pop();

    p.push()
    p.fill("rgba(255,255,255,1)");
    p.translate(p.origin.x,p.origin.y);
    p.scale(1,-1);
    p.beginShape()
    p.vertex(-p.width/2,0);
    for (let k=0; k<=p.width; k++){
      let x = -p.width/2 + k;
      p.vertex(x,p.bell(x/p.scl)*p.scl);
    }
    p.vertex(p.width/2,0);
    p.endShape(p.CLOSE);
    p.pop();
         
    p.line(0, p.origin.y, p.width, p.origin.y);
  };

  p.step = 1/30;
  p.level_timer = 3;

  p.x_step = 1/60;
  p.x_timer = 1-p.x_step;

  p.y_step = 1/30;
  p.y_timer = 1-p.y_step;

  p.dart = {};
  p.phase = "choose level";

  p.check_y_flag = false;
  p.total = 0;
  p.in_zig = 0;
  p.hit = false;
  p.draw_level= function() {
    p.push();
    p.fill("rgba(220,220,220,0.5)");
    p.rect(...p.level_box); 
    p.pop()
  }

  p.draw_danger_y = function (){
    if (p.y_timer <= 0 || p.y_timer >= 1){
      p.y_step = -p.y_step;
    }
    p.y_timer -= p.y_step;
    p.dart.y = p.y_timer*p.level_box[1] + (1-p.y_timer)*(p.level_box[1]+p.level_box[3]);
    p.push();
    p.strokeWeight(7)
    if (p.bell(p.dart.x/p.scl) > p.dart.y/p.scl){
      p.stroke("rgba(0,0,255,1)")
    } else{
      p.stroke("rgba(255,0,0,1)")
    };
    p.point(p.dart.x,p.dart.y);
    p.pop();
  }

  p.draw = function() {
    p.draw_back();
    p.push();
    p.translate(p.origin.x,p.origin.y);
    p.scale(1,-1);
    if (p.phase === "choose level"){

      if (p.level_timer > p.step){
        p.level_timer -= p.step;
      } else{
        p.level_timer = 3-p.step;
      }
      p.level_idx = Math.floor(p.level_timer);
      p.level_box = p.for_rect[p.level_idx];
      p.draw_level();
    }
    if (p.phase === "choose x"){
      p.draw_level();
      if (p.x_timer <= 0 || p.x_timer >= 1){
        p.x_step = -p.x_step;
      }
      p.x_timer -= p.x_step;
      p.dart.x = (2*p.x_timer-1) * p.level_box[0];
      p.push();
      p.strokeWeight(7)
      p.point(p.dart.x,p.level_box[1]);
      p.pop();
    }

    if (p.phase === "check safe"){
      if (p.level_idx === 2){
        p.next_x = 0;
        p.phase = "top level";
        div_buttons.innerHTML =`<button onclick="zig_choose_y()">STOP Y</button>`
      } else {
        p.next_x = p.for_rect[p.level_idx+1][0];
        if (p.dart.x < p.next_x || p.dart.x > -p.next_x){
          div_buttons.innerHTML =`<button onclick="zig_choose_y()">STOP Y</button>`
          p.phase = "danger zone";
        } else{
          p.phase = "safe";
        }
      }
    }
    if (p.phase === "safe"){
      p.draw_level();
      p.push();
      p.fill("rgba(0,0,255,0.2)")
      let safebox = [p.next_x, p.level_box[1], -2*p.next_x, p.level_box[3]]
      p.rect(...safebox)
      p.pop();
      p.total += 1;
      p.in_zig += 1;
      p.hit = true;
      p.phase = "end";
    }
    if (p.phase === "danger zone"){
      p.draw_level();
      p.push();
      p.fill("rgba(255,0,0,0.2)")
      let danger = [p.level_box[0], p.level_box[1], p.next_x-p.level_box[0],p.level_box[3]]
      p.rect(...danger);
      p.scale(-1,1);
      p.rect(...danger);
      p.pop(); // finish choose y //update text HTML element;

      p.draw_danger_y()
      if (p.check_y_flag){
        p.total += 1;
        if (p.bell(p.dart.x/p.scl) > p.dart.y/p.scl){
          p.in_zig += 1;
          p.hit = true;
        }
       
        p.phase = "end";
      }
    }
    if (p.phase === "top level") {
      p.draw_level();
      p.push();
      p.fill("rgba(255,0,0,0.2)")
      let danger = [p.level_box[0], p.level_box[1], -2*p.level_box[0],p.level_box[3]]
      p.rect(...danger);
      p.pop(); // copy from danger zone choose y. //update text HTML element;
      p.draw_danger_y()
      if (p.check_y_flag){
        p.total += 1;
        if (p.bell(p.dart.x/p.scl) > p.dart.y/p.scl){
          p.in_zig += 1;
          p.hit = true;
        }
        p.phase = "end";
      }
    }
    if (p.phase === "end") {
      zig_udpate_text()
      div_buttons.innerHTML =`<button onclick="zig_reset()">THROW AGAIN</button>`
      p.noLoop();
      p.pop();
      p.textSize(24);
      if (p.hit){
        p.text("HIT", p.width/2-18,p.height/2+40);
      } else {
        p.text("MISS",p.width/2-28,p.height/2+40);
      }
      p.hit = false;
    }
  }
}
p_zig_phases = new p5(zig_phases_sktch,"zig_phases_sktch");
</script>

<script>
zig_choose_level = function() {
  if (p_zig_phases.phase === "choose level"){
    div_buttons.innerHTML =`<button onclick="zig_choose_x()">STOP X</button>`
    p_zig_phases.phase = "choose x";
  };
}
zig_choose_x = function() {
  if (p_zig_phases.phase === "choose x"){
    p_zig_phases.phase = "check safe";
  }
}
zig_choose_y = function(){
  let p = p_zig_phases;
  if (p.phase === "danger zone" || p.phase === "top level"){
    p.check_y_flag = true;
  }
}
zig_reset = function() {
  let p = p_zig_phases;
  p.x_step = 1/60;
  p.x_timer = 1-p.x_step;

  p.y_step = 1/60;
  p.y_timer = 1-p.y_step;

  p.dart = {};
  p.phase = "choose level";

  p.check_y_flag = false;
  p.loop();
  div_buttons.innerHTML =`<button onclick="zig_choose_level()">CHOOSE LEVEL</button>`
}
zig_udpate_text = function(){
  let p = p_zig_phases;
  div_text.innerHTML =`<code>THROWS: `+p.nfc(p.total,0)+` | HITS: `+p.nfc(p.in_zig,0) +`</code>`
}
</script>

You probably got it, but just to make sure:
1. We start by choosing one of the three levels of the ziggurat at random.
   > When you get down to the nuts and bolts, this costs basically *nothing*.
2. Now we want to throw a dart within the chosen level, so we start by getting just an `x`, like with `throwX` from earlier.
3. Most of the time we get an `x` in the **safe zone** (that's the blue box that pops up). This means **the dart's going to be blue, no matter what**. We don't need to get a `y` in this case.
    >This is where most of the savings come from.

4. Some of the time `x` lands in the **danger zone** (red boxes). Now we're forced to get a `y` because the dart can be blue **or** red given the current information.

This thing should only work if in the end **we don't play favorites with any area inside the ziggurat**. We *have* to throw a dart that's equally likely to land anywhere inside. Obviously, within each level everyone gets their fair share, so we just need to make sure the levels themselves are chosen in proportion to their area. 
>Think about it, if the top is tiny, it doesn't make sense to go there a third of the time.

The problem also shows us the solution: when setting up the ziggurat, we move things around to make sure **the levels have the same area**.



### You're still here?

- I still owe you an answer regarding the **tails**: there's more to the normal distribution than the range -2 to 2, but you're not getting any of values beyond it with what we've done so far. So... 99% of the solution is to make the box/ziggurat wider, thereby covering more of the density. The last 1% is tricky. Not satisfied? Read the next comment then.
- Most academic papers don't end up on my recommended reading list, but George Marsaglia's are actually fun. Check out (one of) the [original ziggurat papers](https://www.jstatsoft.org/article/view/v005i08). **This paper is also where you find out how to set up the zigguart.**
- The zigguart is cool, but the [alias method](https://en.wikipedia.org/wiki/Alias_method) is the **OG RNG**. An algorithm that runs at $$ O(1) $$? It's one of those rare free lunches. [Here's](https://www.keithschwarz.com/darts-dice-coins/) a nice writeup.