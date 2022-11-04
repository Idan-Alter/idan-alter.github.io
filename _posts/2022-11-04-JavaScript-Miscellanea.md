---
layout: post
title: JavaScript Miscellanea
date: 2022-11-01
---
Technical details that get in the way instead of helping go here. What's p5.js? How to orient the canvas? Etc.
<!--more-->

Contents:
- [Prerequisites](#prerequisites)
- [p5.js](#p5js)
  - [Drawing a Cartesian plane](#drawing-a-cartesian-plane)
- [plotly.js](#plotlyjs)

## Prerequisites

I'll be assuming throughout this blog that you know a bit of coding, just the basic concepts:
- variables
- flow control
- functions

If that doesn't mean anything to you, maybe come back here later.  The [Coding Train](https://thecodingtrain.com/guides/getting-started) is a good place to start learning JavaScript, but it doesn't really matter which language you learn, the knowledge is transferable.

## p5.js

p5.js is a framework focused on *"on making coding accessible"*. For me, that means I can write cool interactive visualizations (**sketches**, as they are called), with code that's basically self explanatory. Check it out:  
<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="350" data-preview-width="350">
function setup() {
  createCanvas(200, 200);
  background(220);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
}
</script>
Edit the code a bit and run it again. Try changing the second line to `createCanvas(200, 100)` with `100` instead of `200` at the end. Also give `background(110)` a go. You can always check the [official reference](https://p5js.org/reference/#/p5/background) to find out how something works exactly.


We use the `setup` function to create and, well, *setup* the canvas, but if we want something dynamic, we need to add a `draw` function: p5.js calls it repeatedly for as long as this page is open in your browser.

<script type="text/p5" data-height="350" data-preview-width="350">
function setup() {
  createCanvas(200, 200);
  background(220);
}

function draw() {
  background(220);
  rect(mouseX,mouseY,15,15)
}
</script>
Can you guess what `mouseX` does? This is what sold me on p5.js. There's plenty other ways to interact with the sketch, and they're all just as easy! [This tutorial](https://p5js.org/learn/interactivity.html) is a good place to read about them.

### Drawing a Cartesian plane

You can imagine that using the canvas to draw points in a Cartesian plane will be useful in a blog about math. Unfortunately for me, the creators of p5.js had the computer graphics community in mind when choosing default settings. I specifically don't enjoy their answers to the following questions:
- Where is the origin? 
    >"top-left."
- In which way are the axes directed? 
   > "to the right and **down**."

The result is that `(x,y)` of p5.js is not *my* $$(x,y)$$. Let me show you this by drawing a circle of radius 50 pixels around (0,0).

<script type="text/p5" data-height="450" data-preview-width="350">
let t = 0;

function setup() {
  createCanvas(200, 200);
  background(220);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
}

function draw() {
  let x = 50*cos(t);
  let y = 50*sin(t);
  stroke("red")
  point(x,y)
  t = t+0.01
}
</script>

What I expect to see, given that we start out with 

$$ (x,y) = 50\cdot(\cos(0),\sin(0)) = (50,0) $$

and increase the angle inside the trig functions slowly, is a circle going counterclockwise in the middle of the canvas. Obviously, the result is quite different than what I had in mind. Luckily, we have a quick fix for that: add the following code to `draw` right before `point(x,y)` and run it again.

{% highlight js %}
  translate(width / 2, height / 2); // Move the origin to the center of the canvas.
  scale(1, -1);  // Make the y-axis point upwards.
{% endhighlight %}

## plotly.js
p5.js gives you the ability to draw anything you want on the canvas super easily, but sometimes you might want to plot a function without any boilerplate code. In those cases I use [plotly.js](https://plotly.com/javascript/). It does require working just a bit behind the scenes of this webpage though. 

Try it yourself: <button onclick="letsGo()">Go</button> <button onclick="stop()">Stop</button>

<script src="https://cdn.plot.ly/plotly-2.16.1.min.js"></script>
<div id="plotly_unit_circle"></div>
<div id="plotly_sin_cos"></div>
<script>
  let trace_unit_circle = {
    x: [50],
    y: [0],
    mode: 'line',
    type: 'scatter',
     };
  Plotly.newPlot('plotly_unit_circle', [trace_unit_circle],{title: "The Unit Circle"});
  var trace11 = {
    x: [0],
    y: [1],
    mode: 'line',
    type: 'scatter',
    name: `$50cos(t)$`
  };
  var trace22 = {
    x: [0],
    y: [0],
    mode: 'line',
    type: 'scatter',
    name: `$50sin(t)$`
  };
  Plotly.newPlot('plotly_sin_cos', [trace11, trace22]);
  let t = 0;
  function updatePlots(){
  let a = 50*Math.cos(t);
  let b = 50*Math.sin(t);
  Plotly.extendTraces('plotly_unit_circle',{
    x: [[a]],
    y: [[b]]
  }, [0]);
  Plotly.extendTraces('plotly_sin_cos',{
    x: [[t],[t]],
    y: [[a], [b]]
  }, [0,1]);
  t += 0.1;
  };
  let interval_id = null;
  function letsGo(){
    if (interval_id === null) {
    interval_id = setInterval(updatePlots,10);
    }
  };
  function stop(){
    clearInterval(interval_id);
    interval_id = null
  };
</script>