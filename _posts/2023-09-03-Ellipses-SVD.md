---
layout: post
title: "Linear Maps Make Ellipses Out of Circles"
tags: Algebra SVD
import_MathJax3: true
--- 
**Inside:** two short proofs and a cool viz of the SVD.
<!--more-->
#### Contents:
- [It's in the title](#its-in-the-title)
- [Easy mode](#easy-mode)
- [Normal difficulty](#normal-difficulty)
- [It's not over?](#its-not-over)
- [Go further](#go-further)


<script defer="defer" src="\assets\jspacks\SVD_ellipses.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
<style>
.react_root
{
    /* position: relative;
    z-index: -1; */
    width: 100vw;
    height: 67vw;   
}
@media (min-width: 600px) {
    .react_root 
    {
        width: 600px;
        height: 400px;   
    }
}
/* #texmatrix{
 margin-bottom: -40px;   
} */
#buttons{
 /* margin-top: -20px; */
 margin-bottom: 5px;   
}
#go{
visibility: hidden;
 margin-top: 10px;
 margin-bottom: -15px;   
}
.centerme { display: block;
     margin-left: auto;
      margin-right: auto;
    text-align: center;
     }

.prevent-select .katex {
    
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  white-space: nowrap
}
</style>


### It's in the title
What does a linear map do to the unit circle? Well, since they make parallelograms out of squares [[3b1b]](https://www.3blue1brown.com/lessons/linear-transformations), you might guess that **a circle becomes an ellipse**. Then you might check an example or two. Let me help you:

<div class="centerme" id="root_0" ></div>
<figcaption class="centerme" style="margin-bottom: 15px">You can move the red and blue image vectors (on the right)</figcaption>

With the intuition affirmed, let's get to **proving** "circles → ellipses".
### Easy mode
Every matrix $$ A $$ has a SVD [[Wiki]](https://en.wikipedia.org/wiki/Singular_value_decomposition), which basically says its action is equivalent to a composition of three simple actions:

<div id="root_1" ></div>
<figcation class="centerme">You know what to do</figcation>

##### LEGEND:  <!-- omit from toc --> 
1. The first action is a rotation (you might know it as $$V^T$$). The unit circle being, well, a circle, doesn't care about this one.
2. Map No. 2 is 

    $$ \begin{bmatrix}
        u \\
        v
        \end{bmatrix}
        = \begin{bmatrix}
    \sigma_1 & 0 \\
    0 & \sigma_2
    \end{bmatrix}
        \begin{bmatrix}
        x \\
        y
        \end{bmatrix}.
    $$

    It scales  the $$ x $$ and $$ y $$ axes by different values, which means the circle

    $$ x^2+y^2=1$$

    becomes

    $$\left(\frac{u}{\sigma_1}\right) ^2+\left( \frac{v}{\sigma_2}\right) ^2=1.$$

    Not a circle anymore, but **still an ellipse**. So far so good.

3. The last action is another rotation ($$ U $$ is the name). The ellipse stays an ellipse, though **its axes might not be aligned** with the up/down and left/right directions anymore.

>Step #2 fails when $$ \sigma_2 = 0$$. What happens then? Take a guess, then check it by aligning **both image vectors in the same direction**.

There's really nothing more to it. *Except...* What if you wanted to work backwards and use the "circles → ellipses" property of linear maps to **prove that the SVD exists?** This isn't *that* far-fetched, it's essentially the geometrical interpretation of Camille Jordan's [original proof](https://en.wikipedia.org/wiki/Singular_value_decomposition#Based_on_variational_characterization). 

### Normal difficulty
We need to avoid circular reasoning, so **the SVD is not allowed**. How do we prove it then?

If A is invertible then we can write


$$ \begin{bmatrix}
u \\
v
\end{bmatrix}
= A
\begin{bmatrix}
x \\
y
\end{bmatrix} $$

as

$$ \begin{bmatrix}
x \\
y
\end{bmatrix}
= A^{-1}
\begin{bmatrix}
u \\
v
\end{bmatrix} $$

which unpacks to 

$$ x = a^{11}u+a^{12}v$$


$$ y = a^{21}u+a^{22}v$$

where $$ a^{ij} $$ is what you think it is. With this in mind, the unit circle

$$ \left\{ \begin{bmatrix}
x \\
y
\end{bmatrix} : x^2+y^2=1 \right\} $$

becomes  

$$ \left\{ \begin{bmatrix}
u \\
v
\end{bmatrix} : (a^{11}u+a^{12}v)^2+(a^{21}u+a^{22}v)^2=1 \right\} $$

after the action of $$ A $$. 

While this set is certainly not as attractive as the one before it, **the defining equation is still quadratic**. The solutions to quadratic equations are **conic sections** [[Wiki]](https://en.wikipedia.org/wiki/Conic_section), and there's just not that much of a variety there:

![Conic Sections](/assets/imgs/900px-Conic_sections_with_plane.svg.png)
<figcaption class="centerme" style="margin-bottom: 15px">Conics. By Pbroks13 <a href="https://commons.wikimedia.org/wiki/File:Conic_sections_with_plane.svg">[Wikimedia]</a>
<br>
Check out the interactive version at <a href="https://cindyjs.org/gallery/main/ConicSections/">CindyJS</a>
</figcaption>

 Specifically, the only **bounded conic is an ellipse**. Since the action of $$ A $$ is continuous, it doesn't make unbounded sets out of compact ones, and the unit circle we started with is certainly compact.

>What happens when $$ A $$ is not invertible? If you consider segments and single points as degenerate ellipses then it's all good.

### It's not over?
Let me play **devil's advocate** for a sec:
- **Exhibit A:** the [textbook approach](https://en.wikipedia.org/wiki/Singular_value_decomposition#Based_on_the_spectral_theorem)  to prove that the SVD exists (Beltrami's original) goes through the diagonalization of $$ A^TA $$.
- **Exhibit B:** we usually do the same to show that the solution set of the quadratic equation in $$ u $$ and $$ v $$ is a conic section.

***Isn't that cheating?***

**No!** Even Descartes [already knew](https://www.jstor.org/stable/2691183) that all you need is to get rid of the $$ u\cdot v $$ term with a well chosen rotation. **Diagonalization is overkill.**

### Go further
   
1. Want more SVD visualizations? Check out [this video](https://www.youtube.com/watch?v=vSczTbgc8Rc).
2. The SVD is the bomb, but don't take it from me. [Here's](https://www.youtube.com/watch?v=YPe5OP7Clv4) **Gilbert Strang** himself **singing its praise.**
3. BTW, if we're on the subject of *singing*, **I learned the SVD exists from [this love song](https://www.youtube.com/watch?v=JEYLfIVvR9I)** 12 years ago. No lie.
4. If you've made it all the way here, you're ready for the [history of the SVD](https://www.jstor.org/stable/2132388). 



